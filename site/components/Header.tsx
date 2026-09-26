import { Badge, useTheme, type ThemeMode } from '../../src';

const modes: { value: ThemeMode; label: string; icon: string }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: 'M8 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM8 0v2M8 14v2M0 8h2M14 8h2M2.3 2.3l1.4 1.4M12.3 12.3l1.4 1.4M2.3 13.7l1.4-1.4M12.3 3.7l1.4-1.4',
  },
  { value: 'system', label: 'System', icon: 'M1.5 2.5h13v8.5h-13zM5.5 14h5M8 11v3' },
  { value: 'dark', label: 'Dark', icon: 'M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5Z' },
];

export function Header() {
  const { mode, setMode } = useTheme();
  return (
    <header className="site-header">
      <a href="#/" className="brand">
        <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="8" />
          <path d="M7 12c4-3 7 3 11 0s5-2 7-1M7 18c4-3 7 3 11 0s5-2 7-1M7 24c4-3 7 3 11 0" />
        </svg>
        <span className="brand__name">Brisa</span>
        <Badge tone="accent">v0.1</Badge>
      </a>
      <div className="site-header__actions">
        <fieldset className="theme-switch">
          <legend className="br-visually-hidden">Theme</legend>
          {modes.map((m) => (
            <label key={m.value} className="theme-switch__option" title={m.label}>
              <input
                type="radio"
                name="theme"
                value={m.value}
                checked={mode === m.value}
                onChange={() => setMode(m.value)}
              />
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d={m.icon} />
              </svg>
              <span className="br-visually-hidden">{m.label}</span>
            </label>
          ))}
        </fieldset>
        <a
          className="icon-link"
          href="https://github.com/FabianoArthur/brisa-design-system"
          aria-label="Source code on GitHub"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}
