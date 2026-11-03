import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBox } from './SearchBox'

const base = { id: 'q', label: 'Search products', value: '', onChange: () => {}, onClear: () => {} }

describe('SearchBox', () => {
  it('has a labelled search input inside a search landmark and no clear button when empty', () => {
    render(<SearchBox {...base} />)
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByLabelText('Search products')).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('shows the placeholder and the clear button when it has text (maximal props)', () => {
    render(<SearchBox {...base} value="cream" placeholder="Search by name" />)
    expect(screen.getByPlaceholderText('Search by name')).toHaveValue('cream')
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
  })

  it('reports the typed text through onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn<(value: string) => void>()
    render(<SearchBox {...base} onChange={onChange} />)
    await user.type(screen.getByLabelText('Search products'), 'a')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('calls onClear once when the clear button is clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn<() => void>()
    render(<SearchBox {...base} value="cream" onClear={onClear} />)
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('does not reload the page when Enter is pressed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn<(value: string) => void>()
    render(<SearchBox {...base} onChange={onChange} />)
    await user.type(screen.getByLabelText('Search products'), '{Enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables the input and hides the clear button when disabled', () => {
    render(<SearchBox id="search" label="Search products" value="lamp" onChange={() => {}} onClear={() => {}} disabled />)
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })
})
