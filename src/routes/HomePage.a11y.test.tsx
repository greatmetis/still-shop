import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

describe('HomePage accessibility markers', () => {
  it('does not move focus on first load', async () => {
    renderWithRouter(<HomePage />, { route: '/' })
    await screen.findByRole('list', { name: 'Products' })
    expect(document.body).toHaveFocus()
  })

  it('groups the toolbar controls under one named fieldset', async () => {
    renderWithRouter(<HomePage />, { route: '/' })
    const toolbar = await screen.findByRole('group', { name: 'Search and filters' })
    expect(toolbar).toContainElement(screen.getByRole('searchbox', { name: 'Search products' }))
    expect(toolbar).toContainElement(screen.getByRole('combobox', { name: 'Category' }))
    expect(toolbar).toContainElement(screen.getByRole('combobox', { name: 'Sort by' }))
  })

  it('keeps a single live status region in the empty state', async () => {
    renderWithRouter(<HomePage />, { route: '/?q=zzz' })
    await screen.findByRole('heading', { level: 2, name: /no products/i })
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('does not draw a divider between the grid and the pagination', async () => {
    const { container } = renderWithRouter(<HomePage />, { route: '/' })
    await screen.findByRole('navigation', { name: 'Pagination' })
    expect(container.querySelector('span.border')).toBeNull()
  })
})
