import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { Header } from './Header'

describe('Header', () => {
  it('has the catalog, home and source links (minimal props)', () => {
    renderWithRouter(<Header homeHref="/" />)
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/')
    const home = screen.getByRole('link', { name: 'Still, home' })
    expect(home).toHaveAttribute('href', '/')
    expect(home).not.toHaveClass('intro-fade')
    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://github.com')
  })

  it('uses a custom source link and fades the wordmark in during the intro (maximal props)', () => {
    renderWithRouter(<Header homeHref="/shop" wordmarkIntro sourceHref="https://github.com/me/still" />)
    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://github.com/me/still')
    const home = screen.getByRole('link', { name: 'Still, home' })
    expect(home).toHaveAttribute('href', '/shop')
    expect(home).toHaveClass('intro-fade')
  })

  it('has a labelled navigation landmark', () => {
    renderWithRouter(<Header homeHref="/" />)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  })
})
