import { describe, expect, it } from 'vitest'
import { clamp } from './clamp'

// TODO(you) 0: remove `.skip` to switch these tests on.
describe('clamp', () => {
  it('returns n when it is inside the range', () => {
    expect(clamp(5, 1, 10)).toBe(5)
  })

  it('returns min when n is below the range', () => {
    expect(clamp(-3, 1, 10)).toBe(1)
  })

  it('returns max when n is above the range', () => {
    expect(clamp(42, 1, 10)).toBe(10)
  })

  it('works when min equals max', () => {
    expect(clamp(7, 3, 3)).toBe(3)
  })
})
