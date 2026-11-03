import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SortSelect } from './SortSelect'
import type { SortOption, SortValue } from './types'

const options: SortOption[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'title-desc', label: 'Name: Z–A' },
]

describe('SortSelect', () => {
  it('is a labelled select with the current option selected', () => {
    render(<SortSelect id="sort" label="Sort by" options={options} value="price-asc" onChange={() => {}} />)
    const select = screen.getByRole('combobox', { name: 'Sort by' })
    expect(select).toHaveValue('price-asc')
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('reports the chosen sort value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn<(value: SortValue) => void>()
    render(<SortSelect id="sort" label="Sort by" options={options} value="default" onChange={onChange} />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'Name: Z–A')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('title-desc')
  })

  it('can be disabled', () => {
    render(<SortSelect id="sort" label="Sort by" options={options} value="default" onChange={() => {}} disabled />)
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeDisabled()
  })
})
