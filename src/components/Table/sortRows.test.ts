import { sortRows } from './sortRows';

const rows = [
  { name: 'beta', size: 10, updated: '2026-01-03' },
  { name: 'Alpha', size: 2, updated: '2026-03-01' },
  { name: 'gamma', size: 33, updated: null },
];

describe('sortRows', () => {
  it('sorts strings case-insensitively with locale rules', () => {
    expect(sortRows(rows, 'name', 'ascending').map((r) => r.name)).toEqual([
      'Alpha',
      'beta',
      'gamma',
    ]);
  });

  it('sorts numbers numerically, not lexically', () => {
    expect(sortRows(rows, 'size', 'descending').map((r) => r.size)).toEqual([33, 10, 2]);
  });

  it('keeps empty values last in both directions', () => {
    expect(sortRows(rows, 'updated', 'ascending').map((r) => r.updated)).toEqual([
      '2026-01-03',
      '2026-03-01',
      null,
    ]);
    expect(sortRows(rows, 'updated', 'descending').map((r) => r.updated)).toEqual([
      '2026-03-01',
      '2026-01-03',
      null,
    ]);
  });

  it('does not mutate the input', () => {
    const copy = [...rows];
    sortRows(rows, 'size', 'ascending');
    expect(rows).toEqual(copy);
  });
});
