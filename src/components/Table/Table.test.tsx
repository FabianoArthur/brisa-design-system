import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Table, type Column } from './Table';

interface Row {
  id: number;
  name: string;
  stars: number;
}
const rows: Row[] = [
  { id: 1, name: 'beta', stars: 10 },
  { id: 2, name: 'alpha', stars: 300 },
  { id: 3, name: 'gamma', stars: 42 },
];
const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'stars', header: 'Stars', sortable: true, align: 'end' },
];

const bodyNames = () =>
  within(screen.getAllByRole('rowgroup')[1]!)
    .getAllByRole('row')
    .map((r) => within(r).getAllByRole('cell')[0]!.textContent);

describe('Table', () => {
  it('renders a captioned table with column headers', () => {
    render(<Table caption="Repositories" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(screen.getByRole('table', { name: 'Repositories' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(bodyNames()).toEqual(['beta', 'alpha', 'gamma']);
  });

  it('sorts by a column and exposes aria-sort', async () => {
    render(<Table caption="Repositories" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    await userEvent.click(screen.getByRole('button', { name: /Stars/ }));
    expect(screen.getByRole('columnheader', { name: /Stars/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    expect(bodyNames()).toEqual(['beta', 'gamma', 'alpha']);
    await userEvent.click(screen.getByRole('button', { name: /Stars/ }));
    expect(screen.getByRole('columnheader', { name: /Stars/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(bodyNames()).toEqual(['alpha', 'gamma', 'beta']);
    expect(screen.getByRole('columnheader', { name: /Name/ })).not.toHaveAttribute('aria-sort');
  });

  it('uses custom cell renderers', () => {
    render(
      <Table
        caption="Repos"
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (r: Row) => <strong>{r.name.toUpperCase()}</strong>,
          },
        ]}
        rows={rows}
        rowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText('BETA').tagName).toBe('STRONG');
  });

  it('shows an empty state', () => {
    render(
      <Table
        caption="Repos"
        columns={columns}
        rows={[]}
        rowKey={(r) => r.id}
        emptyMessage="No repositories yet"
      />,
    );
    expect(screen.getByText('No repositories yet')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Table caption="Repositories" columns={columns} rows={rows} rowKey={(r) => r.id} />,
    );
    await expectNoA11yViolations(container);
  });
});
