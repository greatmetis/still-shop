import type { WordmarkProps } from './types'

// "Still" + a real CSS circle for the full stop. The circle is what the intro grows from.
// The class names (wordmark__track, ...) are animated in src/styles/motion.css.
function WordmarkBody() {
  return (
    <span className="wordmark__track inline-flex items-baseline">
      <span className="wordmark__letters">Still</span>
      <span className="wordmark__dot ml-[0.03em] inline-block size-[0.16em] rounded-full bg-current" />
    </span>
  )
}

export function Wordmark({ variant, playIntro = false }: WordmarkProps) {
  if (variant === 'header') {
    // Small version inside the header link, which has its own aria-label.
    return (
      <span className="wordmark font-serif text-[1.5rem] leading-none tracking-[-0.01em] md:text-[1.75rem]">
        <WordmarkBody />
      </span>
    )
  }

  // Hero: the page's <h1>. The animated pieces are hidden from screen readers; the label says "Still".
  return (
    <h1
      className="wordmark text-center font-serif text-display tracking-[-0.02em] lg:text-display-lg"
      data-intro={playIntro ? 'true' : undefined}
      aria-label="Still"
    >
      <span aria-hidden="true">
        <WordmarkBody />
      </span>
    </h1>
  )
}
