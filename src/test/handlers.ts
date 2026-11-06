import { delay, http, HttpResponse } from 'msw'
import { API_BASE } from '../api/baseUrl'
import categoriesJson from '../mocks/categories.json'
import productsJson from '../mocks/products.json'

export const API = API_BASE
const productsUrl = `${API_BASE}/products`
const categoriesUrl = `${API_BASE}/products/categories`

// Default handlers shared by all tests: 24 mock products and 24 mock categories.
export const handlers = [
  http.get(productsUrl, () => HttpResponse.json(productsJson)),
  http.get(categoriesUrl, () => HttpResponse.json(categoriesJson)),
]

// Ready-made overrides for one test. Use them with `server.use(...)`, e.g.
//   server.use(productsError(500))
// `once: true` means only the next request gets this answer; later ones fall back to the default.
export const productsError = (status: number, { once = false } = {}) =>
  http.get(productsUrl, () => new HttpResponse(null, { status }), { once })

// A network failure (offline, DNS, CORS): fetch itself rejects with a TypeError, so there is no status code.
export const productsNetworkError = ({ once = false } = {}) =>
  http.get(productsUrl, () => HttpResponse.error(), { once })

export const productsEmpty = () =>
  http.get(productsUrl, () => HttpResponse.json({ products: [], total: 0, skip: 0, limit: 0 }))

export const productsSlow = (ms: number) =>
  http.get(productsUrl, async () => {
    await delay(ms)
    return HttpResponse.json(productsJson)
  })

export const categoriesError = (status: number, { once = false } = {}) =>
  http.get(categoriesUrl, () => new HttpResponse(null, { status }), { once })

export const categoriesNetworkError = ({ once = false } = {}) =>
  http.get(categoriesUrl, () => HttpResponse.error(), { once })

export const categoriesSlow = (ms: number) =>
  http.get(categoriesUrl, async () => {
    await delay(ms)
    return HttpResponse.json(categoriesJson)
  })
