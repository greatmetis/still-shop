import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SelectField } from './SelectField'

const options = (
  <>
    <option value="a">Apple</option>
    <option value="b">Banana</option>
  </>
)

describe('SelectField', () => {
  it('is a labelled select showing the current value (minimal props)', () => {
    render(
      <SelectField id="fruit" label="Fruit" value="a" onChange={() => {}}>
        {options}
      </SelectField>,
    )
    const select = screen.getByRole('combobox', { name: 'Fruit' })
    expect(select).toHaveValue('a')
    expect(select).toBeEnabled()
  })

  it('can be disabled', () => {
    render(
      <SelectField id="fruit" label="Fruit" value="a" onChange={() => {}} disabled>
        {options}
      </SelectField>,
    )
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeDisabled()
  })

  it('reports the chosen value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn<(value: string) => void>()
    render(
      <SelectField id="fruit" label="Fruit" value="a" onChange={onChange}>
        {options}
      </SelectField>,
    )
    await user.selectOptions(screen.getByRole('combobox', { name: 'Fruit' }), 'Banana')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('b')
  })
})
