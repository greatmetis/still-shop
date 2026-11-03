import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders a button with its label (minimal props)', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).not.toHaveAttribute('aria-busy')
  })

  it.each(['primary', 'secondary', 'link'] as const)('renders the %s variant', (variant) => {
    render(<Button variant={variant}>Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
  })

  it('passes native attributes through (maximal props)', () => {
    render(
      <Button variant="secondary" size="sm" type="submit" aria-label="Send form">
        Send
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Send form' })
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('calls onClick once per click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn<() => void>()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button', { name: 'Click' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn<() => void>()
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Click' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Click' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is disabled and busy while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn<() => void>()
    render(
      <Button loading onClick={onClick}>
        Trying again…
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Trying again…' })
    // aria-disabled (not disabled) so keyboard focus is not lost when the button starts loading
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('aria-busy', 'true')
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not submit its form while loading', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(event: { preventDefault: () => void }) => void>((event) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Saving…
        </Button>
      </form>,
    )
    await user.click(screen.getByRole('button', { name: 'Saving…' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
