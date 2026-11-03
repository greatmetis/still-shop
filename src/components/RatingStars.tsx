import type { CSSProperties } from 'react'
import type { RatingStarsProps } from './types'

export function RatingStars({ rating, reviewCount, size = 'sm' }: RatingStarsProps) {
  const safeRating = Math.min(5, Math.max(0, rating))
  const fill = `${(safeRating / 5) * 100}%`
  const rounded = safeRating.toFixed(1)

  let label = `Rated ${rounded} out of 5`
  if (reviewCount !== undefined) {
    label += `, ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
  }

  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a span with role="img" groups the stars under one label (spec 7.8)
    <span role="img" aria-label={label} className="inline-flex items-center gap-1.5">
      {/* Two copies of the stars: grey ones underneath, dark ones on top, cut off at --fill. */}
      <span aria-hidden="true" className={`relative inline-block leading-none ${size === 'md' ? 'text-body' : 'text-caption'}`}>
        <span className="text-star-empty">★★★★★</span>
        <span
          className="absolute inset-y-0 left-0 w-(--fill) overflow-hidden whitespace-nowrap text-star"
          style={{ '--fill': fill } as CSSProperties}
        >
          ★★★★★
        </span>
      </span>
      <span aria-hidden="true" className="text-small font-medium tabular-nums">
        {rounded}
      </span>
      {reviewCount !== undefined && (
        <span aria-hidden="true" className="text-small text-text-muted tabular-nums">
          ({reviewCount})
        </span>
      )}
    </span>
  )
}
