import {
  cloneElement,
  useEffect,
  useId,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

type TriggerProps = {
  'aria-describedby'?: string;
  onFocus?: (e: FocusEvent<HTMLElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
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

  // Esc dismisses without moving focus (WCAG 1.4.13 "dismissible"). Captured
  // and consumed, so the first Esc closes the tooltip and not an enclosing Dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      e.stopPropagation();
      setDismissed(true);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
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
  });

  // Hover handlers live on the wrapper, which also contains the bubble, so the
  // pointer can move onto the tooltip without it vanishing (WCAG 1.4.13 "hoverable").
  return (
    <span
      className="br-tooltip"
      onMouseEnter={() => {
        setDismissed(false);
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
        setHoverReady(false);
      }}
    >
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
