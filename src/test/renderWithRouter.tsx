import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

// Renders a component inside a router, starting at `route` (e.g. "/?q=phone&page=2").
export function renderWithRouter(ui: ReactElement, { route = '/' } = {}) {
  return {
    user: userEvent.setup(),
    ...render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>),
  }
}
