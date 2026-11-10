import type { Product } from '../api/types'

/**
 * TODO 10 (part 1): keep the products whose title contains the search text.
 *
 *   filterProducts(products, 'iphone')    → the 4 iPhones
 *   filterProducts(products, '  OPPO  ')  → the 3 Oppo phones
 *   filterProducts(products, '')          → every product
 *
 * - Ignore upper and lower case, and spaces around the search text.
 * - The search text comes from the URL, so it can be anything, like `c++` or `(`. It must never crash.
 *
 * How to start: in filterProducts.test.ts change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: Array filter, string includes, toLowerCase and trim.
 * Resource: https://javascript.info/array-methods (the "filter" part).
 */
export function filterProducts(products: Product[], q: string): Product[] {
  q = q.trim().toLowerCase();
  const result :Product[]= products.filter(p=>
    p.title.toLowerCase().includes(q)
  );

  return result;
}
