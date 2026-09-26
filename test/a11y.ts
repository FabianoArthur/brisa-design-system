import axe from 'axe-core';

/**
 * Runs axe-core against a rendered container and fails with a readable list of
 * violations. `color-contrast` is disabled because jsdom does no layout or
 * painting; contrast is covered by src/tokens/contrast.test.ts instead.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`,
  );
  expect(summary).toEqual([]);
}
