import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cx('br-badge', `br-badge--${tone}`, className)} {...rest} />;
}
