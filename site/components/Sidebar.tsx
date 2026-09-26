import { docs } from '../docs';
import { toHref, type Route } from '../router';

export function Sidebar({ route }: { route: Route }) {
  const current = (r: Route) =>
    JSON.stringify(r) === JSON.stringify(route) ? ('page' as const) : undefined;

  const nav = (
    <>
      <p className="nav__heading">Foundations</p>
      <ul className="nav__list">
        <li>
          <a href={toHref({ page: 'home' })} aria-current={current({ page: 'home' })}>
            Introduction
          </a>
        </li>
        <li>
          <a href={toHref({ page: 'tokens' })} aria-current={current({ page: 'tokens' })}>
            Tokens
          </a>
        </li>
      </ul>
      <p className="nav__heading">Components</p>
      <ul className="nav__list">
        {docs.map((d) => {
          const r: Route = { page: 'component', slug: d.slug };
          return (
            <li key={d.slug}>
              <a href={toHref(r)} aria-current={current(r)}>
                {d.name}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <>
      <nav className="sidebar" aria-label="Documentation">
        {nav}
      </nav>
      <details className="mobile-nav">
        <summary>Menu</summary>
        <nav aria-label="Documentation (mobile)">{nav}</nav>
      </details>
    </>
  );
}
