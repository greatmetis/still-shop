import { describe, expect, it } from 'vitest'
import { getPageItems } from './getPageItems'

const E = 'ellipsis'

describe('getPageItems', () => {
  it('returns nothing for zero pages', () => {
    expect(getPageItems(1, 0)).toEqual([])
  })

  it('returns just [1] for a single page', () => {
    expect(getPageItems(1, 1)).toEqual([1])
  })

  it('shows every page when there are only 5', () => {
    for (let current = 1; current <= 5; current++) {
      expect(getPageItems(current, 5)).toEqual([1, 2, 3, 4, 5])
    }
  })

  it('17 pages, at the start: 1 2 3 … 17', () => {
    expect(getPageItems(1, 17)).toEqual([1, 2, 3, E, 17])
    expect(getPageItems(2, 17)).toEqual([1, 2, 3, E, 17])
  })

  it('17 pages, page 3 keeps the neighbour: 1 2 3 4 … 17', () => {
    expect(getPageItems(3, 17)).toEqual([1, 2, 3, 4, E, 17])
  })

  it('17 pages, in the middle: 1 … 4 5 6 … 17', () => {
    expect(getPageItems(5, 17)).toEqual([1, E, 4, 5, 6, E, 17])
  })

  it('replaces a one-page gap with the page itself', () => {
    // page 4 of 17: gap between 1 and 3 hides only page 2
    expect(getPageItems(4, 17)).toEqual([1, 2, 3, 4, 5, E, 17])
  })

  it('17 pages, at the end: 1 … 15 16 17', () => {
    expect(getPageItems(17, 17)).toEqual([1, E, 15, 16, 17])
    expect(getPageItems(16, 17)).toEqual([1, E, 15, 16, 17])
  })

  it('17 pages, near the end: 1 … 14 15 16 17', () => {
    expect(getPageItems(15, 17)).toEqual([1, E, 14, 15, 16, 17])
  })
})
