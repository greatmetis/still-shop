import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// MSW fakes the DummyJSON API in tests. Override per test with server.use(...).
export const server = setupServer(...handlers)
