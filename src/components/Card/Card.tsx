import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** Heading level for the title; pick what fits the page outline. */
  headingLevel?: 2 | 3 | 4;
  padding?: 'md' | 'lg';
}

export function Card({
  title,
  description,
  footer,
  headingLevel = 3,
  padding = 'md',
  className,
  children,
  ...rest
}: CardProps) {
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <article
      className={cx('br-card', `br-card--pad-${padding}`, className)}
      aria-labelledby={title ? id : undefined}
      {...rest}
    >
      {(title || description) && (
        <header className="br-card__header">
          {title && (
            <Heading id={id} className="br-card__title">
              {title}
            </Heading>
          )}
          {description && <p className="br-card__description">{description}</p>}
        </header>
      )}
      {children && <div className="br-card__body">{children}</div>}
      {footer && <footer className="br-card__footer">{footer}</footer>}
    </article>
  );
}
