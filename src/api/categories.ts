import type { Category } from './types'
import { API_BASE } from './baseUrl'
import { ApiError } from './products';

/**
 * Fetch the category list from DummyJSON.
 *
 *   GET `${API_BASE}/products/categories`   (answers with an array of { slug, name, url })
 *
 * Same rules as getProducts in ./products.ts: cancellable with `signal`, and an error status
 * becomes an ApiError. Reuse ApiError, don't write a second one.
 *
 * How to start: in categories.test.ts change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: reusing a pattern you already wrote.
 */
export async function getCategories({signal}:{signal?:AbortSignal}={}): Promise<Category[]> {
  // fetch URL with signal to hand cancellation
  const response = await fetch(`${API_BASE}/products/categories`,{
    signal:signal
  });
  
  //Throw error when response doesn't have ok
  if(!response.ok){
    throw new ApiError(response.status, "Fetch Failed");
  }

  // parse JSON in to Javascript values
  return response.json();
}
