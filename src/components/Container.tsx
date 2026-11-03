import type { ContainerProps } from './types'

// Page margins (20 / 32 / 48px) and the 1440px max width, in one place.
export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto max-w-content px-5 md:px-8 lg:px-12 ${className}`}>{children}</div>
}
