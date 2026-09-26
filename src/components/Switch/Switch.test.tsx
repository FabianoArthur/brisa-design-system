import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Switch } from './Switch';

describe('Switch', () => {
  it('exposes role="switch" with aria-checked and toggles uncontrolled', async () => {
    render(<Switch label="Wi-Fi" />);
    const sw = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles with Space and Enter', async () => {
    render(<Switch label="Wi-Fi" />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Enter}');
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [on, setOn] = useState(true);
      return (
        <>
          <Switch label="Sync" checked={on} onCheckedChange={setOn} />
          <output>{String(on)}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('does nothing when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Off" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('calls a consumer onClick without losing the toggle', async () => {
    const onClick = vi.fn();
    render(<Switch label="Wi-Fi" onClick={onClick} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Switch label="Wi-Fi" defaultChecked />);
    await expectNoA11yViolations(container);
  });
});
