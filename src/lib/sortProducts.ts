import type { Product } from '../api/types'
import type { SortValue } from '../components/types'
import { discountedPrice } from './format';

/**
 * TODO 11: return the products in the order the sort dropdown asks for.
 *
 *   'default'                     → the order the API gave
 *   'price-asc' / 'price-desc'    → by the price the shopper sees, after the discount (use discountedPrice)
 *   'rating-asc' / 'rating-desc'  → by rating
 *   'title-asc' / 'title-desc'    → A–Z / Z–A, using localeCompare so "apple" sits next to "Banana"
 *
 * - Don't change the array you were given: React state must never be changed in place.
 *   Array `sort` changes the original array; `toSorted` returns a sorted copy.
 * - Products that tie (same price, say) keep their original order, in both directions.
 *
 * How to start: in sortProducts.test.ts change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: sort comparators, switch on a union type, why mutating state is a bug.
 * Resources: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
 *            https://react.dev/learn/updating-arrays-in-state
 */

function shownPrice(p:Product): number{
  return discountedPrice(p.price, p.discountPercentage);
}

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  
  switch (sort) {
    case 'default':     return products
    case 'price-asc':   return products.toSorted((a, b) => shownPrice(a) - shownPrice(b))
    case 'price-desc':  return products.toSorted((a, b) => shownPrice(b) - shownPrice(a))
    case 'rating-asc':  return products.toSorted((a, b) => a.rating - b.rating)
    case 'rating-desc': return products.toSorted((a, b) => b.rating - a.rating)
    case 'title-asc':   return products.toSorted((a, b) => a.title.localeCompare(b.title))
    case 'title-desc':  return products.toSorted((a, b) => b.title.localeCompare(a.title))
  }
  
}
