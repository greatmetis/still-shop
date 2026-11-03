import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RatingStars } from './RatingStars'

describe('RatingStars', () => {
  it('has one accessible label with the rating (minimal props)', () => {
    render(<RatingStars rating={4.37} />)
    expect(screen.getByRole('img', { name: 'Rated 4.4 out of 5' })).toBeInTheDocument()
  })

  it('includes the review count (maximal props)', () => {
    render(<RatingStars rating={3} reviewCount={3} size="md" />)
    expect(screen.getByRole('img', { name: 'Rated 3.0 out of 5, 3 reviews' })).toBeInTheDocument()
  })

  it('uses the singular for one review', () => {
    render(<RatingStars rating={5} reviewCount={1} />)
    expect(screen.getByRole('img', { name: 'Rated 5.0 out of 5, 1 review' })).toBeInTheDocument()
  })

  it('keeps out-of-range ratings between 0 and 5', () => {
    render(<RatingStars rating={9} />)
    expect(screen.getByRole('img', { name: 'Rated 5.0 out of 5' })).toBeInTheDocument()
  })

  it('handles zero', () => {
    render(<RatingStars rating={0} />)
    expect(screen.getByRole('img', { name: 'Rated 0.0 out of 5' })).toBeInTheDocument()
  })
})
