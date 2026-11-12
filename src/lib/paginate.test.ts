import { describe, expect, it } from 'vitest'
import { clampPage, paginate, totalPages } from './paginate'

// 1, 2, 3 … n, so a test can see exactly which items a page holds.
const numbers = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

describe('totalPages', () => {
  it.each([
    [0, 1],
    [1, 1],
    [12, 1],
    [13, 2],
    [24, 2],
    [194, 17],
  ])('%i items need %i page(s)', (count, pages) => {
    expect(totalPages(count)).toBe(pages)
  })

  it('uses a different page size when given one', () => {
    expect(totalPages(10, 5)).toBe(2)
    expect(totalPages(11, 5)).toBe(3)
  })
})

describe('clampPage', () => {
  it('keeps a page that exists', () => {
    expect(clampPage(2, 3)).toBe(2)
  })

  it('moves a page past the end to the last page', () => {
    expect(clampPage(999, 17)).toBe(17)
  })

  it('moves page 0 or less to page 1', () => {
    expect(clampPage(0, 3)).toBe(1)
    expect(clampPage(-3, 3)).toBe(1)
  })
})

describe('paginate', () => {
  it('gives items 1–12 on page 1', () => {
    expect(paginate(numbers(30), 1)).toEqual(numbers(12))
  })

  it('gives items 13–24 on page 2', () => {
    expect(paginate(numbers(30), 2)).toEqual([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
  })

  it('gives the leftover items on the last page', () => {
    expect(paginate(numbers(30), 3)).toEqual([25, 26, 27, 28, 29, 30])
    expect(paginate(numbers(194), 17)).toEqual([193, 194])
  })

  it('gives an empty page when there are no items', () => {
    expect(paginate([], 1)).toEqual([])
  })

  it('uses a different page size when given one', () => {
    expect(paginate(numbers(10), 2, 5)).toEqual([6, 7, 8, 9, 10])
  })

  it('does not change the array it was given', () => {
    const items = numbers(30)
    paginate(items, 2)
    expect(items).toEqual(numbers(30))
  })
})
