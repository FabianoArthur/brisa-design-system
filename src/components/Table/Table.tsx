import { useMemo, useState, type Key, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { sortRows, type SortDirection } from './sortRows';

export interface Column<T> {
  key: keyof T & string;
  header: ReactNode;
  sortable?: boolean;
  align?: 'start' | 'end';
  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  /** Required: a table needs an accessible name. */
  caption: ReactNode;
  /** Visually hide the caption (it stays available to assistive tech). */
  hideCaption?: boolean;
  columns: Column<T>[];
  rows: readonly T[];
  rowKey: (row: T) => Key;
  emptyMessage?: ReactNode;
  className?: string;
}

export function Table<T>({
  caption,
  hideCaption = false,
  columns,
  rows,
  rowKey,
  emptyMessage = 'No data',
  className,
}: TableProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; direction: SortDirection } | null>(null);

  const sorted = useMemo(
    () => (sort ? sortRows(rows, sort.key, sort.direction) : rows),
    [rows, sort],
  );

  const toggleSort = (key: keyof T) =>
    setSort((s) =>
      s?.key === key && s.direction === 'ascending'
        ? { key, direction: 'descending' }
        : { key, direction: 'ascending' },
    );

  return (
    <div className={cx('br-table-wrap', className)}>
      <table className="br-table">
        <caption className={cx('br-table__caption', hideCaption && 'br-visually-hidden')}>
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active ? sort.direction : undefined}
                  className={cx('br-table__th', col.align === 'end' && 'br-table--end')}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="br-table__sort"
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.header}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        width="14"
                        height="14"
                        className={cx(
                          'br-table__sort-icon',
                          active && `br-table__sort-icon--${sort.direction}`,
                        )}
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path className="br-table__sort-up" d="m5 6 3-3 3 3" />
                          <path className="br-table__sort-down" d="m5 10 3 3 3-3" />
                        </g>
                      </svg>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td className="br-table__empty" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key} className={cx(col.align === 'end' && 'br-table--end')}>
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
