import type { ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { Field } from '../Field/Field';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  hint,
  error,
  id,
  required,
  className,
  rows = 4,
  ref,
  ...rest
}: TextareaProps) {
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
        <textarea
          ref={ref}
          rows={rows}
          required={required}
          className="br-control br-textarea"
          {...control}
          {...rest}
        />
      )}
    </Field>
  );
}
