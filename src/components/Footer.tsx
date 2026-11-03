import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-2 py-8 text-small text-text-muted md:flex-row md:justify-between">
        <p>Still. A learning project, not a real shop.</p>
        <p>
          Product data from{' '}
          <a href="https://dummyjson.com" rel="noopener" className="underline underline-offset-4 hover:text-text">
            DummyJSON
          </a>
          .
        </p>
      </Container>
    </footer>
  )
}
