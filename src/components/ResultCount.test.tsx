import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ResultCount } from './ResultCount'

describe('ResultCount', () => {
  it('shows the count in a polite live region (minimal props)', () => {
    render(<ResultCount count={24} />)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('24 products')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('uses the singular for one product', () => {
    render(<ResultCount count={1} />)
    expect(screen.getByRole('status')).toHaveTextContent('1 product')
    expect(screen.getByRole('status')).not.toHaveTextContent('1 products')
  })

  it('keeps the live region even when the count is zero', () => {
    render(<ResultCount count={0} />)
    expect(screen.getByRole('status')).toHaveTextContent('0 products')
  })

  it('mentions the query and category and offers to clear them (maximal props)', () => {
    render(<ResultCount count={3} query="cream" categoryName="Beauty" onClearFilters={() => {}} />)
    expect(screen.getByRole('status')).toHaveTextContent('3 products for “cream” in Beauty')
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('calls onClearFilters once when clicked', async () => {
    const user = userEvent.setup()
    const onClearFilters = vi.fn<() => void>()
    render(<ResultCount count={3} query="cream" onClearFilters={onClearFilters} />)
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onClearFilters).toHaveBeenCalledTimes(1)
  })

  it('says "Loading…" in the live region while the count is null', () => {
    render(<ResultCount count={null} />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading…')
  })

  it('hides the clear button when no filter is active', () => {
    render(<ResultCount count={3} onClearFilters={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })
})
