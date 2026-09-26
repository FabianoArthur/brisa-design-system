import { useMemo, useSyncExternalStore } from 'react';

const colorGroups: { title: string; tokens: string[] }[] = [
  {
    title: 'Surfaces',
    tokens: ['bg', 'surface', 'surface-sunken', 'surface-hover', 'border', 'border-strong'],
  },
  { title: 'Text', tokens: ['text', 'text-muted', 'accent-text', 'on-accent'] },
  { title: 'Accent', tokens: ['accent', 'accent-hover', 'accent-subtle', 'focus'] },
  {
    title: 'Status',
    tokens: [
      'success-text',
      'success-surface',
      'warning-text',
      'warning-surface',
      'danger',
      'danger-text',
      'danger-surface',
      'info-text',
      'info-surface',
    ],
  },
];

const typeScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const spaces = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16'];
const radii = ['sm', 'md', 'lg', 'xl', 'full'];
const shadows = ['sm', 'md', 'lg'];

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', onChange);
  return () => {
    observer.disconnect();
    mql.removeEventListener('change', onChange);
  };
}

const themeSnapshot = () =>
  `${document.documentElement.getAttribute('data-theme')}|${window.matchMedia('(prefers-color-scheme: dark)').matches}`;

/** Reads the computed value of each custom property, re-reading whenever the theme changes. */
function useTokenValues(names: string[]): Record<string, string> {
  const theme = useSyncExternalStore(subscribeToTheme, themeSnapshot);
  const key = names.join('|');
  return useMemo(() => {
    const style = getComputedStyle(document.documentElement);
    return Object.fromEntries(key.split('|').map((n) => [n, style.getPropertyValue(n).trim()]));
    // `theme` is the invalidation signal: computed values change with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, theme]);
}

export function TokensPage() {
  const colorNames = colorGroups.flatMap((g) => g.tokens.map((t) => `--br-color-${t}`));
  const values = useTokenValues([
    ...colorNames,
    ...typeScale.map((t) => `--br-text-${t}`),
    ...spaces.map((s) => `--br-space-${s}`),
  ]);

  return (
    <article className="doc">
      <header className="doc__header">
        <p className="eyebrow">Foundations</p>
        <h1>Tokens</h1>
        <p className="lede">
          Two layers: <strong>primitives</strong> (the raw palette and scales) and{' '}
          <strong>semantic tokens</strong> (what components use). Themes only remap the semantic
          layer. Values below are read live from the page, so switch the theme to see them change.
        </p>
      </header>

      <h2>Colour</h2>
      {colorGroups.map((group) => (
        <section key={group.title} aria-labelledby={`c-${group.title}`}>
          <h3 id={`c-${group.title}`}>{group.title}</h3>
          <ul className="swatches">
            {group.tokens.map((t) => {
              const name = `--br-color-${t}`;
              return (
                <li key={t} className="swatch">
                  <span
                    className="swatch__chip"
                    style={{ background: `var(${name})` }}
                    aria-hidden="true"
                  />
                  <code className="swatch__name">{name}</code>
                  <span className="swatch__value">{values[name]}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <h2>Typography</h2>
      <ul className="type-scale">
        {typeScale.map((t) => (
          <li key={t}>
            <code>--br-text-{t}</code>
            <span className="type-scale__value">{values[`--br-text-${t}`]}</span>
            <span className="type-scale__sample" style={{ fontSize: `var(--br-text-${t})` }}>
              The quick brown fox
            </span>
          </li>
        ))}
      </ul>

      <h2>Spacing</h2>
      <p>A 4px grid. Use these for padding, gaps and margins.</p>
      <ul className="space-scale">
        {spaces.map((s) => (
          <li key={s}>
            <code>--br-space-{s}</code>
            <span
              className="space-scale__bar"
              style={{ width: `var(--br-space-${s})` }}
              aria-hidden="true"
            />
            <span className="type-scale__value">{values[`--br-space-${s}`]}</span>
          </li>
        ))}
      </ul>

      <h2>Radius and elevation</h2>
      <div className="shape-grid">
        {radii.map((r) => (
          <div key={r} className="shape" style={{ borderRadius: `var(--br-radius-${r})` }}>
            <code>--br-radius-{r}</code>
          </div>
        ))}
        {shadows.map((s) => (
          <div
            key={s}
            className="shape shape--shadow"
            style={{ boxShadow: `var(--br-shadow-${s})` }}
          >
            <code>--br-shadow-{s}</code>
          </div>
        ))}
      </div>
    </article>
  );
}
