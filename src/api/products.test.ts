import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
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
