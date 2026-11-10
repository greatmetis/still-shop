import { API_BASE } from './baseUrl'
import type { ProductsResponse } from './types'

/**
 * Thrown when the server answers with an error status (404, 500, ...).
 * Ready-made, so you can focus on getProducts. Read it: `extends Error` makes a custom error type
 * you can check with `error instanceof ApiError`, and `status` carries the HTTP status code.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * TODO 4: fetch every product from DummyJSON.
 *
 *   GET `${API_BASE}/products?limit=0`   (limit=0 means "all products", about 194)
 *
 * - Pass `signal` to fetch, so the caller can cancel the request (AbortController). This is a situation when request is fine but we don't want the answer. In our example, searchBox can continously recieve new data. For instanace, the user types “ph”, which starts request A, then “phone”, which starts request B. If A is slow and arrives after B, your page shows the results for “ph” under a search box that says “phone”. Cancelling A when B starts means only the latest answer can win.
 * - The trap: fetch does NOT throw on 404 or 500. Check `response.ok` and throw
 *   `new ApiError(response.status, ...)` yourself when it is false.
 * - Return the parsed JSON as a ProductsResponse.
 * - Only use try catch when I can do anything about it. For exmaple print it on the screen. Here we don't have access to the screen, so it should let the error pass through to whoever called it.
 *
 * How to start: in products.test.ts change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: fetch, response.ok, async/await, error classes, AbortController.
 * Resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *            https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 *
 * TODO 10 (part 2): when `category` is set, fetch only that category.
 *
 *   getProducts({ category: 'laptops' })  → GET `${API_BASE}/products/category/laptops?limit=0`
 *   getProducts() or category null        → GET `${API_BASE}/products?limit=0`   (as now)
 *
 * - The category comes from the URL, so anyone can type anything, even a "/". Encode it with
 *   encodeURIComponent before putting it into the path.
 *
 * How to start: in products.test.ts change the second `describe.skip` to `describe`.
 * Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */

export async function getProducts({ signal,category }: { signal?: AbortSignal; category?: string | null } = {}): Promise<ProductsResponse> {
  // check category to decide which api is going to be called
  const api : string = category 
  ? `${API_BASE}/products/category/${encodeURIComponent(category)}?limit=0` 
  : `${API_BASE}/products?limit=0`
  
  const response = await fetch(api,{
    signal: signal
  });
    //Throw error when response doesn't have ok
    if(!response.ok){
      throw new ApiError(response.status,"Fetch Failed");
    }
    const result = await response.json();
    return result;
}
