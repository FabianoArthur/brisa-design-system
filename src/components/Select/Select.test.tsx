import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Select } from './Select';

const options = [
  { value: 'br', label: 'Brazil' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ao', label: 'Angola', disabled: true },
];

describe('Select', () => {
  it('renders a labelled native combobox with its options', () => {
    render(<Select label="Country" options={options} />);
    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Angola' })).toBeDisabled();
  });

  it('renders a placeholder option that cannot be re-selected', () => {
    render(<Select label="Country" options={options} placeholder="Choose…" defaultValue="" />);
    expect(screen.getByRole('option', { name: 'Choose…' })).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('reports changes', async () => {
    const onChange = vi.fn();
    render(<Select label="Country" options={options} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'pt');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveValue('pt');
  });

  it('marks errors as invalid', () => {
    render(<Select label="Country" options={options} error="Required" />);
    expect(screen.getByRole('combobox')).toBeInvalid();
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Required');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Select label="Country" options={options} hint="Shipping" />);
    await expectNoA11yViolations(container);
  });
});
