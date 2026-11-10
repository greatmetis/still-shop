import { describe, expect, it } from 'vitest'
import type { Product } from '../api/types'
import productsJson from '../mocks/products.json'
import { filterProducts } from './filterProducts'

const products = productsJson.products as Product[]
const titles = (q: string) => filterProducts(products, q).map((product) => product.title)

describe('filterProducts', () => {
  it('returns every product when the search text is empty', () => {
    expect(filterProducts(products, '')).toHaveLength(24)
  })

  it('returns every product when the search text is only spaces', () => {
    expect(filterProducts(products, '   ')).toHaveLength(24)
  })

  it('keeps the products whose title contains the text', () => {
    expect(titles('iphone')).toEqual(['iPhone 5s', 'iPhone 6', 'iPhone 13 Pro', 'iPhone X'])
  })

  it('ignores upper and lower case', () => {
    expect(titles('IPHONE')).toHaveLength(4)
    expect(titles('eau de')).toEqual(['Chanel Coco Noir Eau De', 'Dolce Shine Eau de', 'Gucci Bloom Eau de'])
  })

  it('ignores spaces around the text', () => {
    expect(titles('  oppo  ')).toEqual(['Oppo A57', 'Oppo F19 Pro Plus', 'Oppo K1'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterProducts(products, 'zzz')).toEqual([])
  })

  it.each(['c++', '(', '.*', '[', '\\'])('treats "%s" as plain text, without crashing', (q) => {
    expect(filterProducts(products, q)).toEqual([])
  })

  it('finds titles with an apostrophe', () => {
    expect(titles("j'adore")).toEqual(["Dior J'adore"])
  })
})
