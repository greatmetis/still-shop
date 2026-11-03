import type { ButtonSize, ButtonVariant } from './types'

// Shared by Button and ButtonLink so a button and a link look identical (spec 7.1).
const base =
  'inline-flex items-center justify-center text-small font-medium transition-[background-color,border-color,transform,opacity] duration-(--duration-fast) ease-soft active:scale-98'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary px-5 hover:bg-primary-hover',
  secondary: 'border border-border px-5 text-text hover:border-text hover:bg-surface',
  link: 'min-h-11 py-3 text-text underline underline-offset-4 hover:decoration-2 active:scale-100 active:opacity-70',
}

// The small size is desktop-only; phones always get the 44px tap target.
const sizeClass: Record<ButtonSize, string> = {
  md: 'h-11',
  sm: 'h-11 lg:h-9',
}

export function buttonClass(variant: ButtonVariant, size: ButtonSize) {
  // The link variant sizes itself with padding, so it skips the fixed height.
  const height = variant === 'link' ? '' : sizeClass[size]
  return `${base} ${variantClass[variant]} ${height}`
}
