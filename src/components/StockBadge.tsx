import type { StockBadgeProps, StockStatus } from './types'

const colorClass: Record<StockStatus, string> = {
  'in-stock': 'text-success',
  'low-stock': 'text-warning',
  'out-of-stock': 'text-danger',
}

// The label is always text, so colour is never the only cue.
export function StockBadge({ status, label }: StockBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 text-caption font-medium tracking-[0.06em] uppercase ${colorClass[status]}`}>
      <span aria-hidden="true" className="size-2 rounded-full bg-current" />
      {label}
    </span>
  )
}
