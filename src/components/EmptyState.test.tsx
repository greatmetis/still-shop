import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('shows just a heading (minimal props)', () => {
    renderWithRouter(<EmptyState title="Nothing here." />)
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here.' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('can be the page heading', () => {
    renderWithRouter(<EmptyState title="Not found" headingLevel={1} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Not found' })).toBeInTheDocument()
  })

  it('shows the message and a button action (maximal props)', () => {
    renderWithRouter(
      <EmptyState title="Nothing matches." message="Try a different word." action={{ label: 'Clear filters', onClick: () => {} }} />,
    )
    expect(screen.getByText('Try a different word.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('calls onClick once for a button action', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn<() => void>()
    renderWithRouter(<EmptyState title="Nothing." action={{ label: 'Clear filters', onClick }} />)
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a link action when it has an href', () => {
    renderWithRouter(<EmptyState title="Gone." action={{ label: 'Back to catalog', href: '/' }} />)
    expect(screen.getByRole('link', { name: 'Back to catalog' })).toHaveAttribute('href', '/')
  })
})
