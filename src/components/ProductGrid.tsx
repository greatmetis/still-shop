import { gridLayoutClass } from './gridLayout'
import { ProductCard } from './ProductCard'
import type { ProductGridProps } from './types'

export function ProductGrid({ products, label, linked = true }: ProductGridProps) {
  return (
    // oxlint-disable-next-line jsx-a11y/no-redundant-roles -- Safari drops list semantics when list-style is none
    <ul role="list" aria-label={label} className={gridLayoutClass}>
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard {...product} linked={linked} />
        </li>
      ))}
    </ul>
  )
}
