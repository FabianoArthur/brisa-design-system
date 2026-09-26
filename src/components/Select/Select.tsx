import type { ReactNode, Ref, SelectHTMLAttributes } from 'react';
import { Field } from '../Field/Field';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: ReactNode;
  options: SelectOption[];
  /** Adds a disabled first option, useful with `defaultValue=""`. */
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLSelectElement>;
}

/**
 * A styled native <select>: keyboard, screen reader and mobile pickers all
 * come from the platform, which no custom listbox matches for free.
 */
export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  id,
  required,
  className,
  ref,
  ...rest
}: SelectProps) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
      className={className}
    >
      {(control) => (
        <div className="br-select">
          <select
            ref={ref}
            required={required}
            className="br-control br-select__control"
            {...control}
            {...rest}
          >
            {placeholder !== undefined && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="br-select__chevron"
            aria-hidden="true"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4 6 4 4 4-4"
            />
          </svg>
        </div>
      )}
    </Field>
  );
}
