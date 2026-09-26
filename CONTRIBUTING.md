# Contributing

Thanks for your interest! Issues and pull requests are welcome.

## Setup

```bash
npm ci
npm run dev        # docs site with live reload
```

## Before opening a pull request

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks plus a secret scan, so running them locally saves a round trip.

## Guidelines

- **Tokens, not raw values.** Components use semantic tokens (`--br-color-*`, `--br-space-*`…). If you
  add or change a colour pair, add it to `src/tokens/contrast.test.ts`; it must pass WCAG AA in both themes.
- **Accessibility is part of "done".** Prefer native elements. Custom widgets follow the
  [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/). Every component is covered by an
  axe-core check, and keyboard behaviour is tested with user-event.
- **Test behaviour, not implementation.** Query by role and accessible name, as a user would.
- **Document it.** New components get an entry in `site/docs.tsx` with examples, props and accessibility notes.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- If you change the diagram, edit `scripts/build-diagrams.mjs` and run `npm run diagrams`.
