import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
  /** Visual + ARIA "mixed" state, e.g. a partially selected "select all". */
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  description,
  indeterminate = false,
  id,
  className,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? `br-checkbox-${autoId}`;
  const descId = description ? `${inputId}-desc` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  // `indeterminate` is a DOM property only; there is no HTML attribute for it.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx('br-check', className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        className="br-check__input"
        aria-describedby={descId}
        {...rest}
      />
      <span className="br-check__box" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="br-check__tick">
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
        <svg viewBox="0 0 16 16" className="br-check__dash">
          <path d="M4 8h8" />
        </svg>
      </span>
      <span className="br-check__text">
        <label htmlFor={inputId} className="br-check__label">
          {label}
        </label>
        {description && (
          <span id={descId} className="br-check__desc">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
