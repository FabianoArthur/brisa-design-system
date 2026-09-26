export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (MODES as readonly string[]).includes(value);
}

export function resolveTheme(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === 'system') return prefersDark ? 'dark' : 'light';
  return mode;
}

/** Reads a stored mode. Any failure (missing, invalid, storage blocked) means "system". */
export function readStoredMode(
  storage: Pick<Storage, 'getItem'> | undefined,
  key: string,
): ThemeMode {
  try {
    const value = storage?.getItem(key);
    return isThemeMode(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

/** Persists a mode; storage being unavailable is not an error worth surfacing. */
export function writeStoredMode(
  storage: Pick<Storage, 'setItem'> | undefined,
  key: string,
  mode: ThemeMode,
): void {
  try {
    storage?.setItem(key, mode);
  } catch {
    // Private mode or quota exceeded: the choice simply won't persist.
  }
}
