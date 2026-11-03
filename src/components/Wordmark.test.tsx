import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Wordmark } from './Wordmark'

describe('Wordmark', () => {
  it('hero is the h1 named "Still" and still by default', () => {
    render(<Wordmark variant="hero" />)
    const heading = screen.getByRole('heading', { level: 1, name: 'Still' })
    expect(heading).not.toHaveAttribute('data-intro')
  })

  it('hero marks the intro when playIntro is true', () => {
    render(<Wordmark variant="hero" playIntro />)
    expect(screen.getByRole('heading', { level: 1, name: 'Still' })).toHaveAttribute('data-intro', 'true')
  })

  it('header variant is plain text, not a heading', () => {
    render(<Wordmark variant="header" />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Still')).toBeInTheDocument()
  })

  it('header variant never plays the intro', () => {
    const { container } = render(<Wordmark variant="header" playIntro />)
    expect(container.querySelector('[data-intro]')).toBeNull()
  })
})
