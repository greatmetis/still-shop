import type { Category } from '../api/types'
import type { CategoryOption } from '../components/types'

/**
 * TODO 7 (part 2): map an API Category to what CategoryFilter needs: only `slug` and `name`.
 *
 */
export function toCategoryOption(category:Category):CategoryOption{
  return {
    slug:category.slug,
    name:category.name
  }
}