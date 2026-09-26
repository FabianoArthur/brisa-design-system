import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { Alert } from './Alert/Alert';
import { Badge } from './Badge/Badge';
import { Card } from './Card/Card';
import { Spinner } from './Spinner/Spinner';

describe('Badge', () => {
  it('renders its tone', () => {
    render(<Badge tone="success">Passing</Badge>);
    expect(screen.getByText('Passing')).toHaveClass('br-badge', 'br-badge--success');
  });
});

describe('Card', () => {
  it('renders an article labelled by its title', () => {
    render(
      <Card title="Usage" description="Last 30 days" footer={<span>Footer</span>}>
        Body
      </Card>,
    );
    const card = screen.getByRole('article', { name: 'Usage' });
    expect(card).toHaveTextContent('Last 30 days');
    expect(card).toHaveTextContent('Body');
    expect(card).toHaveTextContent('Footer');
  });

  it('renders the title at the requested heading level', () => {
    render(<Card title="Usage" headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Usage' })).toBeInTheDocument();
  });
});

describe('Alert', () => {
  it('uses role="alert" for danger and warning, role="status" otherwise', () => {
    const { rerender } = render(<Alert tone="danger" title="Payment failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
    rerender(<Alert tone="info" title="Heads up" />);
    expect(screen.getByRole('status')).toHaveTextContent('Heads up');
  });

  it('can be dismissed', async () => {
    const onDismiss = vi.fn();
    render(
      <Alert tone="success" title="Saved" onDismiss={onDismiss}>
        Your changes are live.
      </Alert>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('Spinner', () => {
  it('announces its label as a status', () => {
    render(<Spinner label="Loading results" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading results');
  });
});

describe('display components', () => {
  it('have no axe violations', async () => {
    const { container } = render(
      <main>
        <Badge>Neutral</Badge>
        <Card title="Card">Body</Card>
        <Alert tone="warning" title="Careful">
          Text
        </Alert>
        <Spinner />
      </main>,
    );
    await expectNoA11yViolations(container);
  });
});
