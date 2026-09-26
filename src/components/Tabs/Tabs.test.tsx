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

  it('has no axe violations', async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });
});
