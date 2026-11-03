import type { CSSProperties } from 'react'
import { Wordmark } from './Wordmark'
import type { HeroProps } from './types'

export function Hero({ tagline, playIntro }: HeroProps) {
  return (
    <section className="flex min-h-90 flex-col items-center justify-center px-5 py-16 text-center md:min-h-130 md:px-8">
      <Wordmark variant="hero" playIntro={playIntro} />
      <p
        className={`mt-6 text-body text-text-muted ${playIntro ? 'intro-fade' : ''}`}
        style={playIntro ? ({ '--delay': '2000ms' } as CSSProperties) : undefined}
      >
        {tagline}
      </p>
    </section>
  )
}
