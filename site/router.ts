import { useEffect, useState } from 'react';

// Hash routing keeps GitHub Pages happy: every URL resolves to index.html.
export type Route =
  | { page: 'home' }
  | { page: 'tokens' }
  | { page: 'component'; slug: string }
  | { page: 'not-found' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '') || '/';
  if (path === '/' || path === '') return { page: 'home' };
  if (path === '/tokens') return { page: 'tokens' };
  const m = /^\/components\/([\w-]+)$/.exec(path);
  if (m) return { page: 'component', slug: m[1]! };
  return { page: 'not-found' };
}

export function toHref(route: Route): string {
  switch (route.page) {
    case 'home':
      return '#/';
    case 'tokens':
      return '#/tokens';
    case 'component':
      return `#/components/${route.slug}`;
    case 'not-found':
      return '#/404';
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
