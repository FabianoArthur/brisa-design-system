import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { ToastProvider, useToast } from './Toast';

function Trigger({
  tone = 'success' as const,
  duration,
}: {
  tone?: 'success' | 'danger';
  duration?: number;
}) {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Saved', description: 'All good', tone, duration })}>
      Notify
    </button>
  );
}

describe('Toast', () => {
  afterEach(() => vi.useRealTimers());

  it('renders a labelled live region before any toast arrives', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('shows a toast and removes it after its duration', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ToastProvider>
        <Trigger duration={3000} />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3100));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('pauses auto-dismiss while hovered', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ToastProvider>
        <Trigger duration={3000} />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await user.hover(screen.getByText('Saved'));
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    await user.unhover(screen.getByText('Saved'));
    act(() => vi.advanceTimersByTime(3100));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('can be dismissed manually', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('uses role="alert" for danger toasts', async () => {
    render(
      <ToastProvider>
        <Trigger tone="danger" />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Saved');
  });

  it('throws outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
  });

  it('has no axe violations with a toast showing', async () => {
    const { container } = render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    await expectNoA11yViolations(container);
  });
});
