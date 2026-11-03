import { SelectField } from './SelectField'
import type { CategoryFilterProps } from './types'

export function CategoryFilter({ id, label, options, value, onChange, disabled = false, loading = false }: CategoryFilterProps) {
  return (
    <SelectField
      id={id}
      label={label}
      value={value ?? ''}
      disabled={disabled || loading}
      // The empty string means "All categories", which the route understands as null.
      onChange={(next) => onChange(next === '' ? null : next)}
    >
      {loading ? (
        <option value="">Loading…</option>
      ) : (
        <>
          <option value="">All categories</option>
          {options.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.name}
            </option>
          ))}
        </>
      )}
    </SelectField>
  )
}
