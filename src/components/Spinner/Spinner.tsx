import { cx } from '../../utils/cx';

export interface SpinnerProps {
  /** Announced to assistive tech. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ label = 'Loading', size = 'md', className }: SpinnerProps) {
  return (
    <span role="status" className={cx('br-spinner', `br-spinner--${size}`, className)}>
      <svg className="br-spinner__svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="br-spinner__track" cx="12" cy="12" r="9" />
        <circle className="br-spinner__arc" cx="12" cy="12" r="9" />
      </svg>
      <span className="br-visually-hidden">{label}</span>
    </span>
  );
}
