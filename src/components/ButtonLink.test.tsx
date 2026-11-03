import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { ButtonLink } from './ButtonLink'

describe('ButtonLink', () => {
  it('renders a link to href (minimal props)', () => {
    renderWithRouter(<ButtonLink href="/dev/components">Components</ButtonLink>)
    expect(screen.getByRole('link', { name: 'Components' })).toHaveAttribute('href', '/dev/components')
  })

  it.each(['primary', 'secondary', 'link'] as const)('renders the %s variant', (variant) => {
    renderWithRouter(
      <ButtonLink href="/" variant={variant} size="sm">
        Home
      </ButtonLink>,
    )
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })
})
