import { Example } from '../components/Example';
import type { ComponentDoc } from '../docs';

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  return (
    <article className="doc">
      <header className="doc__header">
        <p className="eyebrow">Component</p>
        <h1>{doc.name}</h1>
        <p className="lede">{doc.summary}</p>
      </header>

      <h2>Examples</h2>
      {doc.examples.map((ex) => (
        <Example key={ex.title} example={ex} />
      ))}

      <h2>Props</h2>
      <div className="props-wrap">
        <table className="props">
          <caption className="br-visually-hidden">{doc.name} props</caption>
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {doc.props.map((p) => (
              <tr key={p.name}>
                <td>
                  <code>{p.name}</code>
                </td>
                <td>
                  <code className="props__type">{p.type}</code>
                </td>
                <td>{p.default ? <code>{p.default}</code> : <span aria-label="none">—</span>}</td>
                <td>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Accessibility</h2>
      <ul className="a11y-list">
        {doc.a11y.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}
