import { screen, waitFor, within } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import productsJson from '../mocks/products.json'
import { API } from '../test/handlers'
import { server } from '../test/server'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

// Task 3.10: a slow old answer must never replace a newer one.
// The search box filters on the page, so typing never sends a request; the only request that can race is the
// category fetch. Each category answers after its own delay, and every request is counted.
function categoriesWithDelays(delays: Record<string, number>) {
  const requests: string[] = []
  server.use(
    http.get(`${API}/products/category/:slug`, async ({ params }) => {
      const slug = String(params.slug)
      requests.push(slug)
      await delay(delays[slug] ?? 0)
      const products = productsJson.products.filter((product) => product.category === slug)
      return HttpResponse.json({ products, total: products.length, skip: 0, limit: products.length })
    }),
  )
  return requests
}

function countProductRequests() {
  let count = 0
  server.events.on('request:start', ({ request }) => {
    if (new URL(request.url).pathname.includes('/products')) count += 1
  })
  return () => count
}

afterEach(() => server.events.removeAllListeners())

const cardTitles = () =>
  within(screen.getByRole('list', { name: 'Products' }))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)

const SMARTPHONES = [
  'iPhone 5s',
  'iPhone 6',
  'iPhone 13 Pro',
  'iPhone X',
  'Oppo A57',
  'Oppo F19 Pro Plus',
  'Oppo K1',
  'Realme C35',
]

describe('Task 3.10: no stale results', () => {
  it('keeps the newest category when an older, slower answer arrives last', async () => {
    const requests = categoriesWithDelays({ laptops: 300, smartphones: 0 })
    const { user } = renderWithRouter(<HomePage />)
    await screen.findByRole('option', { name: 'Laptops' })
    const category = screen.getByRole('combobox', { name: 'Category' })

    await user.selectOptions(category, 'laptops') // slow: answers after 300 ms
    await user.selectOptions(category, 'smartphones') // fast: answers straight away
    expect(requests).toEqual(['laptops', 'smartphones'])

    await waitFor(() => expect(cardTitles()).toEqual(SMARTPHONES))

    // Wait until the laptops answer would have arrived, then check it didn't replace the smartphones.
    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(cardTitles()).toEqual(SMARTPHONES)
    expect(category).toHaveValue('smartphones')
  })

  it('does not send a request while typing "ph" then "phone"', async () => {
    const productRequests = countProductRequests()
    const { user } = renderWithRouter(<HomePage />)
    await waitFor(() => expect(cardTitles()).toHaveLength(12))
    const before = productRequests()

    const search = screen.getByRole('searchbox', { name: 'Search products' })
    await user.type(search, 'ph')
    await user.type(search, 'one')

    await waitFor(() => expect(cardTitles()).toEqual(['iPhone 5s', 'iPhone 6', 'iPhone 13 Pro', 'iPhone X']))
    expect(productRequests()).toBe(before)
  })
})
