import type { SearchBoxProps } from './types'

export function SearchBox({ id, label, value, placeholder, onChange, onClear, disabled = false }: SearchBoxProps) {
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- spec 7.3 asks for form role="search"
    <form role="search" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor={id} className="mb-2 block text-caption font-medium tracking-[0.06em] text-text-muted uppercase">
        {label}
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          type="search"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-none border border-border bg-bg pr-11 pl-10 text-body text-text placeholder:text-text-muted hover:border-text focus:border-text disabled:opacity-40 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value !== '' && !disabled && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={onClear}
            className="absolute top-0 right-0 inline-flex size-11 items-center justify-center text-text-muted hover:text-text"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}
