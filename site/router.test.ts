import { parseHash, toHref } from './router';

describe('hash router', () => {
  it('maps empty and root hashes to home', () => {
    expect(parseHash('')).toEqual({ page: 'home' });
    expect(parseHash('#/')).toEqual({ page: 'home' });
  });

  it('parses the tokens page and component pages', () => {
    expect(parseHash('#/tokens')).toEqual({ page: 'tokens' });
    expect(parseHash('#/components/button')).toEqual({ page: 'component', slug: 'button' });
  });

  it('treats anything else as not found', () => {
    expect(parseHash('#/nope')).toEqual({ page: 'not-found' });
    expect(parseHash('#/components/')).toEqual({ page: 'not-found' });
    expect(parseHash('#/components/a/b')).toEqual({ page: 'not-found' });
  });

  it('builds hrefs that round-trip', () => {
    for (const route of [
      { page: 'home' as const },
      { page: 'tokens' as const },
      { page: 'component' as const, slug: 'tabs' },
    ]) {
      expect(parseHash(toHref(route))).toEqual(route);
    }
  });
});
