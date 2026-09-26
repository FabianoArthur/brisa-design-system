// Generates the animated architecture diagrams used in the READMEs:
//   docs/assets/architecture[.pt-BR]-{light,dark}.svg
// Hand-laid-out SVG. Dots travel along the arrows in the real order using CSS
// @keyframes only (no JS, no external fonts). prefers-reduced-motion hides them.
// Run: npm run diagrams
import { mkdirSync, writeFileSync } from 'node:fs';

const W = 880;
const H = 470;
const CYCLE = 8; // seconds

const themes = {
  light: {
    text: '#15181d',
    muted: '#525a66',
    bg: '#f7f8fa',
    bgStroke: '#cfd4dc',
    card: '#ffffff',
    cardStroke: '#cfd4dc',
    zone: '#e8f6f5',
    zoneStroke: '#93d9d2',
    zoneText: '#0b5e58',
    lane: '#f1f3f6',
    laneStroke: '#b0b7c3',
    chip: '#ffffff',
    chipStroke: '#93d9d2',
    edge: '#8a93a3',
    accent: '#0f766f',
  },
  dark: {
    text: '#f1f3f6',
    muted: '#b0b7c3',
    bg: '#0e1014',
    bgStroke: '#262b33',
    card: '#15181d',
    cardStroke: '#3b424c',
    zone: '#0b2624',
    zoneStroke: '#0b5e58',
    zoneText: '#5fc4bb',
    lane: '#15181d',
    laneStroke: '#3b424c',
    chip: '#0e1014',
    chipStroke: '#0b5e58',
    edge: '#69727f',
    accent: '#2fb0a5',
  },
};

const i18n = {
  en: {
    lang: 'en',
    title: 'How Brisa is built',
    desc: 'Design tokens in tokens.css define primitives and semantic colours. Themes (light, dark or system) remap the semantic tokens through a data-theme attribute on the html element. Sixteen React and TypeScript components read only semantic tokens and are consumed by your app and by the docs site. The quality gate tests every component with Vitest and Testing Library, runs axe-core accessibility checks and a WCAG contrast contract over the tokens; GitHub Actions CI runs lint, typecheck, tests, build and gitleaks, and on main a Pages workflow deploys the docs site.',
    library: 'library',
    quality: 'quality gate',
    tokens: 'Design tokens',
    tokensA: 'primitives →',
    tokensB: 'semantic tokens',
    themes: 'Themes',
    themesA: 'via data-theme',
    components: 'Components',
    componentsA: '16 · React + TypeScript',
    app: 'Your app',
    docs: 'Docs site',
    docsA: 'GitHub Pages',
    tests: 'Vitest + Testing Library',
    testsA: 'keyboard, ARIA, behaviour',
    testsB: 'axe-core on every component',
    testsC: 'WCAG contrast contract',
    ci: 'GitHub Actions CI',
    ciA: 'lint · typecheck · test',
    ciB: 'build · gitleaks',
    deploy: 'Pages deploy',
    deployA: 'on push to main',
    remaps: 'remap',
    reads: 'read',
    testedBy: 'tested by',
    gate: 'must pass',
    publishes: 'publishes',
    system: 'system',
    light: 'light',
    dark: 'dark',
  },
  'pt-BR': {
    lang: 'pt-BR',
    title: 'Como o Brisa é construído',
    desc: 'Os design tokens em tokens.css definem primitivas e cores semânticas. Os temas (claro, escuro ou do sistema) remapeiam os tokens semânticos por um atributo data-theme no elemento html. Dezesseis componentes React e TypeScript leem apenas tokens semânticos e são usados pela sua aplicação e pelo site de documentação. O portão de qualidade testa cada componente com Vitest e Testing Library, roda checagens de acessibilidade com axe-core e um contrato de contraste WCAG sobre os tokens; a CI no GitHub Actions roda lint, typecheck, testes, build e gitleaks, e na main um workflow do Pages publica o site de documentação.',
    library: 'biblioteca',
    quality: 'portão de qualidade',
    tokens: 'Design tokens',
    tokensA: 'primitivas →',
    tokensB: 'tokens semânticos',
    themes: 'Temas',
    themesA: 'via data-theme',
    components: 'Componentes',
    componentsA: '16 · React + TypeScript',
    app: 'Sua aplicação',
    docs: 'Site de docs',
    docsA: 'GitHub Pages',
    tests: 'Vitest + Testing Library',
    testsA: 'teclado, ARIA, comportamento',
    testsB: 'axe-core em cada componente',
    testsC: 'contrato de contraste WCAG',
    ci: 'CI no GitHub Actions',
    ciA: 'lint · typecheck · testes',
    ciB: 'build · gitleaks',
    deploy: 'Deploy no Pages',
    deployA: 'a cada push na main',
    remaps: 'remapeia',
    reads: 'lê',
    testedBy: 'testado por',
    gate: 'precisa passar',
    publishes: 'publica',
    system: 'sistema',
    light: 'claro',
    dark: 'escuro',
  },
};

