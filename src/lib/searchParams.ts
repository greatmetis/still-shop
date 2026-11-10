import type { SortValue } from '../components/types'

/** The catalog's filters, in the form the app uses. */
export interface CatalogParams {
  q: string
  /** null = All categories */
  category: string | null
  sort: SortValue
  page: number
}

export const DEFAULT_PARAMS: CatalogParams = { q: '', category: null, sort: 'default', page: 1 }

const SORT = ['default','price-asc','price-desc','rating-desc','rating-asc','title-asc','title-desc'];

/**
 * TODO 9 (part 1): read the URL's query string and return safe values. Anyone can type anything into a URL.
 *
 *   ?q=phone&category=beauty&sort=price-asc&page=2  → { q: 'phone', category: 'beauty', sort: 'price-asc', page: 2 }
 *   ?sort=nope&page=abc                             → { q: '', category: null, sort: 'default', page: 1 }
 *
 * - `page` must be a whole number of 1 or more; anything else becomes 1. Too-high pages are handled later.
 * - `sort` must be one of the SortValues; anything else becomes 'default'.
 * - An empty `category` becomes null. Whether a category really exists is checked in TODO 10.
 * - Ignore any other keys.
 *
 * Hint: TypeScript types don't exist while the code runs, so `SortValue` alone can't check a string.
 *
 * How to start: in searchParams.test.ts change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: URLSearchParams, union types as allowed values, TypeScript narrowing.
 * Resources: MDN URLSearchParams and the TypeScript Handbook "Narrowing".
 */
export function parseParams(searchParams: URLSearchParams): CatalogParams {
  
  //sort must be SortValue

  function isSortVal(sort: string) : sort is SortValue {
    return SORT.includes(sort); // return true when it's not null and in the list
  }
  const sortInput : string | null = searchParams.get("sort");
  const sortParam : SortValue = (sortInput && isSortVal(sortInput))
    ? sortInput
    : "default";


  //page must be a whole number of 1 or more; anything else becomes 1
  function getPageNum(page: string | null) : number {
    const intPage =  Number(page);
    return (intPage > 0 && Number.isInteger(intPage))
      ? intPage
      : 1;
  }

  // category
  const categoryInput = searchParams.get("category") ? searchParams.get("category") : null;

  const catalogParams = {
    q: searchParams.get("q") ?? '',
    category: categoryInput,
    sort: sortParam,
    page: getPageNum(searchParams.get("page"))
  }

  return catalogParams;
}

/**
 * TODO 9 (part 2): the opposite direction. Return a query string without the leading "?".
 *
 *   { q: 'phone', category: null, sort: 'price-asc', page: 2 }  → 'q=phone&sort=price-asc&page=2'
 *   DEFAULT_PARAMS                                              → ''
 *
 * - Leave out default values, so page 1 doesn't add `page=1`.
 * - Always use the same key order: q, category, sort, page.
 * - URLSearchParams can build the string and handles spaces and symbols for you.
 */
export function serializeParams(params: CatalogParams): string {
  
  const query = new URLSearchParams("");
    // Leave out default values: page != 1; sort != "default"; category is truthy; q is truthy
  if (params.q) query.append('q', params.q);
  if(params.category) query.append('category', params.category);
  if(params.sort !== "default") query.append('sort', params.sort);
  if(params.page !== 1) query.append('page', (params.page).toString());
  
  return query.toString();
}

/**
 * TODO 9 (part 3): the link for one page number, keeping the current filters. Pagination uses it.
 *
 *   hrefForPage({ ...DEFAULT_PARAMS, q: 'phone' }, 3)  → '?q=phone&page=3'
 *   hrefForPage(DEFAULT_PARAMS, 1)                     → '?'
 *
 * Reuse serializeParams.
 */
export function hrefForPage(params: CatalogParams, page: number): string {
  return "?" + serializeParams({...params, page})
}
