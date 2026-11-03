import type { PriceTagProps } from './types'

export function PriceTag({ price, originalPrice, discountLabel, size = 'sm' }: PriceTagProps) {
  const isDiscounted = originalPrice !== undefined
  // <s> is not announced by every screen reader, so we add hidden words "Now" and "Was".
  const nowLabel = isDiscounted && <span className="sr-only">Now </span>
  const wasLabel = <span className="sr-only">Was </span>

  if (size === 'lg') {
    return (
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums">
        <span className="text-price font-medium lg:text-[1.75rem]">
          {nowLabel}
          {price}
        </span>
        {isDiscounted && (
          <s className="text-body text-text-muted">
            {wasLabel}
            {originalPrice}
          </s>
        )}
        {discountLabel && (
          <span className="bg-primary px-2 py-1 text-caption font-medium tracking-[0.06em] text-on-primary uppercase">
            {discountLabel}
          </span>
        )}
      </p>
    )
  }

  // size "sm" (cards): the old price sits under the price because cards are narrow.
  // The discount badge is drawn on the card image by ProductCard, not here.
  return (
    <p className="text-right tabular-nums">
      <span className="block text-h3 font-medium lg:text-body">
        {nowLabel}
        {price}
      </span>
      {isDiscounted && (
        <s className="block text-[0.8125rem] text-text-muted">
          {wasLabel}
          {originalPrice}
        </s>
      )}
    </p>
  )
}
