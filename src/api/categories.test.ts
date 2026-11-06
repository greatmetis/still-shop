import { describe, expect, it } from 'vitest'
import { categoriesError, categoriesNetworkError, categoriesSlow } from '../test/handlers'
import { server } from '../test/server'
import { getCategories } from './categories'
import { ApiError } from './products'

describe('getCategories', () => {
  it('returns the categories', async () => {
    const categories = await getCategories()
    expect(categories).toHaveLength(24)
    expect(categories[0]).toMatchObject({ slug: 'beauty', name: 'Beauty' })
  })

  it('rejects with an ApiError carrying the status on a 500', async () => {
    server.use(categoriesError(500))
    const promise = getCategories()
    await expect(promise).rejects.toBeInstanceOf(ApiError)
    await expect(promise).rejects.toMatchObject({ status: 500 })
  })

  it('rejects with an AbortError when the request is cancelled', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(getCategories({ signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('rejects with an AbortError when the request is cancelled while it is running', async () => {
    server.use(categoriesSlow(200))
    const controller = new AbortController()
    const promise = getCategories({ signal: controller.signal })
    controller.abort()
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('lets a network failure pass through as a TypeError, not an ApiError', async () => {
    server.use(categoriesNetworkError())
    const promise = getCategories()
    await expect(promise).rejects.toBeInstanceOf(TypeError)
    await expect(promise).rejects.not.toBeInstanceOf(ApiError)
  })
})
