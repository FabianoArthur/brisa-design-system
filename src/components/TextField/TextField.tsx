import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';
import { Field } from '../Field/Field';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  hint,
  error,
  id,
  required,
  className,
  type = 'text',
  ref,
  ...rest
}: TextFieldProps) {
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
        <input
          ref={ref}
          type={type}
          required={required}
          className={cx('br-control', 'br-textfield')}
          {...control}
          {...rest}
        />
      )}
    </Field>
  );
}
