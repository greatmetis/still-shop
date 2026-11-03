import { Button } from './Button'
import { ButtonLink } from './ButtonLink'
import type { EmptyStateProps } from './types'

export function EmptyState({ title, message, action, headingLevel = 2 }: EmptyStateProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'

  return (
    <div className="mx-auto flex max-w-120 flex-col items-center gap-6 px-5 py-16 text-center lg:py-24">
      {/* A small dot echoes the wordmark. */}
      <span aria-hidden="true" className="size-3 rounded-full bg-text" />
      <Heading className="font-serif text-h2 tracking-[-0.01em] lg:text-h2-lg">{title}</Heading>
      {message && <p className="text-body text-text-muted">{message}</p>}
      {action &&
        (action.href !== undefined ? (
          <ButtonLink href={action.href} variant="secondary">
            {action.label}
          </ButtonLink>
        ) : (
          <Button variant="secondary" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </div>
  )
}
