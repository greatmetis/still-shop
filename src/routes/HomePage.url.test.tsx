import { screen, waitFor, within } from '@testing-library/react'
import { useLocation, useNavigate } from 'react-router'
import { describe, expect, it } from 'vitest'
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
const status = () => screen.getByRole('status')
const cardTitles = () =>
  within(screen.getByRole('list', { name: 'Products' }))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)

const LAPTOPS = [
  'Apple MacBook Pro 14 Inch Space Grey',
  'Asus Zenbook Pro Dual Screen Laptop',
  'Huawei Matebook X Pro',
  'Lenovo Yoga 920',
  'New DELL XPS 13 9300 Laptop',
]
const IPHONES = ['iPhone 5s', 'iPhone 6', 'iPhone 13 Pro', 'iPhone X']

describe('TODO 13a: the page reads the URL', () => {
  it('shows only the category in ?category=', async () => {
    renderAt('/?category=laptops')
    await waitFor(() => expect(cardTitles()).toEqual(LAPTOPS))
    expect(status()).toHaveTextContent(/^5 products/)
  })

  it('shows only the products matching ?q=', async () => {
    renderAt('/?q=iphone')
    await waitFor(() => expect(cardTitles()).toEqual(IPHONES))
    expect(status()).toHaveTextContent(/^4 products/)
  })

  it('combines the search text and the category', async () => {
    renderAt('/?q=pro&category=smartphones')
    await waitFor(() => expect(cardTitles()).toEqual(['iPhone 13 Pro', 'Oppo F19 Pro Plus']))
  })

  it('sorts by ?sort=', async () => {
    renderAt('/?sort=price-asc')
    await waitFor(() => expect(cardTitles().slice(0, 3)).toEqual(['Apple', 'Cooking Oil', 'Cat Food']))
  })

  it('shows the page in ?page=, and counts every result, not just the page', async () => {
    renderAt('/?page=2')
    await waitFor(() => expect(cardTitles()).toHaveLength(12))
    expect(cardTitles()[0]).toBe('New DELL XPS 13 9300 Laptop')
    expect(cardTitles()[11]).toBe('Cooking Oil')
    expect(status()).toHaveTextContent(/^24 products/)
  })

  it('shows the last page when ?page= is too high', async () => {
    renderAt('/?page=999')
    await waitFor(() => expect(cardTitles()[0]).toBe('New DELL XPS 13 9300 Laptop'))
  })

  it('falls back to the defaults for bad values', async () => {
    renderAt('/?page=abc&sort=zzz')
    await waitFor(() => expect(cardTitles()).toHaveLength(12))
    expect(cardTitles()[0]).toBe('iPhone 5s')
  })

  it('shows the empty state when nothing matches', async () => {
    renderAt('/?q=zzz')
    expect(await screen.findByRole('heading', { level: 2, name: /no products/i })).toBeInTheDocument()
    expect(status()).toHaveTextContent(/^0 products/)
  })

  it('does not crash on an unknown category or HTML in the search text', async () => {
    renderAt('/?category=unknown&q=%3Cscript%3Ealert(1)%3C%2Fscript%3E')
    expect(await screen.findByRole('heading', { level: 2, name: /no products/i })).toBeInTheDocument()
    expect(document.querySelector('main script')).toBeNull()
  })

  it('shows the URL values in the sort and category controls', async () => {
    renderAt('/?sort=price-asc&category=laptops')
    await screen.findByRole('option', { name: 'Laptops' })
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveValue('price-asc')
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue('laptops')
  })
})

