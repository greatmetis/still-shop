import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { act, StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import categoriesJson from '../mocks/categories.json'
import { API, categoriesError, categoriesNetworkError, categoriesSlow } from '../test/handlers'
import { server } from '../test/server'
import { useCategories } from './useCategories'

// Answers like the default handler, and remembers each request's signal so a test can check for cancelling.
function recordRequests() {
  const signals: AbortSignal[] = []
  server.use(
    http.get(`${API}/products/categories`, async ({ request }) => {
      signals.push(request.signal)
      await new Promise((resolve) => setTimeout(resolve, 200))
      return HttpResponse.json(categoriesJson)
    }),
  )
  return signals
}

describe('useCategories', () => {
  it('starts loading, then succeeds with the categories', async () => {
    const { result } = renderHook(() => useCategories())
    expect(result.current.status).toBe('loading')

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toHaveLength(24)
    expect(result.current.error).toBeNull()
  })

  it('shows an error, and retry() loads again successfully', async () => {
    server.use(categoriesError(500, { once: true }))
    const { result } = renderHook(() => useCategories())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBeInstanceOf(Error)

    act(() => result.current.retry())
    await waitFor(() => expect(result.current.status).toBe('success'))
  })

  it('shows an error when the network fails', async () => {
    server.use(categoriesNetworkError())
    const { result } = renderHook(() => useCategories())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('cancels the request when the component unmounts', async () => {
    const signals = recordRequests()
    const { unmount } = renderHook(() => useCategories())
    await waitFor(() => expect(signals).toHaveLength(1))

    unmount()
    expect(signals[0].aborted).toBe(true)
  })

  it('never shows an error for its own cancelled request (StrictMode runs the effect twice)', async () => {
    server.use(categoriesSlow(50))
    const seen: string[] = []
    const { result } = renderHook(
      () => {
        const state = useCategories()
        seen.push(state.status)
        return state
      },
      { wrapper: StrictMode },
    )

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(seen).not.toContain('error')
  })
})
