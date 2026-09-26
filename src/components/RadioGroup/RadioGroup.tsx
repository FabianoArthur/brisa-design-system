import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend: ReactNode;
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Native radios in a <fieldset>: arrow-key movement and "one tab stop per group"
 * come from the browser.
 */
export function RadioGroup({
  legend,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  const groupId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const selected = value !== undefined ? value : internal;

  return (
    <fieldset className={cx('br-radio-group', `br-radio-group--${orientation}`, className)}>
      <legend className="br-radio-group__legend">{legend}</legend>
      <div className="br-radio-group__options">
        {options.map((o) => {
          const inputId = `br-radio-${groupId}-${o.value}`;
          const descId = o.description ? `${inputId}-desc` : undefined;
          return (
            <div key={o.value} className="br-check br-check--radio">
              <input
                id={inputId}
                type="radio"
                name={name}
                value={o.value}
                disabled={o.disabled}
                checked={selected === o.value}
                aria-describedby={descId}
                className="br-check__input"
                onChange={() => {
                  if (value === undefined) setInternal(o.value);
                  onValueChange?.(o.value);
                }}
              />
              <span className="br-check__box" aria-hidden="true" />
              <span className="br-check__text">
                <label htmlFor={inputId} className="br-check__label">
                  {o.label}
                </label>
                {o.description && (
                  <span id={descId} className="br-check__desc">
                    {o.description}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
