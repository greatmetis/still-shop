import { Button } from './Button'
import type { ErrorStateProps } from './types'

export function ErrorState({
  title = 'Something went wrong.',
  message,
  onRetry,
  retryLabel = 'Try again',
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div role="alert" className="mx-auto flex max-w-120 flex-col items-center gap-6 px-5 py-16 text-center lg:py-24">
      <span aria-hidden="true" className="size-3 rounded-full bg-danger" />
      <h2 className="font-serif text-h2 tracking-[-0.01em] lg:text-h2-lg">{title}</h2>
      <p className="text-body text-text-muted">{message}</p>
      <Button loading={isRetrying} onClick={onRetry}>
        {isRetrying ? 'Trying again…' : retryLabel}
      </Button>
    </div>
  )
}
