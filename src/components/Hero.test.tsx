import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('shows the wordmark h1 and the tagline, with no animation classes when still', () => {
    render(<Hero tagline="A quiet catalogue." playIntro={false} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Still' })).not.toHaveAttribute('data-intro')
    const tagline = screen.getByText('A quiet catalogue.')
    expect(tagline).not.toHaveClass('intro-fade')
  })

  it('animates the wordmark and the tagline when playIntro is true', () => {
    render(<Hero tagline="A quiet catalogue." playIntro />)
    expect(screen.getByRole('heading', { level: 1, name: 'Still' })).toHaveAttribute('data-intro', 'true')
    const tagline = screen.getByText('A quiet catalogue.')
    expect(tagline).toHaveClass('intro-fade')
    expect(tagline.style.getPropertyValue('--delay')).toBe('2000ms')
  })
})
