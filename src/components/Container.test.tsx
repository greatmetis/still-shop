import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('renders its children', () => {
    render(<Container>Hello</Container>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('accepts extra classes', () => {
    render(<Container className="py-8">Hi</Container>)
    expect(screen.getByText('Hi')).toHaveClass('py-8')
  })
})
