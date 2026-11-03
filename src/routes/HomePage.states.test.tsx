import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { productsEmpty, productsError, productsNetworkError, productsSlow } from '../test/handlers'
import { server } from '../test/server'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

/**
 * The home page shows the right thing for each state of useProducts.
 *   loading → ProductGridSkeleton
 *   error   → ErrorState, with "Try again" wired to retry
 *   success with 0 products → EmptyState (use a title that contains "No products")
 *   success → the grid (first 12, through toCardProps) and the count from the data (pagination is hidden until M3)
 *
 * Heads-up: once the page loads real data, the old tests in HomePage.test.tsx run before the data
 * arrives. Make them wait with `await screen.findBy...` instead of `getBy...` (findBy retries
 * until the element shows up). Updating them is part of this TODO.
 *
 * You'll learn: conditional rendering, discriminated unions, testing UI states with MSW.
 * Resource: https://react.dev/learn/conditional-rendering
 */
describe('HomePage states', () => {
  it('shows the loading skeleton first', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('Loading products…')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Products' })).not.toBeInTheDocument()
  })

  it('shows 12 products from the API once loaded, with the total count', async () => {
    renderWithRouter(<HomePage />)
    const list = await screen.findByRole('list', { name: 'Products' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(12)
    expect(screen.queryByText('Loading products…')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('24 products')
  })

  it('shows the error state, and "Try again" loads the products', async () => {
    server.use(productsError(500, { once: true }))
    const { user } = renderWithRouter(<HomePage />)

    const alert = await screen.findByRole('alert')
    await user.click(within(alert).getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('list', { name: 'Products' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the empty state when there are no products', async () => {
    server.use(productsEmpty())
    renderWithRouter(<HomePage />)

    expect(await screen.findByRole('heading', { name: /no products/i })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Products' })).not.toBeInTheDocument()
  })

  it('shows "Trying again…" while the retry is pending', async () => {
    server.use(productsSlow(200))
    server.use(productsError(500, { once: true }))
    const { user } = renderWithRouter(<HomePage />)

    const alert = await screen.findByRole('alert')
    await user.click(within(alert).getByRole('button', { name: 'Try again' }))

    expect(within(alert).getByRole('button', { name: 'Trying again…' })).toHaveAttribute('aria-disabled', 'true')
    expect(await screen.findByRole('list', { name: 'Products' })).toBeInTheDocument()
  })

  it('lets the user try again a second time when the retry fails too', async () => {
    server.use(productsError(500, { once: true }))
    server.use(productsError(500, { once: true }))
    const { user } = renderWithRouter(<HomePage />)

    await user.click(within(await screen.findByRole('alert')).getByRole('button', { name: 'Try again' }))
    // The retry failed: the button comes back usable, with its normal label.
    const again = await within(await screen.findByRole('alert')).findByRole('button', { name: 'Try again' })
    expect(again).not.toHaveAttribute('aria-disabled')

    await user.click(again)
    expect(await screen.findByRole('list', { name: 'Products' })).toBeInTheDocument()
  })
})

/**
 * Erro State message handling
 *   - users read friendly copy, never the technical error message (design-spec 7.19)
 *   - after a retry works, focus moves to the products heading (design-spec 7.19 and section 8)
 */

describe('HomePage states: review fixes', () => {
  it('shows friendly copy when offline, not the technical message', async () => {
    server.use(productsNetworkError())
    renderWithRouter(<HomePage />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent("We couldn't load the products. Check your connection and try again.")
    expect(alert).not.toHaveTextContent(/failed to fetch/i)
  })

  it('shows the same friendly copy for a server error', async () => {
    server.use(productsError(500))
    renderWithRouter(<HomePage />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent("We couldn't load the products. Check your connection and try again.")
    expect(alert).not.toHaveTextContent(/fetch failed/i)
  })

  it('moves focus to the products heading after a retry works', async () => {
    server.use(productsError(500, { once: true }))
    const { user } = renderWithRouter(<HomePage />)

    await user.click(within(await screen.findByRole('alert')).getByRole('button', { name: 'Try again' }))
    await screen.findByRole('list', { name: 'Products' })

    expect(screen.getByRole('heading', { level: 2, name: 'Products' })).toHaveFocus()
  })

  it('keeps focus on the Try again button when the retry fails', async () => {
    server.use(productsError(500, { once: true }))
    server.use(productsError(500, { once: true }))
    const { user } = renderWithRouter(<HomePage />)

    await user.click(within(await screen.findByRole('alert')).getByRole('button', { name: 'Try again' }))
    // Wait until the retry has finished and failed: the button is back to its normal label.
    const again = await within(await screen.findByRole('alert')).findByRole('button', { name: 'Try again' })

    expect(again).toHaveFocus()
    expect(screen.getByRole('heading', { level: 2, name: 'Products' })).not.toHaveFocus()
  })

  it('does not steal focus on the first load', async () => {
    renderWithRouter(<HomePage />)
    await screen.findByRole('list', { name: 'Products' })

    expect(screen.getByRole('heading', { level: 2, name: 'Products' })).not.toHaveFocus()
  })
})
