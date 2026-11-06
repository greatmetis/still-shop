import { describe, expect, it } from 'vitest'
import categoriesJson from '../mocks/categories.json'
import { toCategoryOption } from './toCategoryOption'

describe('toCategoryOption', () => {
  it('keeps slug and name, and drops url', () => {
    expect(toCategoryOption(categoriesJson[0])).toEqual({ slug: 'beauty', name: 'Beauty' })
  })

  it('works with Array.map over the whole list', () => {
    const options = categoriesJson.map(toCategoryOption)
    expect(options).toHaveLength(24)
    expect(options.every((option) => !('url' in option))).toBe(true)
  })
})
