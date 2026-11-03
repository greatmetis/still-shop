import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { DevComponentsPage } from './DevComponentsPage'

describe('DevComponentsPage', () => {
  it('shows every component section', () => {
    renderWithRouter(<DevComponentsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Components' })).toBeInTheDocument()
    for (const name of ['Button', 'ProductGridSkeleton (4 cards)', 'Pagination', 'EmptyState, ErrorState']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    }
  })

  it('shows the stock states and an error alert', () => {
    renderWithRouter(<DevComponentsPage />)
    expect(screen.getAllByText('Low stock: 4 left').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('alert')).toHaveLength(2)
  })

  it('shows the loading category filter with only "Loading…"', () => {
    renderWithRouter(<DevComponentsPage />)
    const select = screen.getByRole('combobox', { name: 'Category (loading)' })
    expect(select).toBeDisabled()
    expect(select).toHaveDisplayValue('Loading…')
  })
})
