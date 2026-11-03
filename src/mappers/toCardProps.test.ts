import { describe, expect, it } from 'vitest'
import { mockCardProps } from '../mocks/cardProps'
import type { Product } from '../api/types'
import productsJson from '../mocks/products.json'
import { toCardProps } from './toCardProps'

// JSON imports type availabilityStatus as plain `string`; this cast narrows it to your union (same as TODO 1's test).
const products: Product[] = productsJson.products.map((p) => ({
  ...p,
  availabilityStatus: p.availabilityStatus as Product['availabilityStatus'],
}))
const byId = (id: number) => {
  const product = products.find((p) => p.id === id)
  if (!product) throw new Error(`no product ${id} in the mocks`)
  return product
}

describe('toCardProps', () => {
  it('produces exactly the hand-written card props the layout was built with', () => {
    // The first 12 hand-written cards in src/mocks/cardProps.ts are your target.
    products.slice(0, 12).forEach((product, index) => {
      expect(toCardProps(product, index)).toEqual(mockCardProps[index])
    })
  })

  it('leaves out the original price and label when there is no discount', () => {
    const card = toCardProps({ ...byId(121), discountPercentage: 0 }, 0)
    expect(card.price).toEqual({ price: '$199.99' })
  })

  it('test for 5% discount', () => {
    const card = toCardProps({...byId(125), discountPercentage: 5}, 0);
    expect(card.price).toEqual({price:'$237.49',originalPrice:'$249.99',discountLabel: '−5%'});
  })

  it('shows one decimal for discounts under 1%', () => {
    const card = toCardProps({...byId(121), discountPercentage: 0.4}, 0);
    expect(card.price).toEqual({price:'$199.19',originalPrice:'$199.99',discountLabel: '−0.4%'});
  })

  it('shows no badge when the discount rounds to 0%', () => {
  const card = toCardProps({ ...byId(121), discountPercentage: 0.04 }, 0)
  expect(card.price).toEqual({ price: '$199.99' })
})

it('shows no badge for a negative discount', () => {
  const card = toCardProps({ ...byId(121), discountPercentage: -5 }, 0)
  expect(card.price).toEqual({ price: '$199.99' })
})

  it('labels low stock with the number left', () => {
    expect(toCardProps(byId(9), 0).stock).toEqual({ status: 'low-stock', label: 'Low stock: 4 left' })
  })

  it('labels out-of-stock products', () => {
    expect(toCardProps(byId(117), 0).stock).toEqual({ status: 'out-of-stock', label: 'Out of stock' })
  })

  it('turns a category slug into a readable name', () => {
    expect(toCardProps({ ...byId(121), category: 'home-decoration' }, 0).categoryName).toBe('Home Decoration')
  })

  it('works for products without a brand', () => {
    // Arrange: product 16 ("Apple") has no brand in the API data
    const card = toCardProps(byId(16), 0)
    
    // Assert: the card has everything it shows, even without a brand
    expect(card).toMatchObject({
      title: 'Apple',
      categoryName: 'Groceries',
      price: { price: '$1.74', originalPrice: '$1.99', discountLabel: '−13%' },
      stock: { status: 'in-stock', label: 'In stock' },
    })
  })
})
