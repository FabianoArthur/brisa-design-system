import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeProvider';

function mockMatchMedia(initial: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: initial,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
      listeners.delete(cb),
  };
  vi.spyOn(window, 'matchMedia').mockReturnValue(mql as unknown as MediaQueryList);
  return (matches: boolean) => {
    mql.matches = matches;
    listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
  };
}

function Probe() {
  const { mode, resolved, setMode } = useTheme();
  return (
    <>
      <p>
        {mode}/{resolved}
      </p>
      <button onClick={() => setMode('dark')}>dark</button>
      <button onClick={() => setMode('system')}>system</button>
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('resolves system mode from the OS and sets data-theme on <html>', () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText('system/dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('follows OS changes while in system mode', () => {
    const setOs = mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    act(() => setOs(true));
    expect(screen.getByText('system/dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('persists an explicit choice and restores it on the next mount', async () => {
    mockMatchMedia(false);
    const { unmount } = render(
      <ThemeProvider storageKey="t">
        <Probe />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'dark' }));
    expect(localStorage.getItem('t')).toBe('dark');
    unmount();
    render(
      <ThemeProvider storageKey="t">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText('dark/dark')).toBeInTheDocument();
  });

  it('throws a helpful error when useTheme is used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/ThemeProvider/);
  });
});
