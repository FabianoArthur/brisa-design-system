import { render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('labels and describes a multi-line field', () => {
    render(<Textarea label="Bio" hint="Markdown supported" rows={4} />);
    const field = screen.getByRole('textbox', { name: 'Bio' });
    expect(field.tagName).toBe('TEXTAREA');
    expect(field).toHaveAccessibleDescription('Markdown supported');
  });

  it('flags errors', () => {
    render(<Textarea label="Bio" error="Too long" />);
    expect(screen.getByLabelText('Bio')).toBeInvalid();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Textarea label="Bio" error="Too long" />);
    await expectNoA11yViolations(container);
  });
});
