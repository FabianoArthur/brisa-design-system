import {
  cloneElement,
  useEffect,
  useId,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

type TriggerProps = {
  'aria-describedby'?: string;
  onFocus?: (e: FocusEvent<HTMLElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
};

export interface TooltipProps {
  /** Short supplementary text. Never put essential information only here. */
  content: ReactNode;
  /** A single focusable element (usually a Button). */
  children: ReactElement<TriggerProps>;
  placement?: 'top' | 'bottom';
  /** Hover delay in ms; keyboard focus shows immediately. */
  delay?: number;
}

export function Tooltip({ content, children, placement = 'top', delay = 300 }: TooltipProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hoverReady, setHoverReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = !dismissed && (focused || hoverReady);

  // Hover shows after a delay so sweeping the pointer across a toolbar stays quiet.
  useEffect(() => {
    if (!hovering) return;
    const timer = window.setTimeout(() => setHoverReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [hovering, delay]);

  // Esc dismisses without moving focus (WCAG 1.4.13 "dismissible").
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDismissed(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const child = children.props;
  const trigger = cloneElement(children, {
    'aria-describedby': cx(child['aria-describedby'], open && id) || undefined,
    onFocus: (e: FocusEvent<HTMLElement>) => {
      child.onFocus?.(e);
      setDismissed(false);
      setFocused(true);
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      child.onBlur?.(e);
      setFocused(false);
    },
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      child.onMouseEnter?.(e);
      setDismissed(false);
      setHovering(true);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      child.onMouseLeave?.(e);
      setHovering(false);
      setHoverReady(false);
    },
  });

  return (
    <span className="br-tooltip">
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cx('br-tooltip__bubble', `br-tooltip__bubble--${placement}`)}
        >
          {content}
        </span>
      )}
    </span>
  );
}
