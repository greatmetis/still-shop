import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { API, productsError, productsNetworkError, productsSlow } from '../test/handlers'
import { server } from '../test/server'
import { ApiError, getProducts } from './products'

describe('getProducts', () => {
  it('returns the products response', async () => {
    const response = await getProducts()
    expect(response.total).toBe(24)
    expect(response.products).toHaveLength(24)
    expect(response.products[0].title).toBe('iPhone 5s')
  })

  it('asks for all products with limit=0', async () => {
    let requestedUrl = ''
    server.use(
      http.get(`${API}/products`, ({ request }) => {
        requestedUrl = request.url
        return HttpResponse.json({ products: [], total: 0, skip: 0, limit: 0 })
      }),
    )
    await getProducts()
    expect(new URL(requestedUrl).searchParams.get('limit')).toBe('0')
  })

  it('rejects with an ApiError carrying the status on a 500', async () => {
    server.use(productsError(500))
    const promise = getProducts()
    await expect(promise).rejects.toBeInstanceOf(ApiError)
    await expect(promise).rejects.toMatchObject({ status: 500 })
  })

  it('rejects with an ApiError on a 404 too', async () => {
    server.use(productsError(404))
    await expect(getProducts()).rejects.toMatchObject({ name: 'ApiError', status: 404 })
  })

  it('rejects with an AbortError when the request is cancelled', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(getProducts({ signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('rejects with an AbortError when the request is cancelled while it is running', async () => {
    server.use(productsSlow(200))
    const controller = new AbortController()
    const promise = getProducts({ signal: controller.signal })
    controller.abort()
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('lets a network failure pass through as a TypeError, not an ApiError', async () => {
    server.use(productsNetworkError())
    const promise = getProducts()
    await expect(promise).rejects.toBeInstanceOf(TypeError)
    await expect(promise).rejects.not.toBeInstanceOf(ApiError)
  })
})

describe('getProducts with a category (TODO 10)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Replaces fetch for one test, so the test can see exactly which URL was asked for.
  function spyOnFetch() {
    return vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ products: [], total: 0, skip: 0, limit: 0 }))
  }

  it('returns only the products in that category', async () => {
    const response = await getProducts({ category: 'laptops' })
    expect(response.total).toBe(5)
    expect(response.products.every((product) => product.category === 'laptops')).toBe(true)
  })

  it('asks for all products in the category with limit=0', async () => {
    const fetchSpy = spyOnFetch()
    await getProducts({ category: 'laptops' })
    expect(fetchSpy.mock.calls[0][0]).toBe(`${API}/products/category/laptops?limit=0`)
  })

  it('asks for every product when the category is null', async () => {
    const fetchSpy = spyOnFetch()
    await getProducts({ category: null })
    expect(fetchSpy.mock.calls[0][0]).toBe(`${API}/products?limit=0`)
  })

  it('encodes the category, so text from the URL cannot change the path', async () => {
    const fetchSpy = spyOnFetch()
    await getProducts({ category: '../users' })
    expect(fetchSpy.mock.calls[0][0]).toBe(`${API}/products/category/..%2Fusers?limit=0`)
  })

  it('still passes the signal on, so the request can be cancelled', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(getProducts({ category: 'laptops', signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    })
  })
})
