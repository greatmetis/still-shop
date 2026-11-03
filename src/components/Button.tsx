import { buttonClass } from './buttonStyles'
import type { ButtonProps, ButtonVariant } from './types'

// A disabled button must not react to hover, so each variant undoes its own hover style.
const disabledHover: Record<ButtonVariant, string> = {
  primary: 'disabled:hover:bg-primary aria-disabled:hover:bg-primary',
  secondary:
    'disabled:hover:border-border disabled:hover:bg-transparent aria-disabled:hover:border-border aria-disabled:hover:bg-transparent',
  link: '',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      // While loading we use aria-disabled (not `disabled`) so a focused button keeps keyboard focus.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      // preventDefault also stops a type="submit" button from submitting its form again.
      onClick={loading ? (event) => event.preventDefault() : onClick}
      className={`${buttonClass(variant, size)} disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 ${disabledHover[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