describe('TODO 13b: the category and sort controls write to the URL', () => {
  it('writes the chosen sort to the URL and re-sorts', async () => {
    const { user } = renderAt('/')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'price-asc')
    expect(url()).toBe('?sort=price-asc')
    await waitFor(() => expect(cardTitles()[0]).toBe('Apple'))
  })

  it('writes the chosen category to the URL and loads it', async () => {
    const { user } = renderAt('/')
    await screen.findByRole('option', { name: 'Laptops' })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'laptops')
    expect(url()).toBe('?category=laptops')
    await waitFor(() => expect(cardTitles()).toEqual(LAPTOPS))
  })

  it('removes the category from the URL for "All categories"', async () => {
    const { user } = renderAt('/?category=laptops')
    await screen.findByRole('option', { name: 'Laptops' })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'All categories')
    expect(url()).toBe('')
  })

  it('goes back to page 1 when a filter changes', async () => {
    const { user } = renderAt('/?page=2')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'title-asc')
    expect(url()).toBe('?sort=title-asc')
  })

  it('keeps the other filters', async () => {
    const { user } = renderAt('/?q=iphone')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'price-desc')
    expect(url()).toBe('?q=iphone&sort=price-desc')
  })

  it('lets the Back button undo a change', async () => {
    const { user } = renderAt('/')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'price-asc')
    await user.click(screen.getByRole('button', { name: 'Test: back' }))
    expect(url()).toBe('')
    await waitFor(() => expect(cardTitles()[0]).toBe('iPhone 5s'))
  })
})

describe('TODO 13c: search, pages and clearing filters', () => {
  it('turns the search box on and shows ?q= in it', async () => {
    renderAt('/?q=oppo')
    const search = screen.getByRole('searchbox', { name: 'Search products' })
    expect(search).toBeEnabled()
    expect(search).toHaveValue('oppo')
    expect(screen.queryByText('Search and filters function coming soon')).not.toBeInTheDocument()
  })

  it('writes the search text to the URL only after typing stops', async () => {
    const { user } = renderAt('/')
    await user.type(screen.getByRole('searchbox', { name: 'Search products' }), 'iphone')
    expect(url()).toBe('') // not yet: the debounce is still waiting
    await waitFor(() => expect(url()).toBe('?q=iphone'))
    await waitFor(() => expect(cardTitles()).toEqual(IPHONES))
  })

  it('does not add a Back step for every search', async () => {
    const { user } = renderAt('/')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'price-asc')
    await user.type(screen.getByRole('searchbox', { name: 'Search products' }), 'apple')
    await waitFor(() => expect(url()).toBe('?q=apple&sort=price-asc'))

    // Typing replaced the current entry, so Back skips straight past the sort change.
    await user.click(screen.getByRole('button', { name: 'Test: back' }))
    expect(url()).toBe('')
  })

  it('goes back to page 1 when the search changes', async () => {
    const { user } = renderAt('/?page=2')
    await waitFor(() => expect(cardTitles()).toHaveLength(12)) // page 2 has loaded
    await user.type(screen.getByRole('searchbox', { name: 'Search products' }), 'a')
    await waitFor(() => expect(url()).toBe('?q=a'))
  })

  it('clears the search with the clear button', async () => {
    const { user } = renderAt('/?q=oppo')
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toHaveValue('')
    await waitFor(() => expect(url()).toBe(''))
  })

  it('shows page links that change the page and move focus to the products', async () => {
    const { user } = renderAt('/')
    const pagination = await screen.findByRole('navigation', { name: 'Pagination' })
    await user.click(within(pagination).getByRole('link', { name: 'Page 2' }))
    expect(url()).toBe('?page=2')
    await waitFor(() => expect(cardTitles()[0]).toBe('New DELL XPS 13 9300 Laptop'))
    expect(screen.getByRole('heading', { level: 2, name: 'Products' })).toHaveFocus()
  })

  it('hides the page links when everything fits on one page', async () => {
    renderAt('/?category=laptops')
    await waitFor(() => expect(cardTitles()).toEqual(LAPTOPS))
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('names the filters in the result count, and "Clear filters" resets everything', async () => {
    const { user } = renderAt('/?q=iphone&category=smartphones&sort=price-asc')
    await waitFor(() => expect(status()).toHaveTextContent('4 products for “iphone” in Smartphones'))

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(url()).toBe('')
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toHaveValue('')
    await waitFor(() => expect(status()).toHaveTextContent(/^24 products/))
  })

  it('offers "Clear filters" in the empty state', async () => {
    const { user } = renderAt('/?q=zzz')
    await screen.findByRole('heading', { level: 2, name: /no products/i })
    const buttons = screen.getAllByRole('button', { name: 'Clear filters' })
    await user.click(buttons[buttons.length - 1])
    expect(url()).toBe('')
  })
})
