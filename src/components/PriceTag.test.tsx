import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PriceTag } from './PriceTag'

describe('PriceTag', () => {
  it('shows only the price when there is no discount (minimal props)', () => {
    render(<PriceTag price="$8.99" />)
    expect(screen.getByText('$8.99')).toBeInTheDocument()
    expect(screen.queryByText(/Was/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Now/)).not.toBeInTheDocument()
  })

  it('shows the old price with hidden "Was" and "Now" words (card size)', () => {
    render(<PriceTag price="$8.99" originalPrice="$9.99" discountLabel="−10%" />)
    expect(screen.getByText('Now')).toBeInTheDocument()
    expect(screen.getByText('Was')).toBeInTheDocument()
    expect(screen.getByText('$9.99').tagName).toBe('S')
    // On cards the badge is drawn on the image, not by PriceTag.
    expect(screen.queryByText('−10%')).not.toBeInTheDocument()
  })

  it('shows everything including the badge at the large size (maximal props)', () => {
    render(<PriceTag price="$8.99" originalPrice="$9.99" discountLabel="−10%" size="lg" />)
    expect(screen.getByText('$8.99')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
    expect(screen.getByText('−10%')).toBeInTheDocument()
  })

  it('shows the large price without discount', () => {
    render(<PriceTag price="$8.99" size="lg" />)
    expect(screen.getByText('$8.99')).toBeInTheDocument()
    expect(screen.queryByText('−10%')).not.toBeInTheDocument()
  })
})
