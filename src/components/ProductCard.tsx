import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { PriceTag } from './PriceTag'
import { RatingStars } from './RatingStars'
import { StockBadge } from './StockBadge'
import type { ProductCardProps } from './types'

export function ProductCard({
  href,
  title,
  categoryName,
  image,
  price,
  rating,
  stock,
  index,
  viewTransitionName,
  linked = true,
}: ProductCardProps) {
  const showStock = stock.status !== 'in-stock'
  const hasBadges = price.discountLabel !== undefined || showStock

  const article = (
    <article>
      <div
        className={`card__media group/media relative aspect-4/5 overflow-hidden bg-surface ${viewTransitionName ? 'is-vt-image' : ''}`}
      >
        {/* Shown only when the image failed to load (see the data-failed handler below). */}
        <span
          aria-hidden="true"
          className="absolute inset-0 hidden items-center justify-center bg-surface-sunken font-serif text-h1 group-has-[img[data-failed=true]]/media:flex"
        >
          {title.charAt(0)}
        </span>
        <img
          src={image.src}
          alt={image.alt}
          width={300}
          height={375}
          loading="lazy"
          decoding="async"
          // No state needed: mark the element and let CSS hide it (decision in react-conventions 5).
          onError={(event) => {
            event.currentTarget.dataset.failed = 'true'
          }}
          className={`size-full object-contain p-[12%] data-[failed=true]:invisible ${stock.status === 'out-of-stock' ? 'opacity-60' : ''}`}
        />
        {hasBadges && (
          <div className="card__badges absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
            {price.discountLabel !== undefined && (
              <span className="bg-primary px-2 py-1 text-caption font-medium tracking-[0.06em] text-on-primary uppercase">
                {price.discountLabel}
              </span>
            )}
            {showStock && (
              <span className="ml-auto bg-bg/90 px-2 py-1">
                <StockBadge status={stock.status} label={stock.label} />
              </span>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="card__title line-clamp-2 min-w-0 text-h3 font-medium lg:text-body">{title}</h3>
        <div className="shrink-0">
          <PriceTag price={price.price} originalPrice={price.originalPrice} size="sm" />
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-caption font-medium tracking-[0.06em] text-text-muted uppercase">
          {categoryName}
        </p>
        <RatingStars rating={rating} size="sm" />
      </div>
    </article>
  )

  // Without a link (v0.1, before the product page exists): same content, but no link, no focus stop
  // and no hover effects, because those would suggest the card can be clicked.
  if (!linked) {
    return <div style={{ '--i': Math.min(index, 11) } as CSSProperties}>{article}</div>
  }

  return (
    // M4: add the `viewTransition` prop to this Link (page transition, spec 5.3).
    <Link
      to={href}
      className="card block focus-visible:outline-offset-4"
      style={{ '--i': Math.min(index, 11) } as CSSProperties}
    >
      {article}
    </Link>
  )
}
