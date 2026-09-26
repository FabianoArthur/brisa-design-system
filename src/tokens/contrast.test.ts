import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { contrastRatio, parseHex, readThemes, relativeLuminance } from './contrast';

describe('WCAG contrast math', () => {
  it('parses 3- and 6-digit hex colours', () => {
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
    expect(parseHex('#1f2328')).toEqual([31, 35, 40]);
    expect(() => parseHex('rgb(0,0,0)')).toThrow(/hex/);
  });

  it('computes relative luminance at the extremes', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#ffffff')).toBe(1);
  });

  it('matches the reference ratios', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#fff', '#fff')).toBeCloseTo(1, 5);
    // Reference value from the WCAG formula for #767676 on white.
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
    expect(contrastRatio('#ffffff', '#767676')).toBeCloseTo(4.54, 2);
  });
});

describe('readThemes', () => {
  const css = `
    :root { --p-white: #ffffff; --p-ink: #111111; }
    :root, [data-theme='light'] { --fg: var(--p-ink); --bg: var(--p-white); }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme='light']) { --fg: var(--p-white); --bg: var(--p-ink); }
    }
    [data-theme='dark'] { --fg: var(--p-white); --bg: var(--p-ink); }
  `;

  it('resolves var() references to primitive hex values per theme', () => {
    const themes = readThemes(css);
    expect(themes.light['--fg']).toBe('#111111');
    expect(themes.dark['--bg']).toBe('#111111');
    expect(themes.mediaDark['--fg']).toBe('#ffffff');
  });

  it('throws on an unresolvable reference', () => {
    expect(() => readThemes(`:root { --a: var(--missing); } [data-theme='dark'] {}`)).toThrow(
      /--missing/,
    );
  });
});

describe('Brisa token palette', () => {
  const css = readFileSync(resolve(__dirname, 'tokens.css'), 'utf8');
  const themes = readThemes(css);

  it('keeps the prefers-color-scheme dark block identical to [data-theme="dark"]', () => {
    expect(themes.mediaDark).toEqual(themes.dark);
  });

  // [foreground, background, minimum ratio]
  const pairs: Array<[string, string, number]> = [
    ['--br-color-text', '--br-color-bg', 4.5],
    ['--br-color-text', '--br-color-surface', 4.5],
    ['--br-color-text', '--br-color-surface-sunken', 4.5],
    ['--br-color-text-muted', '--br-color-bg', 4.5],
    ['--br-color-text-muted', '--br-color-surface', 4.5],
    ['--br-color-text-muted', '--br-color-surface-sunken', 4.5],
    ['--br-color-on-accent', '--br-color-accent', 4.5],
    ['--br-color-on-accent', '--br-color-accent-hover', 4.5],
    ['--br-color-accent-text', '--br-color-bg', 4.5],
    ['--br-color-accent-text', '--br-color-surface', 4.5],
    ['--br-color-on-danger', '--br-color-danger', 4.5],
    ['--br-color-success-text', '--br-color-success-surface', 4.5],
    ['--br-color-warning-text', '--br-color-warning-surface', 4.5],
    ['--br-color-danger-text', '--br-color-danger-surface', 4.5],
    ['--br-color-info-text', '--br-color-info-surface', 4.5],
    ['--br-color-danger-text', '--br-color-bg', 4.5],
    ['--br-color-tooltip-text', '--br-color-tooltip-bg', 4.5],
    // Non-text UI (form control borders, focus ring): WCAG 1.4.11 → 3:1.
    ['--br-color-border-strong', '--br-color-bg', 3],
    ['--br-color-border-strong', '--br-color-surface', 3],
    ['--br-color-focus', '--br-color-bg', 3],
    ['--br-color-focus', '--br-color-surface', 3],
    ['--br-color-accent', '--br-color-bg', 3],
  ];

  for (const theme of ['light', 'dark'] as const) {
    describe(`${theme} theme`, () => {
      it.each(pairs)('%s on %s ≥ %s:1', (fg, bg, min) => {
        const a = themes[theme][fg];
        const b = themes[theme][bg];
        expect(a, `${fg} missing`).toBeDefined();
        expect(b, `${bg} missing`).toBeDefined();
        expect(contrastRatio(a!, b!)).toBeGreaterThanOrEqual(min);
      });
    });
  }
});
