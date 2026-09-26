import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { RadioGroup } from './RadioGroup';

const options = [
  { value: 'std', label: 'Standard', description: '3–5 days' },
  { value: 'exp', label: 'Express', description: 'Next day' },
  { value: 'drone', label: 'Drone', disabled: true },
];

describe('RadioGroup', () => {
  it('groups native radios under a legend', () => {
    render(<RadioGroup legend="Shipping" name="ship" options={options} />);
    expect(screen.getByRole('group', { name: 'Shipping' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Drone' })).toBeDisabled();
  });

  it('selects by click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        legend="Shipping"
        name="ship"
        options={options}
        defaultValue="std"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Express' }));
    expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('exp');
  });

  it('describes each option', () => {
    render(<RadioGroup legend="Shipping" name="ship" options={options} />);
    expect(screen.getByRole('radio', { name: 'Express' })).toHaveAccessibleDescription('Next day');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <RadioGroup legend="Shipping" name="ship" options={options} defaultValue="std" />,
    );
    await expectNoA11yViolations(container);
  });
});
