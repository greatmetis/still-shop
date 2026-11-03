// TODO(you) 1: rename this file to types.test.ts once your types in ./types.ts are written.
// Most of these "tests" are checked by TypeScript (`npm run typecheck`), not at runtime.
import { describe, expect, it } from 'vitest'
import categoriesJson from '../mocks/categories.json'
import productsJson from '../mocks/products.json'
import type { Category, Product, ProductsResponse, Review } from './types'

// JSON imports type `availabilityStatus` as plain `string`, which is wider than your union.
// Telling TypeScript "trust me, it is one of the allowed values" is the one cast we need here.
const response: ProductsResponse = {
  ...productsJson,
  products: productsJson.products.map((p) => ({
    ...p,
    availabilityStatus: p.availabilityStatus as Product['availabilityStatus'],
  })),
}
const categories: Category[] = categoriesJson

describe('API types', () => {
  it('describe the real mock data', () => {
    expect(response.products).toHaveLength(24)
    expect(categories.length).toBeGreaterThan(0)
  })

  it('allow products without a brand (brand is optional)', () => {
    const withoutBrand = response.products.filter((p) => p.brand === undefined)
    expect(withoutBrand.length).toBeGreaterThan(0)
  })

  it('type reviews as Review objects', () => {
    const review: Review = response.products[0].reviews[0]
    expect(review.rating).toBeGreaterThanOrEqual(1)
  })

  it('only allow the three known stock statuses', () => {
    const ok: Product['availabilityStatus'] = 'Low Stock'
    // @ts-expect-error "Sold out" is not one of the allowed values
    const bad: Product['availabilityStatus'] = 'Sold out'
    expect([ok, bad]).toHaveLength(2)
  })
})
