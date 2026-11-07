import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

const DELAY = 300

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

function renderDebounce(initial: string) {
  return renderHook(({ value }) => useDebounce(value, DELAY), { initialProps: { value: initial } })
}

// Fake timers let a test move the clock itself, so nothing really waits 300 ms.
describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the first value straight away', () => {
    const { result } = renderDebounce('a')
    expect(result.current).toBe('a')
  })

  it('keeps the old value until the delay has passed', () => {
    const { result, rerender } = renderDebounce('a')
    rerender({ value: 'b' })

    advance(DELAY - 1)
    expect(result.current).toBe('a')
  })

  it('updates to the new value once the delay has passed', () => {
    const { result, rerender } = renderDebounce('a')
    rerender({ value: 'b' })

    advance(DELAY)
    expect(result.current).toBe('b')
  })

  it('gives one update with the last value after rapid changes', () => {
    const seen: string[] = []
    const { rerender } = renderHook(
      ({ value }) => {
        const debounced = useDebounce(value, DELAY)
        if (seen.at(-1) !== debounced) seen.push(debounced)
        return debounced
      },
      { initialProps: { value: 'a' } },
    )

    // Each change comes before the previous timer ends, so only the last one may get through.
    rerender({ value: 'b' })
    advance(DELAY - 100)
    rerender({ value: 'c' })
    advance(DELAY - 100)
    rerender({ value: 'd' })
    advance(DELAY)

    expect(seen).toEqual(['a', 'd'])
  })

  it('clears the timer when the component unmounts', () => {
    const { rerender, unmount } = renderDebounce('a')
    rerender({ value: 'b' })

    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
