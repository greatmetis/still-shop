// A page number, or a gap ("…") between page numbers.
export type PageItem = number | 'ellipsis'

/**
 * Which items the pagination bar shows, e.g. 17 pages, current 5 -> 1 … 4 5 6 … 17
 *
 * Rules:
 * - always show the first page, the last page, and the current page with one neighbour each side
 * - near the start or end, show 3 pages so the bar does not jump around: 1 2 3 … 17
 * - a gap that hides only ONE page shows that page instead of "…" (a "…" for one page is silly)
 */
export function getPageItems(current: number, total: number): PageItem[] {
  if (total < 1) return []

  const wanted = new Set<number>([1, total, current - 1, current, current + 1])
  if (current <= 2) wanted.add(3)
  if (current >= total - 1) wanted.add(total - 2)

  const pages = [...wanted].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)

  const items: PageItem[] = []
  pages.forEach((page, i) => {
    const previous = pages[i - 1]
    if (previous !== undefined) {
      const hidden = page - previous - 1
      if (hidden === 1) items.push(previous + 1)
      if (hidden > 1) items.push('ellipsis')
    }
    items.push(page)
  })
  return items
}
