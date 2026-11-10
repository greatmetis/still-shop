import { describe, expect, it } from 'vitest'
import type { SortValue } from '../components/types'
import { DEFAULT_PARAMS, hrefForPage, parseParams, serializeParams } from './searchParams'

const parse = (query: string) => parseParams(new URLSearchParams(query))
    
describe('parseParams', () => {
  it('uses the defaults for an empty query string', () => {
    expect(parse('')).toEqual(DEFAULT_PARAMS)
  })

  it('reads every value', () => {
    expect(parse('q=phone&category=beauty&sort=price-asc&page=2')).toEqual({
      q: 'phone',
      category: 'beauty',
      sort: 'price-asc',
      page: 2,
    })
  })

  it.each(['-3', '0', 'abc', '2.5', '3abc', ''])('falls back to page 1 for page=%s', (page) => {
    expect(parse(`page=${page}`).page).toBe(1)
  })

  it('keeps a high page number, which is handled once the page count is known', () => {
    expect(parse('page=999').page).toBe(999)
  })

  it('falls back to the default sort for an unknown value', () => {
    expect(parse('sort=nope').sort).toBe('default')
  })

  it.each<SortValue>(['default', 'price-asc', 'price-desc', 'rating-desc', 'rating-asc', 'title-asc', 'title-desc'])(
    'accepts sort=%s',
    (sort) => {
      expect(parse(`sort=${sort}`).sort).toBe(sort)
    },
  )

  it('reads spaces and unicode in the search text', () => {
    expect(parse('q=red%20shoes').q).toBe('red shoes')
    expect(parse('q=red+shoes').q).toBe('red shoes')
    expect(parse('q=%E6%89%8B%E6%A9%9F').q).toBe('手機')
  })

  it('treats an empty category as All categories', () => {
    expect(parse('category=').category).toBeNull()
  })

  it('keeps a category it does not know, which is checked later against the fetched list', () => {
    expect(parse('category=unknown').category).toBe('unknown')
  })

  it('ignores other keys', () => {
    expect(parse('utm_source=mail&page=2&foo=bar')).toEqual({ ...DEFAULT_PARAMS, page: 2 })
  })
})

describe('serializeParams', () => {
  it('leaves out every default', () => {
    expect(serializeParams(DEFAULT_PARAMS)).toBe('')
  })

  it('writes values in the order q, category, sort, page', () => {
    expect(serializeParams({ q: 'phone', category: 'beauty', sort: 'price-asc', page: 2 })).toBe(
      'q=phone&category=beauty&sort=price-asc&page=2',
    )
  })

  it('writes only the values that are not defaults', () => {
    expect(serializeParams({ ...DEFAULT_PARAMS, sort: 'title-asc' })).toBe('sort=title-asc')
  })

  it('encodes symbols in the search text', () => {
    expect(serializeParams({ ...DEFAULT_PARAMS, q: 'a&b' })).toBe('q=a%26b')
  })

  it.each(['', 'q=phone', 'category=beauty&page=4', 'q=red+shoes&sort=rating-desc', 'q=%3Cscript%3E&page=2'])(
    'gives back the same string after parsing: "%s"',
    (query) => {
      expect(serializeParams(parse(query))).toBe(query)
    },
  )

  it('tidies up defaults, bad values and key order', () => {
    expect(serializeParams(parse('page=2&foo=bar&sort=nope&q=phone'))).toBe('q=phone&page=2')
    expect(serializeParams(parse('page=1&sort=default&q='))).toBe('')
  })
})

describe('hrefForPage', () => {
  it('sets the page and keeps the filters', () => {
    const params = { q: 'phone', category: 'beauty', sort: 'price-asc', page: 1 } as const
    expect(hrefForPage(params, 3)).toBe('?q=phone&category=beauty&sort=price-asc&page=3')
  })

  it('replaces the current page', () => {
    expect(hrefForPage({ ...DEFAULT_PARAMS, page: 5 }, 2)).toBe('?page=2')
  })

  it('leaves the page out for page 1', () => {
    expect(hrefForPage({ ...DEFAULT_PARAMS, q: 'phone', page: 5 }, 1)).toBe('?q=phone')
    expect(hrefForPage(DEFAULT_PARAMS, 1)).toBe('?')
  })
})
