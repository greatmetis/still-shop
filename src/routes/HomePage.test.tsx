import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'
import { categoriesSlow } from '../test/handlers'
import { server } from '../test/server'

describe('HomePage', () => {
  it('shows the hero, toolbar, 12 cards, a 24-product count, and no pagination yet (M3)', async () => {
    renderWithRouter(<HomePage />)
    expect(await screen.findByRole('heading', { level: 1, name: 'Still' })).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('24 products')
    expect(within(screen.getByRole('list', { name: 'Products' })).getAllByRole('listitem')).toHaveLength(12)
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('has one h1 and a hidden h2 for the catalog (no skipped headings)', async() => {
    renderWithRouter(<HomePage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(await screen.findByRole('heading', { level: 2, name: 'Products' })).toBeInTheDocument()
  })

  it('shows cards that are not links yet (product pages come in M4)', async () => {
    renderWithRouter(<HomePage />)
    expect(await screen.findByRole('heading', { level: 3, name: /iPhone 5s/ })).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Products' })).queryAllByRole('link')).toHaveLength(0)
  })

  it('disables the toolbar and says search and filters are coming soon', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Category' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeDisabled()
    expect(screen.getByText('Search and filters function coming soon')).toBeVisible()
    expect(screen.getByRole('group', { name: 'Search and filters' })).toHaveAccessibleDescription(
      'Search and filters function coming soon',
    )
  })

  it('plays the intro', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Still' })).toHaveAttribute('data-intro', 'true')
  })

  it('lists the mock categories in the filter', async() => {
    renderWithRouter(<HomePage />)
    expect(await screen.findByRole('option', { name: 'All categories' })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: 'Beauty' })).toBeInTheDocument()
  })

  it('keeps the category filter disabled after products and categories load', async () => {
  renderWithRouter(<HomePage />)

    // 1. Wait for the categories: find the 'Beauty' option
    expect(await screen.findByRole('option',{name:'Beauty'})).toBeInTheDocument();
    // 2. Wait for the products: find the cards (role 'article', more than one, so findAllByRole)
    const cards = await screen.findAllByRole('article')
    expect(cards).toHaveLength(12)

    // 3. Check the 'Category' combobox is disabled
    expect(screen.getByRole('combobox',{name:'Category'})).toBeDisabled();
  });

  it('shows Loading… in the category filter while categories load', async () => {
  server.use(categoriesSlow(300))
  renderWithRouter(<HomePage />)

  // Products have arrived, but categories are still waiting on the 300 ms delay
  await screen.findAllByRole('article')
  expect(screen.getByRole('option', { name: 'Loading…' })).toBeInTheDocument()

  // The real list replaces the placeholder
  expect(await screen.findByRole('option', { name: 'Beauty' })).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: 'Loading…' })).not.toBeInTheDocument()
  })
})
