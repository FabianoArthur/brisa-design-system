import type { ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets aria-busy and ignores clicks while keeping focus. */
  loading?: boolean;
  fullWidth?: boolean;
  /** Icon rendered before the label. Decorative: give the button a text label. */
  icon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  type = 'button',
  className,
  children,
  onClick,
  disabled,
  ref,
  ...rest
}: ButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // aria-disabled (not `disabled`) keeps a loading button focusable, so focus
    // is not lost mid-submit; clicks are swallowed here instead.
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'br-button',
        `br-button--${variant}`,
        `br-button--${size}`,
        fullWidth && 'br-button--full',
        icon && !children ? 'br-button--icon-only' : false,
        loading && 'br-button--loading',
        className,
      )}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <span className="br-button__spinner" aria-hidden="true" />
      ) : (
        icon && (
          <span className="br-button__icon" aria-hidden="true">
            {icon}
          </span>
        )
      )}
      {children !== undefined && <span className="br-button__label">{children}</span>}
    </button>
  );
}
