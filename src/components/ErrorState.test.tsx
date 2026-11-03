import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('is an alert with default title and retry label (minimal props)', () => {
    render(<ErrorState message="We could not load the products." onRetry={() => {}} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeInTheDocument()
    expect(screen.getByText('We could not load the products.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled()
  })

  it('uses a custom title and retry label (maximal props)', () => {
    render(<ErrorState title="Offline." message="No network." retryLabel="Reload" onRetry={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Offline.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('calls onRetry once when the button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn<() => void>()
    render(<ErrorState message="Oops." onRetry={onRetry} />)
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('disables the button and says so while retrying', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn<() => void>()
    render(<ErrorState message="Oops." onRetry={onRetry} isRetrying />)
    const button = screen.getByRole('button', { name: 'Trying again…' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    await user.click(button)
    expect(onRetry).not.toHaveBeenCalled()
  })
})
