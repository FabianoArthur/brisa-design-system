import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  readStoredMode,
  resolveTheme,
  writeStoredMode,
  type ResolvedTheme,
  type ThemeMode,
} from './resolveTheme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

interface ThemeContextValue {
  /** What the user picked. */
  mode: ThemeMode;
  /** What is actually applied. */
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isBrowser = typeof window !== 'undefined';

function safeStorage(): Storage | undefined {
  if (!isBrowser) return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** localStorage key used to remember the choice. */
  storageKey?: string;
  /** Mode used when nothing is stored. */
  defaultMode?: ThemeMode;
}

/**
 * Applies the theme by setting `data-theme` on <html>. Tokens in tokens.css key
 * off that attribute, so every component re-themes with zero JS per component.
 */
export function ThemeProvider({
  children,
  storageKey = 'brisa-theme',
  defaultMode = 'system',
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => readStoredMode(safeStorage(), storageKey) ?? defaultMode,
  );
  // SSR-safe: on the server there is no OS preference, so assume light.
  const [prefersDark, setPrefersDark] = useState(
    () => isBrowser && window.matchMedia(DARK_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const resolved = resolveTheme(mode, prefersDark);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
  }, [resolved]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      writeStoredMode(safeStorage(), storageKey, next);
    },
    [storageKey],
  );

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return ctx;
}