// Edges in the order the dots travel. `at` = start second, `dur` = seconds.
const edges = [
  {
    d: [
      [196, 130],
      [256, 130],
    ],
    at: 0.2,
    dur: 0.7,
  },
  {
    d: [
      [408, 130],
      [460, 130],
    ],
    at: 1.0,
    dur: 0.7,
  },
  {
    d: [
      [650, 100],
      [700, 100],
    ],
    at: 1.8,
    dur: 0.6,
  },
  {
    d: [
      [650, 180],
      [700, 180],
    ],
    at: 1.8,
    dur: 0.6,
  },
  {
    d: [
      [555, 190],
      [555, 262],
      [185, 262],
      [185, 320],
    ],
    at: 2.6,
    dur: 1.4,
  },
  {
    d: [
      [330, 375],
      [370, 375],
    ],
    at: 4.1,
    dur: 0.6,
  },
  {
    d: [
      [650, 375],
      [700, 375],
    ],
    at: 4.8,
    dur: 0.6,
  },
  {
    d: [
      [778, 320],
      [778, 210],
    ],
    at: 5.5,
    dur: 0.9,
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pathD = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
const pct = (s) => `${((s / CYCLE) * 100).toFixed(2)}%`;

function segLengths(pts) {
  const lens = [];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    lens.push(Math.hypot(x1 - x0, y1 - y0));
  }
  return lens;
}

function keyframes(i, e) {
  const [sx, sy] = e.d[0];
  const [ex, ey] = e.d.at(-1);
  const lens = segLengths(e.d);
  const total = lens.reduce((a, b) => a + b, 0);
  const t = (s) => `translate(${s[0]}px,${s[1]}px)`;
  const end = e.at + e.dur;
  const lines = [
    `0%,${pct(e.at - 0.12)}{opacity:0;transform:${t(e.d[0])}}`,
    `${pct(e.at)}{opacity:1;transform:${t(e.d[0])};animation-timing-function:linear}`,
  ];
  let acc = 0;
  for (let k = 1; k < e.d.length - 1; k++) {
    acc += lens[k - 1];
    lines.push(
      `${pct(e.at + (acc / total) * e.dur)}{opacity:1;transform:${t(e.d[k])};animation-timing-function:linear}`,
    );
  }
  lines.push(`${pct(end)}{opacity:1;transform:${t([ex, ey])}}`);
  lines.push(`${pct(end + 0.25)},100%{opacity:0;transform:${t([ex, ey])}}`);
  const hl = [
    `0%,${pct(e.at - 0.1)}{opacity:0}`,
    `${pct(e.at)},${pct(end)}{opacity:.9}`,
    `${pct(end + 0.6)},100%{opacity:0}`,
  ];
  return (
    `@keyframes p${i}{${lines.join('')}}\n` +
    `@keyframes h${i}{${hl.join('')}}\n` +
    `.p${i}{transform:translate(${sx}px,${sy}px);animation:p${i} ${CYCLE}s infinite both}\n` +
    `.h${i}{animation:h${i} ${CYCLE}s infinite both}\n`
  );
}

function svg(theme, text) {
  const c = themes[theme];
  const L = text;
  const card = (x, y, w, h) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="card"/>`;
  const t = (x, y, cls, s, anchor) =>
    `<text x="${x}" y="${y}" class="${cls}"${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(s)}</text>`;
  const chip = (x, y, w, s) =>
    `<rect x="${x}" y="${y}" width="${w}" height="24" rx="12" class="chip"/>` +
    t(x + w / 2, y + 16.5, 'c', s, 'middle');

  const out = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title desc" lang="${L.lang}">`,
  );
  out.push(`<title id="title">${esc(L.title)}</title>`);
  out.push(`<desc id="desc">${esc(L.desc)}</desc>`);
  out.push('<style>');
  out.push(
    `text{font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;fill:${c.text}}`,
  );
  out.push('.b{font-size:14.5px;font-weight:600}.m{font-size:12.5px;fill:' + c.muted + '}');
  out.push(
    `.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px}`,
  );
  out.push(`.c{font-size:11.5px;font-weight:600;fill:${c.zoneText}}`);
  out.push(`.h{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}`);
  out.push(`.lbl{font-size:11.5px;fill:${c.muted};font-style:italic}`);
  out.push(`.bg{fill:${c.bg};stroke:${c.bgStroke}}.card{fill:${c.card};stroke:${c.cardStroke}}`);
  out.push(
    `.zone{fill:${c.zone};stroke:${c.zoneStroke}}.lane{fill:${c.lane};stroke:${c.laneStroke};stroke-dasharray:5 4}`,
  );
  out.push(`.chip{fill:${c.chip};stroke:${c.chipStroke}}`);
  out.push(`.e{fill:none;stroke:${c.edge};stroke-width:1.5;stroke-linejoin:round}`);
  out.push(`.hl{fill:none;stroke:${c.accent};stroke-width:2.25;stroke-linejoin:round;opacity:0}`);
  out.push(`.dot{fill:${c.accent}}.halo{fill:${c.accent};opacity:.25}.pk{opacity:0}`);
  edges.forEach((e, i) => out.push(keyframes(i, e)));
  out.push('@media (prefers-reduced-motion:reduce){.pk,.hl{animation:none;display:none}}');
  out.push('</style>');
  out.push(
    `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="${c.edge}"/></marker></defs>`,
  );
  out.push(`<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" class="bg"/>`);

  // Zones
  out.push(`<rect x="24" y="24" width="646" height="222" rx="14" class="zone"/>`);
  out.push(`<text x="44" y="50" class="h" style="fill:${c.zoneText}">${esc(L.library)}</text>`);
  out.push(`<rect x="24" y="290" width="646" height="160" rx="14" class="lane"/>`);
  out.push(`<text x="44" y="312" class="h" style="fill:${c.muted}">${esc(L.quality)}</text>`);

  // Library cards
  out.push(card(40, 70, 156, 120));
  out.push(t(56, 98, 'b', L.tokens));
  out.push(t(56, 120, 'mono', 'tokens.css'));
  out.push(t(56, 146, 'm', L.tokensA));
  out.push(t(56, 164, 'm', L.tokensB));

  out.push(card(256, 70, 152, 120));
  out.push(t(272, 98, 'b', L.themes));
  out.push(chip(272, 112, 44, L.light));
  out.push(chip(322, 112, 50, L.dark));
  out.push(chip(272, 142, 62, L.system));
  out.push(t(272, 182, 'm', L.themesA));

  out.push(card(460, 70, 190, 120));
  out.push(t(476, 98, 'b', L.components));
  out.push(t(476, 118, 'm', L.componentsA));
  out.push(chip(476, 130, 54, 'Button'));
  out.push(chip(536, 130, 52, 'Dialog'));
  out.push(chip(594, 130, 40, 'Tabs'));
  out.push(chip(476, 158, 48, 'Toast'));
  out.push(chip(530, 158, 48, 'Table'));
  out.push(t(588, 175, 'b', '+11'));

  // Consumers
  out.push(card(700, 70, 156, 60));
  out.push(t(716, 95, 'b', L.app));
  out.push(t(716, 115, 'mono', "import 'brisa-ui'"));
  out.push(card(700, 150, 156, 60));
  out.push(t(716, 175, 'b', L.docs));
  out.push(t(716, 195, 'm', L.docsA));

  // Quality cards
  out.push(card(40, 320, 290, 112));
  out.push(t(56, 346, 'b', L.tests));
  out.push(t(56, 370, 'm', `· ${L.testsA}`));
  out.push(t(56, 390, 'm', `· ${L.testsB}`));
  out.push(t(56, 410, 'm', `· ${L.testsC}`));
  out.push(card(370, 320, 280, 112));
  out.push(t(386, 346, 'b', L.ci));
  out.push(t(386, 370, 'm', L.ciA));
  out.push(t(386, 390, 'm', L.ciB));
  out.push(t(386, 414, 'lbl', L.gate));
  out.push(card(700, 320, 156, 112));
  out.push(t(716, 346, 'b', L.deploy));
  out.push(t(716, 368, 'mono', 'deploy-pages'));
  out.push(t(716, 390, 'm', L.deployA));

  // Edges + labels
  for (const e of edges) out.push(`<path d="${pathD(e.d)}" class="e" marker-end="url(#ah)"/>`);
  out.push(t(226, 121, 'lbl', L.remaps, 'middle'));
  out.push(t(434, 121, 'lbl', L.reads, 'middle'));
  out.push(t(370, 256, 'lbl', L.testedBy, 'middle'));
  out.push(t(790, 268, 'lbl', L.publishes));

  // Animated highlights + packets
  edges.forEach((e, i) => {
    out.push(`<path d="${pathD(e.d)}" class="hl h${i}"/>`);
    out.push(`<g class="pk p${i}"><circle r="9" class="halo"/><circle r="4.5" class="dot"/></g>`);
  });

  out.push('</svg>');
  return out.join('\n') + '\n';
}

mkdirSync('docs/assets', { recursive: true });
for (const [lang, text] of Object.entries(i18n)) {
  for (const theme of Object.keys(themes)) {
    const suffix = lang === 'en' ? '' : `.${lang}`;
    const file = `docs/assets/architecture${suffix}-${theme}.svg`;
    writeFileSync(file, svg(theme, text));
    console.log('wrote', file);
  }
}
