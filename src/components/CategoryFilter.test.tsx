import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CategoryFilter } from './CategoryFilter'

const options = [
  { slug: 'beauty', name: 'Beauty' },
  { slug: 'laptops', name: 'Laptops' },
]
const base = { id: 'cat', label: 'Category', options, value: null, onChange: () => {} }

describe('CategoryFilter', () => {
  it('lists "All categories" first and selects it when value is null (minimal props)', () => {
    render(<CategoryFilter {...base} />)
    const select = screen.getByRole('combobox', { name: 'Category' })
    expect(select).toHaveValue('')
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['All categories', 'Beauty', 'Laptops'])
  })

  it('selects the given category (maximal props)', () => {
    render(<CategoryFilter {...base} value="laptops" />)
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue('laptops')
  })

  it('shows only "Loading…" and is disabled while loading', () => {
    render(<CategoryFilter {...base} options={[]} loading />)
    expect(screen.getByRole('combobox', { name: 'Category' })).toBeDisabled()
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Loading…'])
  })

  it('can be disabled and still show its normal options', () => {
    render(<CategoryFilter {...base} disabled />)
    expect(screen.getByRole('combobox', { name: 'Category' })).toBeDisabled()
    expect(screen.getByRole('option', { name: 'All categories' })).toBeInTheDocument()
  })

  it('reports the slug when a category is chosen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn<(slug: string | null) => void>()
    render(<CategoryFilter {...base} onChange={onChange} />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'Beauty')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('beauty')
  })

  it('reports null when "All categories" is chosen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn<(slug: string | null) => void>()
    render(<CategoryFilter {...base} value="beauty" onChange={onChange} />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'All categories')
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
