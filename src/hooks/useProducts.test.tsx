import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { act, StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import productsJson from '../mocks/products.json'
import { API, productsError, productsNetworkError, productsSlow } from '../test/handlers'
import { server } from '../test/server'
import { useProducts } from './useProducts'

afterEach(() => {
  vi.restoreAllMocks()
})

// Answers like the default handler, and remembers each request's signal so a test can count
// requests and check which ones were cancelled.
function recordRequests({ delayMs = 0 } = {}) {
  const signals: AbortSignal[] = []
  server.use(
    http.get(`${API}/products`, async ({ request }) => {
      signals.push(request.signal)
      if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
      return HttpResponse.json(productsJson)
    }),
  )
  return signals
}

describe('useProducts', () => {
  it('starts loading, then succeeds with the products', async () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current.status).toBe('loading')

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.products).toHaveLength(24)
    expect(result.current.error).toBeNull()
  })

  it('shows an error, and retry() loads again successfully', async () => {
    server.use(productsError(500, { once: true }))
    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBeInstanceOf(Error)

    act(() => result.current.retry())
    await waitFor(() => expect(result.current.status).toBe('success'))
  })

  it('shows an error when the network fails (offline: no status code at all)', async () => {
    server.use(productsNetworkError())
    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('cancels the request when the component unmounts', async () => {
    const signals = recordRequests({ delayMs: 200 })
    const { unmount } = renderHook(() => useProducts())
    await waitFor(() => expect(signals).toHaveLength(1))

    unmount()
    expect(signals[0].aborted).toBe(true)
  })

  it('never shows an error for its own cancelled request (StrictMode runs the effect twice)', async () => {
    server.use(productsSlow(50))
    const seen: string[] = []
    const { result } = renderHook(
      () => {
        const state = useProducts()
        seen.push(state.status)
        return state
      },
      { wrapper: StrictMode },
    )

    await waitFor(() => expect(result.current.status).toBe('success'))
    // StrictMode cancels the first request. That AbortError must not show up as an 'error' state.
    expect(seen).not.toContain('error')
  })

  it('keeps only one request in flight under StrictMode', async () => {
    const signals = recordRequests({ delayMs: 50 })
    const { result } = renderHook(() => useProducts(), { wrapper: StrictMode })

    await waitFor(() => expect(result.current.status).toBe('success'))
    // The effect ran twice, so two requests started, but the first was cancelled.
    expect(signals.filter((signal) => !signal.aborted)).toHaveLength(1)
  })

  it('sets isRetrying while the retry is pending, and makes exactly one extra request', async () => {
    const signals = recordRequests()
    // Handlers added later answer first, so the first request gets the error, the retry gets recordRequests.
    server.use(productsError(500, { once: true }))
    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.isRetrying).toBe(false)

    act(() => result.current.retry())
    expect(result.current.isRetrying).toBe(true)

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.isRetrying).toBe(false)
    expect(signals).toHaveLength(1) // the first request got the error, the retry is the only one recorded
  })

  it('can fail again after a retry, and retry a second time', async () => {
    server.use(productsError(500, { once: true }))
    server.use(productsError(500, { once: true }))
    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.status).toBe('error'))
    act(() => result.current.retry())
    await waitFor(() => expect(result.current.isRetrying).toBe(false))
    expect(result.current.status).toBe('error')

    act(() => result.current.retry())
    await waitFor(() => expect(result.current.status).toBe('success'))
  })
})

describe('useProducts with a category (TODO 10)', () => {
  it('loads only the chosen category', async () => {
    const { result } = renderHook(() => useProducts('laptops'))

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.products).toHaveLength(5)
  })

  it('loads again when the category changes', async () => {
    const { result, rerender } = renderHook(({ category }) => useProducts(category), {
      initialProps: { category: 'laptops' as string | null },
    })
    await waitFor(() => expect(result.current.data?.products).toHaveLength(5))

    rerender({ category: 'smartphones' })
    await waitFor(() => expect(result.current.data?.products).toHaveLength(8))

    rerender({ category: null })
    await waitFor(() => expect(result.current.data?.products).toHaveLength(24))
  })

  it('cancels the old request when the category changes, so a late answer cannot win', async () => {
    const signals: AbortSignal[] = []
    server.use(
      http.get(`${API}/products/category/:slug`, async ({ request, params }) => {
        signals.push(request.signal)
        await new Promise((resolve) => setTimeout(resolve, 100))
        const products = productsJson.products.filter((product) => product.category === params.slug)
        return HttpResponse.json({ products, total: products.length, skip: 0, limit: products.length })
      }),
    )
    const { result, rerender } = renderHook(({ category }) => useProducts(category), {
      initialProps: { category: 'laptops' },
    })
    await waitFor(() => expect(signals).toHaveLength(1))

    rerender({ category: 'smartphones' })
    expect(signals[0].aborted).toBe(true)

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.products).toHaveLength(8)
  })
})
