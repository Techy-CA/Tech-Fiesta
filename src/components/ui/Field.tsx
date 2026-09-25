import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

interface FieldShellProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: ReactNode
}

export const FieldShell = ({ label, htmlFor, required, error, children }: FieldShellProps) => (
  <div className="field">
    <label className="field__label" htmlFor={htmlFor}>
      <span>{label}</span>
      {required ? <span className="field__req">required</span> : null}
    </label>
    {children}
    {error ? <span className="field__error">{error}</span> : null}
  </div>
)

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

export const TextField = ({ id, label, error, required, ...rest }: TextFieldProps) => (
  <FieldShell label={label} htmlFor={id} required={required} error={error}>
    <input
      id={id}
      className={error ? 'input input--error' : 'input'}
      aria-invalid={error ? true : undefined}
      {...rest}
    />
  </FieldShell>
)

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  error?: string
  options: readonly string[]
}

export const SelectField = ({ id, label, error, options, required, ...rest }: SelectFieldProps) => (
  <FieldShell label={label} htmlFor={id} required={required} error={error}>
    <select id={id} className={error ? 'input input--error' : 'input'} {...rest}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </FieldShell>
)
