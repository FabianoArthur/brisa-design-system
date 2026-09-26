import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Button } from './Button';

describe('Button', () => {
  it('is a real <button> that defaults to type="button" (never submits by accident)', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass(
      'br-button',
      'br-button--danger',
      'br-button--lg',
    );
  });

  it('fires onClick and is keyboard-activatable', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('while loading: keeps its name, is busy and does not fire clicks', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const btn = screen.getByRole('button', { name: /save/i });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards refs', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button loading>Loading</Button>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});

describe('Button (icon-only)', () => {
  it('renders square and takes its name from aria-label', () => {
    render(<Button aria-label="Close" icon={<svg />} />);
    const btn = screen.getByRole('button', { name: 'Close' });
    expect(btn).toHaveClass('br-button--icon-only');
    expect(btn.querySelector('.br-button__label')).toBeNull();
  });
});
