import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Container } from './Container'
import { Wordmark } from './Wordmark'
import type { HeaderProps } from './types'

const linkClass =
  'inline-flex min-h-11 items-center text-small font-medium underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-(--duration-fast) ease-soft hover:decoration-current'

export function Header({ homeHref, wordmarkIntro = false, sourceHref = 'https://github.com' }: HeaderProps) {
  return (
    <header className="site-header border-b border-line bg-bg">
      <Container className="grid h-14 grid-cols-3 items-center md:h-16">
        <nav aria-label="Main" className="justify-self-start">
          <Link to={homeHref} className={linkClass}>
            Catalog
          </Link>
        </nav>
        <Link
          to={homeHref}
          aria-label="Still, home"
          className={`inline-flex min-h-11 items-center justify-self-center ${wordmarkIntro ? 'intro-fade' : ''}`}
          style={wordmarkIntro ? ({ '--delay': '2400ms' } as CSSProperties) : undefined}
        >
          <Wordmark variant="header" />
        </Link>
        <a href={sourceHref} rel="noopener" className={`${linkClass} justify-self-end`}>
          Source
        </a>
      </Container>
    </header>
  )
}
