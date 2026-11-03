import { gridLayoutClass } from './gridLayout'
import type { ProductGridSkeletonProps } from './types'

// Grey boxes in the same places as a real card, so nothing jumps when data arrives.
export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div aria-busy="true">
      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- role="status" is the project convention (react-conventions 5) */}
      <p role="status" className="sr-only">
        Loading products…
      </p>
      <div aria-hidden="true" className={gridLayoutClass}>
        {/* Static placeholders that never reorder, so the index is a fine key here. */}
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>
            <div className="skeleton aspect-4/5" />
            <div className="skeleton mt-3 h-4 w-[70%]" />
            <div className="skeleton mt-1 h-3 w-[40%]" />
          </div>
        ))}
      </div>
    </div>
  )
}
