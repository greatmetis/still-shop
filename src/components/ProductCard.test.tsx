import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { ProductCard } from './ProductCard'
import type { ProductCardProps } from './types'

const minimal: ProductCardProps = {
  id: 12,
  href: '/product/12',
  title: 'Red Lipstick',
  categoryName: 'Beauty',
  image: { src: 'https://example.com/a.webp', alt: 'Red Lipstick' },
  price: { price: '$12.99' },
  rating: 4.2,
  stock: { status: 'in-stock', label: 'In stock' },
  index: 0,
}

describe('ProductCard', () => {
  it('is one link with title, category, image, price and rating (minimal props)', () => {
    renderWithRouter(<ProductCard {...minimal} />)
    expect(screen.getByRole('link', { name: /Red Lipstick/ })).toHaveAttribute('href', '/product/12')
    expect(screen.getByRole('heading', { level: 3, name: 'Red Lipstick' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Red Lipstick' })).toHaveAttribute('src', 'https://example.com/a.webp')
    expect(screen.getByText('Beauty')).toBeInTheDocument()
    expect(screen.getByText('$12.99')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rated 4.2 out of 5' })).toBeInTheDocument()
    // Optional pieces are absent
    expect(screen.queryByText('In stock')).not.toBeInTheDocument()
    expect(screen.queryByText(/Was/)).not.toBeInTheDocument()
  })

  it('shows the discount badge and old price (maximal props)', () => {
    renderWithRouter(
      <ProductCard
        {...minimal}
        price={{ price: '$8.99', originalPrice: '$9.99', discountLabel: '−10%' }}
        stock={{ status: 'low-stock', label: 'Low stock: 4 left' }}
        viewTransitionName="product-image"
      />,
    )
    expect(screen.getByText('−10%')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
    expect(screen.getByText('Low stock: 4 left')).toBeInTheDocument()
  })

  it('shows the out-of-stock badge', () => {
    renderWithRouter(<ProductCard {...minimal} stock={{ status: 'out-of-stock', label: 'Out of stock' }} />)
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })

  it('lazy-loads its image at the reserved size', () => {
    renderWithRouter(<ProductCard {...minimal} />)
    const image = screen.getByRole('img', { name: 'Red Lipstick' })
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('width', '300')
    expect(image).toHaveAttribute('height', '375')
  })

  it('marks a broken image so CSS can show the title initial', () => {
    renderWithRouter(<ProductCard {...minimal} />)
    const image = screen.getByRole('img', { name: 'Red Lipstick' })
    expect(image).not.toHaveAttribute('data-failed')
    fireEvent.error(image) // user-event cannot fire an image error; this is the one allowed fireEvent
    expect(image).toHaveAttribute('data-failed', 'true')
  })

  it('caps the reveal stagger at 11', () => {
    renderWithRouter(<ProductCard {...minimal} index={40} />)
    expect(screen.getByRole('link', { name: /Red Lipstick/ }).style.getPropertyValue('--i')).toBe('11')
  })

  it('renders without a link when linked is false', () => {
    renderWithRouter(<ProductCard {...minimal} linked={false} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Red Lipstick' })).toBeInTheDocument()
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
