import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { TextField } from './TextField';

describe('TextField', () => {
  it('associates the visible label with the input', () => {
    render(<TextField label="Email" type="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('describes the input with its hint', () => {
    render(<TextField label="Username" hint="3–16 characters" />);
    expect(screen.getByLabelText('Username')).toHaveAccessibleDescription('3–16 characters');
  });

  it('marks errors as invalid and announces them in the description', () => {
    render(<TextField label="Email" hint="Work address" error="Enter a valid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(/Enter a valid email/);
    expect(input).toHaveAccessibleDescription(/Work address/);
  });

  it('exposes required natively', () => {
    render(<TextField label="Name" required />);
    expect(screen.getByRole('textbox', { name: /name/i })).toBeRequired();
  });

  it('accepts typing (uncontrolled)', async () => {
    render(<TextField label="City" />);
    await userEvent.type(screen.getByLabelText('City'), 'Recife');
    expect(screen.getByLabelText('City')).toHaveValue('Recife');
  });

  it('has no axe violations', async () => {
    const { container } = render(<TextField label="Email" hint="h" error="e" required />);
    await expectNoA11yViolations(container);
  });
});
