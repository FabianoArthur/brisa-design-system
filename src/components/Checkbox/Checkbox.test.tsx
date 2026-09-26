import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('is a labelled native checkbox that toggles by click and Space', async () => {
    render(<Checkbox label="Subscribe" />);
    const box = screen.getByRole('checkbox', { name: 'Subscribe' });
    await userEvent.click(screen.getByText('Subscribe'));
    expect(box).toBeChecked();
    box.focus();
    await userEvent.keyboard(' ');
    expect(box).not.toBeChecked();
  });

  it('supports the indeterminate state', () => {
    render(<Checkbox label="Select all" indeterminate />);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('links a description', () => {
    render(<Checkbox label="Beta" description="May be unstable" />);
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('May be unstable');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Checkbox label="Beta" description="May be unstable" />);
    await expectNoA11yViolations(container);
  });
});
