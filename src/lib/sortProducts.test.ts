import { describe, expect, it } from 'vitest'
import type { Product } from '../api/types'
import { sortProducts } from './sortProducts'

// Only the fields sorting looks at; the rest of a Product doesn't matter here.
function product(title: string, price: number, discountPercentage: number, rating: number): Product {
  return { title, price, discountPercentage, rating } as Product
}

const apple = product('apple', 100, 50, 4.5) // shopper pays 50
const banana = product('Banana', 60, 0, 3.1) // pays 60
const cherry = product('cherry', 40, 0, 4.9) // pays 40
const products = [apple, banana, cherry]

const titles = (list: Product[]) => list.map((p) => p.title)

describe('sortProducts', () => {
  it('keeps the original order for "default"', () => {
    expect(titles(sortProducts(products, 'default'))).toEqual(['apple', 'Banana', 'cherry'])
  })

  it('sorts by the discounted price, low to high', () => {
    // By list price it would be cherry, Banana, apple.
    expect(titles(sortProducts(products, 'price-asc'))).toEqual(['cherry', 'apple', 'Banana'])
  })

  it('sorts by the discounted price, high to low', () => {
    expect(titles(sortProducts(products, 'price-desc'))).toEqual(['Banana', 'apple', 'cherry'])
  })

  it('sorts by rating, high to low and low to high', () => {
    expect(titles(sortProducts(products, 'rating-desc'))).toEqual(['cherry', 'apple', 'Banana'])
    expect(titles(sortProducts(products, 'rating-asc'))).toEqual(['Banana', 'apple', 'cherry'])
  })

  it('sorts titles A–Z and Z–A, ignoring upper and lower case', () => {
    expect(titles(sortProducts(products, 'title-asc'))).toEqual(['apple', 'Banana', 'cherry'])
    expect(titles(sortProducts(products, 'title-desc'))).toEqual(['cherry', 'Banana', 'apple'])
  })

  it('puts accented titles where a person would expect them', () => {
    const sweets = [product('Fudge', 1, 0, 1), product('Éclair', 1, 0, 1), product('Donut', 1, 0, 1)]
    expect(titles(sortProducts(sweets, 'title-asc'))).toEqual(['Donut', 'Éclair', 'Fudge'])
  })

  it('keeps tied products in their original order, in both directions', () => {
    const first = product('first', 10, 0, 4)
    const second = product('second', 10, 0, 4)
    const cheap = product('cheap', 5, 0, 1)
    const list = [first, second, cheap]

    expect(titles(sortProducts(list, 'price-asc'))).toEqual(['cheap', 'first', 'second'])
    expect(titles(sortProducts(list, 'price-desc'))).toEqual(['first', 'second', 'cheap'])
    expect(titles(sortProducts(list, 'rating-desc'))).toEqual(['first', 'second', 'cheap'])
  })

  it('does not change the array it was given', () => {
    const list = [apple, banana, cherry]
    sortProducts(list, 'price-asc')
    sortProducts(list, 'title-desc')
    expect(titles(list)).toEqual(['apple', 'Banana', 'cherry'])
  })
})
