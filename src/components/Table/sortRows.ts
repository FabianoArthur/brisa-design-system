export type SortDirection = 'ascending' | 'descending';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

/** Returns a sorted copy. Empty values always sort last, whatever the direction. */
export function sortRows<T>(rows: readonly T[], key: keyof T, direction: SortDirection): T[] {
  const sign = direction === 'ascending' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (isEmpty(x) || isEmpty(y)) return Number(isEmpty(x)) - Number(isEmpty(y));
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign;
    return collator.compare(String(x), String(y)) * sign;
  });
}
