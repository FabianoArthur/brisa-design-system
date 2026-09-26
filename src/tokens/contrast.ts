/**
 * WCAG 2.x contrast helpers plus a tiny parser that reads tokens.css and
 * resolves each theme's custom properties to concrete values. Used by the
 * palette contract test; not part of the runtime bundle.
 */

type Rgb = [number, number, number];

export function parseHex(hex: string): Rgb {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Expected a hex colour, got "${hex}"`);
  let digits = m[1]!;
  if (digits.length === 3) digits = [...digits].map((d) => d + d).join('');
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)) as Rgb;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(channel) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

type Declarations = Record<string, string>;

function declarations(body: string): Declarations {
  const out: Declarations = {};
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);?/g)) {
    out[m[1]!] = m[2]!.trim();
  }
  return out;
}

function resolve(vars: Declarations): Declarations {
  const out: Declarations = {};
  const lookup = (name: string, seen: string[]): string => {
    const raw = vars[name];
    if (raw === undefined) throw new Error(`Unresolvable token ${name} (via ${seen.join(' → ')})`);
    const ref = /^var\((--[\w-]+)\)$/.exec(raw);
    if (!ref) return raw;
    if (seen.includes(ref[1]!)) throw new Error(`Circular token ${ref[1]}`);
    return lookup(ref[1]!, [...seen, ref[1]!]);
  };
  for (const name of Object.keys(vars)) out[name] = lookup(name, [name]);
  return out;
}

export interface Themes {
  light: Declarations;
  dark: Declarations;
  /** The `@media (prefers-color-scheme: dark)` block, for drift checks. */
  mediaDark: Declarations;
}

export function readThemes(css: string): Themes {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let mediaBody = '';
  const rest = src.replace(
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{([\s\S]*?\})\s*\}/,
    (_, inner: string) => {
      mediaBody = inner;
      return '';
    },
  );

  const base: Declarations = {};
  const dark: Declarations = {};
  for (const m of rest.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1]!.trim();
    const decls = declarations(m[2]!);
    if (/data-theme=['"]?dark/.test(selector)) Object.assign(dark, decls);
    else if (/:root|data-theme=['"]?light/.test(selector)) Object.assign(base, decls);
  }
  const mediaDark: Declarations = {};
  for (const m of mediaBody.matchAll(/([^{}]+)\{([^{}]*)\}/g)) Object.assign(mediaDark, declarations(m[2]!));

  return {
    light: resolve(base),
    dark: resolve({ ...base, ...dark }),
    mediaDark: resolve({ ...base, ...mediaDark }),
  };
}
