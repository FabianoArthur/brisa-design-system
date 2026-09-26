export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. */
  duration: number;
}

export type ToastAction =
  { type: 'add'; toast: ToastItem; max: number } | { type: 'remove'; id: string };

export function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'add': {
      const next = [...state, action.toast];
      return next.length > action.max ? next.slice(next.length - action.max) : next;
    }
    case 'remove': {
      const next = state.filter((t) => t.id !== action.id);
      return next.length === state.length ? state : next;
    }
  }
}
