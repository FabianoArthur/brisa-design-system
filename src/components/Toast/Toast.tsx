import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { toastReducer, type ToastItem, type ToastTone } from './toastQueue';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss time in ms. */
  duration?: number;
  /** Maximum toasts on screen; the oldest is dropped first. */
  max?: number;
}

let counter = 0;

export function ToastProvider({ children, duration = 5000, max = 5 }: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const dismiss = useCallback((id: string) => dispatch({ type: 'remove', id }), []);
  const toast = useCallback(
    ({ title, description, tone = 'info', duration: d }: ToastOptions) => {
      const id = `br-toast-${++counter}`;
      dispatch({
        type: 'add',
        toast: { id, title, description, tone, duration: d ?? duration },
        max,
      });
      return id;
    },
    [duration, max],
  );
  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* The live region exists before any toast so screen readers pick up additions. */}
      <section className="br-toaster" aria-label="Notifications">
        <ol className="br-toaster__list" aria-live="polite" aria-relevant="additions">
          {toasts.map((t) => (
            <ToastView key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);

  useEffect(() => {
    if (paused || toast.duration <= 0) return;
    const started = Date.now();
    const timer = window.setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [paused, toast.id, toast.duration, onDismiss]);

  return (
    <li
      className={cx('br-toast', `br-toast--${toast.tone}`)}
      role={toast.tone === 'danger' ? 'alert' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="br-toast__bar" aria-hidden="true" />
      <div className="br-toast__content">
        <p className="br-toast__title">{toast.title}</p>
        {toast.description && <p className="br-toast__description">{toast.description}</p>}
      </div>
      <button
        type="button"
        className="br-toast__dismiss"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
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
    </li>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>.');
  return ctx;
}
