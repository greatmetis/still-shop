import type { SelectFieldProps } from './types'

// The labelled native <select> that CategoryFilter and SortSelect both use (spec 7.4, 7.5).
export function SelectField({ id, label, value, onChange, disabled = false, children }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-caption font-medium tracking-[0.06em] text-text-muted uppercase">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none truncate rounded-none border border-border bg-bg pr-10 pl-3 text-small text-text hover:border-text focus:border-text disabled:opacity-40"
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
