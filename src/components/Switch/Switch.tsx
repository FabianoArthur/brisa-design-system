import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'role' | 'type'
> {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** An on/off control. Takes effect immediately; use Checkbox inside forms that submit. */
export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id,
  className,
  ...rest
}: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? `br-switch-${autoId}`;
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onCheckedChange?.(!on);
  };

  return (
    <div className={cx('br-switch', className)}>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        className="br-switch__track"
        onClick={toggle}
        {...rest}
      >
        <span className="br-switch__thumb" aria-hidden="true" />
      </button>
      <label htmlFor={switchId} className="br-switch__label">
        {label}
      </label>
    </div>
  );
}
