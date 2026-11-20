import { screen, waitFor, within } from '@testing-library/react'
import { useLocation, useNavigate } from 'react-router'
import { describe, expect, it } from 'vitest'
import { productsSlow } from '../test/handlers'
import { server } from '../test/server'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

// Test-only helpers: show the current query string, and a Back button like the browser's.
function TestTools() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <span data-testid="url">{location.search}</span>
      <button type="button" onClick={() => navigate(-1)}>
        Test: back
      </button>
    </>
  )
}

function renderAt(route = '/') {
  return renderWithRouter(
    <>
      <HomePage />
      <TestTools />
    </>,
    { route },
  )
}

const url = () => screen.getByTestId('url').textContent
const searchBox = () => screen.getByRole('searchbox', { name: 'Search products' })
const heading = () => screen.getByRole('heading', { level: 2, name: 'Products' })
const cardTitles = () =>
  within(screen.getByRole('list', { name: 'Products' }))
    .getAllByRole('heading', { level: 3 })
    .map((card) => card.textContent)

// Page 2 of the 24 mock products has loaded.
const page2Loaded = () => waitFor(() => expect(cardTitles()[0]).toBe('New DELL XPS 13 9300 Laptop'))

describe('M3 fix 1: focus moves only after a page link is clicked', () => {
  it('does not move focus when a link with ?page= opens', async () => {
    renderAt('/?page=2')
    await page2Loaded()
    expect(heading()).not.toHaveFocus()
  })

  it('keeps focus in the search box when typing resets the page', async () => {
    const { user } = renderAt('/?page=2')
    await page2Loaded()
    await user.type(searchBox(), 'a')
    await waitFor(() => expect(url()).toBe('?q=a'))
    expect(searchBox()).toHaveFocus()
  })

  it('keeps focus on the sort control when sorting resets the page', async () => {
    const { user } = renderAt('/?page=2')
    await page2Loaded()
    const sort = screen.getByRole('combobox', { name: 'Sort by' })
    await user.selectOptions(sort, 'title-asc')
    expect(url()).toBe('?sort=title-asc')
    expect(sort).toHaveFocus()
  })

  it('still moves focus to the products after clicking a page link', async () => {
    const { user } = renderAt('/')
    const pagination = await screen.findByRole('navigation', { name: 'Pagination' })
    await user.click(within(pagination).getByRole('link', { name: 'Page 2' }))
    await page2Loaded()
    expect(heading()).toHaveFocus()
  })
})

describe('M3 fix 2: the search box follows the URL', () => {
  it('shows the URL search again after Back', async () => {
    const { user } = renderAt('/')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'price-asc')
    await user.type(searchBox(), 'apple')
    await waitFor(() => expect(url()).toBe('?q=apple&sort=price-asc'))

    await user.click(screen.getByRole('button', { name: 'Test: back' }))
    expect(url()).toBe('')
    await waitFor(() => expect(searchBox()).toHaveValue(''))
  })

  it('writes the same search again after Back', async () => {
    const { user } = renderAt('/')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'price-asc')
    await user.type(searchBox(), 'apple')
    await waitFor(() => expect(url()).toBe('?q=apple&sort=price-asc'))

    await user.click(screen.getByRole('button', { name: 'Test: back' }))
    await user.clear(searchBox())
    await user.type(searchBox(), 'apple')
    await waitFor(() => expect(url()).toBe('?q=apple'))
  })
})

describe('M3 fix 3: the result count while loading', () => {
  it('says Loading… instead of 0 products', async () => {
    server.use(productsSlow(200))
    renderAt('/')
    // While loading, the skeleton is a status region too, so check the texts of all of them.
    const statusTexts = () => screen.getAllByRole('status').map((region) => region.textContent)
    expect(statusTexts()).toContain('Loading…')
    expect(statusTexts().some((text) => /0 products/.test(text ?? ''))).toBe(false)
    await waitFor(() => expect(statusTexts()).toContainEqual(expect.stringMatching(/^24 products/)))
  })
})
