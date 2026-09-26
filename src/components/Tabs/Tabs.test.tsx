import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../test/a11y';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

function Example({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue="overview" onValueChange={onValueChange}>
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="billing" disabled>
          Billing
        </Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel</TabPanel>
      <TabPanel value="activity">Activity panel</TabPanel>
      <TabPanel value="billing">Billing panel</TabPanel>
      <TabPanel value="settings">Settings panel</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('wires tabs to panels with ARIA', () => {
    render(<Example />);
    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(screen.getByRole('tablist', { name: 'Project' })).toBeInTheDocument();
    expect(tab).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: 'Overview' });
    expect(panel).toHaveTextContent('Overview panel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
  });

  it('uses a roving tabindex: only the selected tab is in the tab order', () => {
    render(<Example />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1']);
  });

  it('moves with arrow keys, skipping disabled tabs and wrapping', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings panel');
    expect(onValueChange).toHaveBeenLastCalledWith('settings');
  });

  it('supports Home and End', async () => {
    render(<Example />);
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('activates on click', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('falls back to the first enabled tab when no value is given', () => {
    render(
      <Tabs>
        <TabList aria-label="Fallback">
          <Tab value="a" disabled>
            A
          </Tab>
          <Tab value="b">B</Tab>
          <Tab value="c">C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('keeps ids valid for values with spaces', () => {
    render(
      <Tabs defaultValue="two words">
        <TabList aria-label="Spaces">
          <Tab value="two words">Two words</Tab>
        </TabList>
        <TabPanel value="two words">Panel</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel', { name: 'Two words' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });
});
