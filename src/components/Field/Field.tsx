import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  id?: string;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}

/**
 * Internal layout shared by TextField, Textarea and Select: a visible label,
 * optional hint and error, all wired to the control through ids.
 */
export function Field({ label, hint, error, required, id, className, children }: FieldProps) {
  const autoId = useId();
  const controlId = id ?? `br-field-${autoId}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('br-field', error ? 'br-field--invalid' : false, className)}>
      <label className="br-field__label" htmlFor={controlId}>
        {label}
        {required && (
          <span className="br-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {hint && (
        <p className="br-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      {children({
        id: controlId,
        'aria-describedby': describedBy,
        ...(error ? { 'aria-invalid': true as const } : {}),
      })}
      {error && (
        <p className="br-field__error" id={errorId}>
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14">
            <path
              fill="currentColor"
              d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 3.25a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0V5A.75.75 0 0 0 8 4.25ZM8 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
