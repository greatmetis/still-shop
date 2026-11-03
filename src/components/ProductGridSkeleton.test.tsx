import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductGridSkeleton } from './ProductGridSkeleton'

describe('ProductGridSkeleton', () => {
  it('announces loading to screen readers and is marked busy', () => {
    const { container } = render(<ProductGridSkeleton />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading products…')
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
  })

  it('draws 12 placeholder cards by default', () => {
    const { container } = render(<ProductGridSkeleton />)
    expect(container.querySelectorAll('.skeleton.aspect-4\\/5')).toHaveLength(12)
  })

  it('draws the number of cards asked for', () => {
    const { container } = render(<ProductGridSkeleton count={3} />)
    expect(container.querySelectorAll('.skeleton.aspect-4\\/5')).toHaveLength(3)
  })
})
