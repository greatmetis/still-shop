import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockCardProps } from '../mocks/cardProps'
import { renderWithRouter } from '../test/renderWithRouter'
import { ProductGrid } from './ProductGrid'

describe('ProductGrid', () => {
  it('renders an empty labelled list with no products (minimal props)', () => {
    renderWithRouter(<ProductGrid products={[]} label="Products" />)
    const list = screen.getByRole('list', { name: 'Products' })
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('renders one list item and link per product (maximal props)', () => {
    renderWithRouter(<ProductGrid products={mockCardProps} label="Products" />)
    const list = screen.getByRole('list', { name: 'Products' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(12)
    expect(within(list).getAllByRole('link')).toHaveLength(12)
    expect(within(list).getByRole('heading', { name: 'iPhone 5s' })).toBeInTheDocument()
  })

  it('renders cards without links when linked is false', () => {
    renderWithRouter(<ProductGrid products={mockCardProps} label="Products" linked={false} />)
    const list = screen.getByRole('list', { name: 'Products' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(12)
    expect(within(list).queryAllByRole('link')).toHaveLength(0)
  })
})
