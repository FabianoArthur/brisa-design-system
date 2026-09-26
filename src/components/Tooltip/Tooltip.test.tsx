import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  afterEach(() => vi.useRealTimers());

  it('shows on keyboard focus and describes the trigger', async () => {
    render(
      <Tooltip content="Copy to clipboard">
        <button>Copy</button>
      </Tooltip>,
    );
    await userEvent.tab();
    const trigger = screen.getByRole('button', { name: 'Copy' });
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy to clipboard');
    expect(trigger).toHaveAccessibleDescription('Copy to clipboard');
  });

  it('hides on blur', async () => {
    render(
      <>
        <Tooltip content="Tip">
          <button>A</button>
        </Tooltip>
        <button>B</button>
      </>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on hover after a short delay and hides on leave', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" delay={300}>
        <button>A</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(350));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.unhover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('is dismissible with Escape without moving focus (WCAG 1.4.13)', async () => {
    render(
      <Tooltip content="Tip">
        <button>A</button>
      </Tooltip>,
    );
    await userEvent.tab();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('keeps the child’s own handlers working', async () => {
    const onFocus = vi.fn();
    render(
      <Tooltip content="Tip">
        <button onFocus={onFocus}>A</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(onFocus).toHaveBeenCalled();
  });

  it('has no axe violations while visible', async () => {
    const { container } = render(
      <Tooltip content="Tip">
        <button>A</button>
      </Tooltip>,
    );
    await userEvent.tab();
    await expectNoA11yViolations(container);
  });
});
