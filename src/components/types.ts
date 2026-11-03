// Prop types for every component (design spec section 7).
// Think of these as the ViewModels the components receive.
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// ---- 7.0 Shared types -------------------------------------------------------

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type SortValue =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'rating-asc'
  | 'title-asc'
  | 'title-desc'

export interface ImageData {
  src: string
  alt: string
}

/** A button-or-link action. Exactly one of href / onClick. */
export type Action =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never }

// ---- Layout helper ----------------------------------------------------------

export interface ContainerProps {
  children: ReactNode
  /** Extra classes, e.g. vertical padding. */
  className?: string
}

// ---- 7.1 Button -------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'link'
export type ButtonSize = 'md' | 'sm'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows aria-busy and disables the button. The caller changes the label (e.g. "Trying again…"). */
  loading?: boolean
}

export interface ButtonLinkProps {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
}

// ---- 7.2 Header / Footer ----------------------------------------------------

export interface HeaderProps {
  homeHref: string
  /** Hide the small wordmark while the hero intro plays; it fades in at 2400ms. */
  wordmarkIntro?: boolean
  /** Where the "Source" link points. Defaults to GitHub's home page until the repo URL is known. */
  sourceHref?: string
}

// ---- 7.3 - 7.6 Toolbar ------------------------------------------------------

export interface SearchBoxProps {
  id: string
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onClear: () => void
  /** Greyed out and not usable; the clear button is hidden. */
  disabled?: boolean
}

export interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  /** The <option> elements. */
  children: ReactNode
}

export interface CategoryOption {
  slug: string
  name: string
}

export interface CategoryFilterProps {
  id: string
  label: string
  options: CategoryOption[]
  /** null = All categories */
  value: string | null
  onChange: (slug: string | null) => void
  /** Greyed out and not usable; keeps the normal options. */
  disabled?: boolean
  /** Disabled, and shows only "Loading…" while the categories load. */
  loading?: boolean
}

export interface SortOption {
  value: SortValue
  label: string
}

export interface SortSelectProps {
  id: string
  label: string
  options: SortOption[]
  value: SortValue
  onChange: (value: SortValue) => void
  disabled?: boolean
}

export interface ResultCountProps {
  /** null = still loading (the live region stays mounted and says Loading). */
  count: number | null
  query?: string
  categoryName?: string
  /** Shown only when a query or category is active. */
  onClearFilters?: () => void
}

// ---- 7.7 - 7.9 Small pieces -------------------------------------------------

export interface PriceTagProps {
  price: string
  originalPrice?: string
  discountLabel?: string
  size?: 'sm' | 'lg'
}

export interface RatingStarsProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export interface StockBadgeProps {
  status: StockStatus
  label: string
}

// ---- 7.10 - 7.12 Catalog ----------------------------------------------------

export interface ProductCardProps {
  id: number
  href: string
  title: string
  categoryName: string
  image: ImageData
  price: Omit<PriceTagProps, 'size'>
  rating: number
  stock: StockBadgeProps
  /** Position on the page (0-11). Drives the reveal stagger through the --i CSS variable. */
  index: number
  /** Set only for the card being navigated to (M4 page transition). */
  viewTransitionName?: 'product-image'
  /** false = render the card without a link (no focus stop, no hover effects). Default true. */
  linked?: boolean
}

export interface ProductGridProps {
  products: ProductCardProps[]
  /** Used as the aria-label of the list, e.g. "Products". */
  label: string
  /** false = cards are not links (v0.1, before product pages exist). Default true. */
  linked?: boolean
}

export interface ProductGridSkeletonProps {
  count?: number
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  hrefForPage: (page: number) => string
  label?: string
}

// ---- 7.17 - 7.20 States, Wordmark, Hero ------------------------------------

export interface EmptyStateProps {
  title: string
  message?: string
  action?: Action
  headingLevel?: 1 | 2
}

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry: () => void
  retryLabel?: string
  isRetrying?: boolean
}

export interface WordmarkProps {
  variant: 'hero' | 'header'
  playIntro?: boolean
}

export interface HeroProps {
  tagline: string
  playIntro: boolean
}
