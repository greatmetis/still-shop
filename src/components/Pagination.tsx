import { Link } from 'react-router'
import { getPageItems } from '../lib/getPageItems'
import type { PaginationProps } from './types'

// No display utility in the shared string: two display utilities on one element (e.g. `hidden` and
// `inline-flex`) are won by whichever comes LATER in the generated CSS, not by class order.
const itemBase =
  'min-h-11 min-w-11 items-center justify-center px-3 text-small font-medium tabular-nums transition-colors duration-(--duration-fast) ease-soft'
const itemClass = `inline-flex ${itemBase}`

export function Pagination({ currentPage, totalPages, hrefForPage, label = 'Pagination' }: PaginationProps) {
  if (totalPages <= 1) return null

  const items = getPageItems(currentPage, totalPages)
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav aria-label={label}>
      <ol className="flex items-center justify-between gap-1 md:justify-center">
        <li>
          {hasPrevious ? (
            <Link to={hrefForPage(currentPage - 1)} rel="prev" className={`${itemClass} hover:bg-surface`}>
              <span aria-hidden="true">←&nbsp;</span>Previous
            </Link>
          ) : (
            <span aria-disabled="true" className={`${itemClass} cursor-not-allowed opacity-40`}>
              <span aria-hidden="true">←&nbsp;</span>Previous
            </span>
          )}
        </li>

        {/* Phones: a short "Page 5 of 17" instead of the number list, to keep 44px targets. */}
        <li className="text-small tabular-nums md:hidden">
          Page {currentPage} of {totalPages}
        </li>

        {items.map((item, i) =>
          item === 'ellipsis' ? (
            // The list never reorders, so the position is a safe key.
            <li key={`gap-${i}`} aria-hidden="true" className={`${itemBase} hidden md:inline-flex`}>
              …
            </li>
          ) : (
            <li key={item} className="hidden md:block">
              <Link
                to={hrefForPage(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`Page ${item}`}
                className={`${itemClass} ${item === currentPage ? 'bg-primary text-on-primary' : 'hover:bg-surface'}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {hasNext ? (
            <Link to={hrefForPage(currentPage + 1)} rel="next" className={`${itemClass} hover:bg-surface`}>
              Next<span aria-hidden="true">&nbsp;→</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={`${itemClass} cursor-not-allowed opacity-40`}>
              Next<span aria-hidden="true">&nbsp;→</span>
            </span>
          )}
        </li>
      </ol>
    </nav>
  )
}
