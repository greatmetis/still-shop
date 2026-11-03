import { Link } from 'react-router'
import { buttonClass } from './buttonStyles'
import type { ButtonLinkProps } from './types'

// Looks like a Button but navigates (a real <a>), so it supports open-in-new-tab and so on.
export function ButtonLink({ href, children, variant = 'primary', size = 'md' }: ButtonLinkProps) {
  return (
    <Link to={href} className={buttonClass(variant, size)}>
      {children}
    </Link>
  )
}
