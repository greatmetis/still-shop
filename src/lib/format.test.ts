import { describe, expect, it } from 'vitest'
import { discountedPrice, formatDate, formatPrice } from './format'

describe('discountedPrice', () => {
  it('takes the discount off and rounds to cents', () => {
    expect(discountedPrice(9.99, 10)).toBe(8.99)
  })

  it('returns the same price when there is no discount', () => {
    expect(discountedPrice(100, 0)).toBe(100)
  })

  it('avoids the floating-point trap', () => {
    // 19.99 * 0.85 is 16.991499999999998 in JavaScript
    expect(discountedPrice(19.99, 15)).toBe(16.99)
  })

  it('matches the real data', () => {
    // iPhone 5s in products.json: $199.99 with 12.91% off
    expect(discountedPrice(199.99, 12.91)).toBe(174.17)
  })
})

describe('formatPrice', () => {
  it('formats US dollars with two decimals', () => {
    expect(formatPrice(8.99)).toBe('$8.99')
    expect(formatPrice(100)).toBe('$100.00')
  })

  it('adds thousands separators', () => {
    expect(formatPrice(1099.99)).toBe('$1,099.99')
  })
})

describe('formatDate', () => {
  it('formats an ISO date as "Mon D, YYYY"', () => {
    expect(formatDate('2026-10-25T12:00:00.000Z')).toBe('Oct 25, 2026')
  })

  it('returns an empty string for an invalid date instead of throwing', () => {
    expect(() => formatDate('not a date')).not.toThrow()
    expect(formatDate('not a date')).toBe('')
  })

  it('formats the very first moment of 1970 (time 0) as a real date', () => {
    expect(formatDate('1970-01-01T00:00:00Z')).not.toBe('')
  })
})
