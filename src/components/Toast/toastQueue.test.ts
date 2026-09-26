import { toastReducer, type ToastItem } from './toastQueue';

const item = (id: string): ToastItem => ({ id, title: id, tone: 'info', duration: 5000 });

describe('toastReducer', () => {
  it('appends new toasts', () => {
    const s = toastReducer([item('a')], { type: 'add', toast: item('b'), max: 5 });
    expect(s.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('drops the oldest toast when over the cap', () => {
    const start = ['a', 'b', 'c'].map(item);
    const s = toastReducer(start, { type: 'add', toast: item('d'), max: 3 });
    expect(s.map((t) => t.id)).toEqual(['b', 'c', 'd']);
  });

  it('removes by id and ignores unknown ids', () => {
    const start = ['a', 'b'].map(item);
    expect(toastReducer(start, { type: 'remove', id: 'a' }).map((t) => t.id)).toEqual(['b']);
    expect(toastReducer(start, { type: 'remove', id: 'zzz' })).toBe(start);
  });
});
