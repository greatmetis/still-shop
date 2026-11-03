import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '../test/renderWithRouter'
import { AppRoutes } from './AppRoutes'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('AppRoutes', () => {
  it('shows the shop wordmark and catalog on the home page', async() => {
    renderWithRouter(<AppRoutes />)
    expect(await screen.findByRole('heading', { level: 1, name: 'Still' })).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Products' })).toBeInTheDocument()
  })

  it('shows the component showcase at /dev/components', () => {
    renderWithRouter(<AppRoutes />, { route: '/dev/components' })
    expect(screen.getByRole('heading', { level: 1, name: 'Components' })).toBeInTheDocument()
  })

  it('hides the component showcase in production builds', () => {
    vi.stubEnv('DEV', false)
    renderWithRouter(<AppRoutes />, { route: '/dev/components' })
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'Components' })).not.toBeInTheDocument()
  })

  it('shows a not-found page for unknown URLs', () => {
    renderWithRouter(<AppRoutes />, { route: '/nope' })
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
