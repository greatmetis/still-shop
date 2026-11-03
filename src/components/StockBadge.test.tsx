import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StockBadge } from './StockBadge'

describe('StockBadge', () => {
  it.each([
    ['in-stock', 'In stock'],
    ['low-stock', 'Low stock: 4 left'],
    ['out-of-stock', 'Out of stock'],
  ] as const)('shows the %s label as text', (status, label) => {
    render(<StockBadge status={status} label={label} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
