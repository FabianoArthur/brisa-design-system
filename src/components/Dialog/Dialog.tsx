import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { cx } from '../../utils/cx';

export interface DialogProps {
  open: boolean;
  /** Called for every user-initiated close: close button, Esc, backdrop click. */
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
  className?: string;
}

/**
 * Modal built on the native <dialog> + showModal(): the browser provides the
 * top layer, an inert background and Esc handling. We add labelling, backdrop
 * clicks and focus restoration to the element that opened it.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pressStartedOnBackdrop = useRef(false);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = description ? `${baseId}-desc` : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    opener.current = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    // Focus the first focusable element (the close button at minimum).
    const first = dialog.querySelector<HTMLElement>(
      '[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();
    return () => {
      if (dialog.open) dialog.close();
      const target = opener.current;
      opener.current = null;
      if (target && target.isConnected) target.focus();
    };
  }, [open]);

  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    // Keep React state as the single source of truth for `open`.
    e.preventDefault();
    onClose();
  };

  // Only treat it as a backdrop click when both press and release land on the
  // <dialog> element itself (the panel fills it, so that is the ::backdrop).
  const handleMouseDown = (e: MouseEvent<HTMLDialogElement>) => {
    pressStartedOnBackdrop.current = e.target === e.currentTarget;
  };
  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && pressStartedOnBackdrop.current && e.target === e.currentTarget) {
      onClose();
    }
    pressStartedOnBackdrop.current = false;
  };

  if (!open) return null;

  return (
    // Backdrop clicks are a pointer convenience; keyboard users close with Esc
    // or the close button, so there is no keyboard equivalent to add here.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className={cx('br-dialog', `br-dialog--${size}`, className)}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onCancel={handleCancel}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="br-dialog__panel">
        <header className="br-dialog__header">
          <h2 id={titleId} className="br-dialog__title">
            {title}
          </h2>
          <button
            type="button"
            className="br-dialog__close"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
              <path
                d="m4 4 8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        {description && (
          <p id={descId} className="br-dialog__description">
            {description}
          </p>
        )}
        {children && <div className="br-dialog__body">{children}</div>}
        {footer && <footer className="br-dialog__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
