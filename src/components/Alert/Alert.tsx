import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const icons: Record<AlertTone, string> = {
  info: 'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 6a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 7Zm0-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  success:
    'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm3.03 4.97a.75.75 0 0 0-1.06 0L7 8.94 6.03 7.97a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0 0-1.06Z',
  warning:
    'M7.13 1.5a1 1 0 0 1 1.74 0l6.5 11.5A1 1 0 0 1 14.5 14.5h-13A1 1 0 0 1 .63 13l6.5-11.5ZM8 5.25a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0V6A.75.75 0 0 0 8 5.25ZM8 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  danger:
    'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 3.25a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0V5A.75.75 0 0 0 8 4.25ZM8 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
};

/**
 * Inline message. Danger and warning use role="alert" (announced immediately);
 * info and success use role="status" (announced politely).
 */
export function Alert({ tone = 'info', title, children, onDismiss, className }: AlertProps) {
  const urgent = tone === 'danger' || tone === 'warning';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cx('br-alert', `br-alert--${tone}`, className)}
    >
      <svg className="br-alert__icon" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
        <path fill="currentColor" d={icons[tone]} />
      </svg>
      <div className="br-alert__content">
        <p className="br-alert__title">{title}</p>
        {children && <div className="br-alert__body">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="br-alert__dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14">
            <path
              d="m4 4 8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
