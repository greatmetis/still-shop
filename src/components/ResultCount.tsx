import { Button } from './Button'
import type { ResultCountProps } from './types'

export function ResultCount({ count, query, categoryName, onClearFilters }: ResultCountProps) {
  const hasFilters = Boolean(query) || Boolean(categoryName)

  return (
    <div className="flex flex-wrap items-center gap-x-3 text-small text-text-muted">
      {/* The live region is always in the page so screen readers announce changes to its text. */}
      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- role="status" is the project convention (react-conventions 5) */}
      <p role="status" aria-live="polite" aria-atomic="true">
        {count === null ? (
          'Loading…'
        ) : (
          <>
            <span className="font-medium text-text tabular-nums">{count}</span> {count === 1 ? 'product' : 'products'}
            {query && <> for “{query}”</>}
            {categoryName && <> in {categoryName}</>}
          </>
        )}
      </p>
      {hasFilters && onClearFilters && (
        <Button variant="link" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
