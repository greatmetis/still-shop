import { describe, expect, it } from 'vitest'
import { API, categoriesError, productsEmpty, productsError, productsNetworkError } from './handlers'
import { server } from './server'

describe('MSW test setup', () => {
  it('answers the products list with the 24 mock products', async () => {
    const res = await fetch(`${API}/products`)
    expect(await res.json()).toMatchObject({ total: 24, products: expect.any(Array) })
  })

  it('lets a test switch to an error', async () => {
    server.use(productsError(500))
    const res = await fetch(`${API}/products`)
    expect(res.status).toBe(500)
  })

  it('lets a test switch to an empty list', async () => {
    server.use(productsEmpty())
    const res = await fetch(`${API}/products`)
    expect(await res.json()).toMatchObject({ products: [], total: 0 })
  })

  it('applies a `once` error to the next request only', async () => {
    server.use(productsError(500, { once: true }))
    expect((await fetch(`${API}/products`)).status).toBe(500)
    expect((await fetch(`${API}/products`)).status).toBe(200)
  })

  it('lets a test switch to a network failure (fetch rejects, no status)', async () => {
    server.use(productsNetworkError())
    await expect(fetch(`${API}/products`)).rejects.toThrow(TypeError)
  })

  it('answers the categories list with the 24 mock categories', async () => {
    const res = await fetch(`${API}/products/categories`)
    const categories = await res.json()
    expect(categories).toHaveLength(24)
    expect(categories[0]).toEqual({ slug: 'beauty', name: 'Beauty', url: `${API}/products/category/beauty` })
  })

  it('lets a test switch the categories list to an error', async () => {
    server.use(categoriesError(500))
    expect((await fetch(`${API}/products/categories`)).status).toBe(500)
  })
})
