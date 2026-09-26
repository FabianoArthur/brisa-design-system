import {
  createContext,
  useContext,
  useId,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  select: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return ctx;
}

const safeId = (value: string) => value.replace(/[^\w-]/g, '_');

export interface TabsProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/** WAI-ARIA Tabs pattern with automatic activation and a roving tabindex. */
export function Tabs({ children, value, defaultValue, onValueChange, className }: TabsProps) {
  const baseId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    if (next !== current) onValueChange?.(next);
  };
  return (
    <TabsContext.Provider value={{ baseId, value: current, select }}>
      <div className={cx('br-tabs', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  'aria-label': string;
}

export function TabList({ className, children, onKeyDown, ...rest }: TabListProps) {
  useTabs('TabList');

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = targets[e.key];
    if (next === undefined) return;
    e.preventDefault();
    tabs[next]!.focus();
    tabs[next]!.click();
  };

  return (
    // The tablist itself is not focusable; its tabs are (roving tabindex).
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      role="tablist"
      className={cx('br-tabs__list', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled, className }: TabProps) {
  const { baseId, value: current, select } = useTabs('Tab');
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${safeId(value)}`}
      aria-controls={`${baseId}-panel-${safeId(value)}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={cx('br-tabs__tab', className)}
      onClick={() => select(value)}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { baseId, value: current } = useTabs('TabPanel');
  if (current !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${safeId(value)}`}
      aria-labelledby={`${baseId}-tab-${safeId(value)}`}
      tabIndex={0}
      className={cx('br-tabs__panel', className)}
    >
      {children}
    </div>
  );
}
