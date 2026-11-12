/**
 * TODO 12: the maths behind the page numbers. Three small functions; do them in order.
 *
 * How to start: in paginate.test.ts change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: Math.ceil, slice, off-by-one errors, edge cases (0 items, page 999).
 * Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 */

import { clamp } from "./clamp";

export const PAGE_SIZE = 12

/**
 * Part 1: how many pages `count` items need.
 *
 *   totalPages(24) → 2     totalPages(25) → 3     totalPages(0) → 1   (an empty result is still one page)
 */
export function totalPages(count: number, pageSize: number = PAGE_SIZE): number {
  const pages = Math.ceil(count / pageSize);
  return pages === 0 
  ? 1
  : pages;

}

/**
 * Part 2: keep a page number between 1 and the last page. ?page=999 shows the last page instead of nothing.
 *
 *   clampPage(5, 3) → 3     clampPage(0, 3) → 1     clampPage(2, 3) → 2
 *
 * Hint: you wrote a function for exactly this in TODO 0.
 */
export function clampPage(page: number, total: number): number {
  return clamp(page, 1, total)
}

/**
 * Part 3: the items on one page (pages start at 1).
 *
 *   paginate(items, 1) → items 1–12     paginate(items, 2) → items 13–24
 *
 * `<T>` means it works for an array of anything, like your useDebounce.
 */
export function paginate<T>(items: T[], page: number, pageSize: number = PAGE_SIZE): T[] {
  const from = page <= 1 ? 0 : (page - 1) * pageSize;
  const to = from + pageSize;
  return items.slice(from,to);
}
