import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { Pagination } from './Pagination'

const hrefForPage = (page: number) => `/?page=${page}`

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    renderWithRouter(<Pagination currentPage={1} totalPages={1} hrefForPage={hrefForPage} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('is a labelled navigation with numbered links (minimal props)', () => {
    renderWithRouter(<Pagination currentPage={2} totalPages={3} hrefForPage={hrefForPage} />)
    const nav = screen.getByRole('navigation', { name: 'Pagination' })
    expect(within(nav).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/?page=1')
    expect(within(nav).getByRole('link', { name: 'Page 3' })).toHaveAttribute('href', '/?page=3')
  })

  it('marks the current page', () => {
    renderWithRouter(<Pagination currentPage={2} totalPages={3} hrefForPage={hrefForPage} />)
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Page 1' })).not.toHaveAttribute('aria-current')
  })

  it('links Previous and Next to the neighbouring pages', () => {
    renderWithRouter(<Pagination currentPage={2} totalPages={3} hrefForPage={hrefForPage} />)
    expect(screen.getByRole('link', { name: /Previous/ })).toHaveAttribute('href', '/?page=1')
    expect(screen.getByRole('link', { name: /Next/ })).toHaveAttribute('href', '/?page=3')
  })

  it('disables Previous on the first page', () => {
    renderWithRouter(<Pagination currentPage={1} totalPages={3} hrefForPage={hrefForPage} />)
    expect(screen.queryByRole('link', { name: /Previous/ })).not.toBeInTheDocument()
    expect(screen.getByText(/Previous/).closest('[aria-disabled="true"]')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Next/ })).toBeInTheDocument()
  })

  it('disables Next on the last page', () => {
    renderWithRouter(<Pagination currentPage={3} totalPages={3} hrefForPage={hrefForPage} />)
    expect(screen.queryByRole('link', { name: /Next/ })).not.toBeInTheDocument()
    expect(screen.getByText(/Next/).closest('[aria-disabled="true"]')).toBeInTheDocument()
  })

  it('shows the short "Page x of y" text for phones', () => {
    renderWithRouter(<Pagination currentPage={5} totalPages={17} hrefForPage={hrefForPage} />)
    expect(screen.getByText('Page 5 of 17')).toBeInTheDocument()
  })

  it('collapses long ranges with hidden ellipses (maximal props)', () => {
    renderWithRouter(<Pagination currentPage={5} totalPages={17} hrefForPage={hrefForPage} label="Pages" />)
    const nav = screen.getByRole('navigation', { name: 'Pages' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('aria-label') ?? 'prev/next')
    expect(labels).toEqual(['prev/next', 'Page 1', 'Page 4', 'Page 5', 'Page 6', 'Page 17', 'prev/next'])
    expect(within(nav).getAllByText('…')).toHaveLength(2)
  })
})
