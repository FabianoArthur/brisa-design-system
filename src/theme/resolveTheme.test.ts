import { readStoredMode, resolveTheme, writeStoredMode } from './resolveTheme';

describe('resolveTheme', () => {
  it('returns explicit modes unchanged', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the OS preference in system mode', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });
});

describe('readStoredMode', () => {
  const store = (value: string | null) => ({ getItem: () => value });

  it('returns a valid stored mode', () => {
    expect(readStoredMode(store('dark'), 'k')).toBe('dark');
    expect(readStoredMode(store('light'), 'k')).toBe('light');
  });

  it('falls back to system for missing or garbage values', () => {
    expect(readStoredMode(store(null), 'k')).toBe('system');
    expect(readStoredMode(store('purple'), 'k')).toBe('system');
    expect(readStoredMode(undefined, 'k')).toBe('system');
  });

  it('falls back to system when storage throws (private mode, blocked cookies)', () => {
    const throwing = {
      getItem: () => {
        throw new DOMException('denied', 'SecurityError');
      },
    };
    expect(readStoredMode(throwing, 'k')).toBe('system');
  });
});

describe('writeStoredMode', () => {
  it('writes the mode', () => {
    const setItem = vi.fn();
    writeStoredMode({ setItem }, 'k', 'dark');
    expect(setItem).toHaveBeenCalledWith('k', 'dark');
  });

  it('swallows storage errors', () => {
    const setItem = () => {
      throw new DOMException('full', 'QuotaExceededError');
    };
    expect(() => writeStoredMode({ setItem }, 'k', 'dark')).not.toThrow();
  });
});
