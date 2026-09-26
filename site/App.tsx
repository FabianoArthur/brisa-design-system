import { useEffect, useRef } from 'react';
import { docs } from './docs';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ComponentPage } from './pages/ComponentPage';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { TokensPage } from './pages/TokensPage';
import { useRoute } from './router';

export function App() {
  const route = useRoute();
  const main = useRef<HTMLElement>(null);
  const doc = route.page === 'component' ? docs.find((d) => d.slug === route.slug) : undefined;

  const title =
    route.page === 'home'
      ? 'Brisa design system'
      : route.page === 'tokens'
        ? 'Tokens · Brisa'
        : doc
          ? `${doc.name} · Brisa`
          : 'Not found · Brisa';

  // On navigation: update the title, scroll to top and move focus to the
  // content so screen reader and keyboard users land on the new page.
  const firstRender = useRef(true);
  useEffect(() => {
    document.title = title;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [title]);

  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <Header />
      <div className="layout">
        <Sidebar route={route} />
        <main id="content" ref={main} tabIndex={-1} className="content">
          {route.page === 'home' && <Home />}
          {route.page === 'tokens' && <TokensPage />}
          {route.page === 'component' && (doc ? <ComponentPage doc={doc} /> : <NotFound />)}
          {route.page === 'not-found' && <NotFound />}
        </main>
      </div>
    </>
  );
}
