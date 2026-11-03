import { SelectField } from './SelectField'
import type { SortOption, SortSelectProps } from './types'

export function SortSelect({ id, label, options, value, onChange, disabled = false }: SortSelectProps) {
  return (
    <SelectField
      id={id}
      label={label}
      value={value}
      disabled={disabled}
      // The <select> only reports strings. The options we render are all SortValues,
      // so we look the chosen one up instead of casting the string.
      onChange={(next) => {
        const chosen: SortOption | undefined = options.find((option) => option.value === next)
        if (chosen) onChange(chosen.value)
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectField>
  )
}
