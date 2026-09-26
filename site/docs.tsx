import { useState, type ReactNode } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  RadioGroup,
  Select,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  TextField,
  Textarea,
  Tooltip,
  useToast,
  type Column,
} from '../src';

export interface Example {
  title: string;
  code: string;
  render: () => ReactNode;
}

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  summary: string;
  examples: Example[];
  props: PropDoc[];
  a11y: string[];
}

/* ---------- Stateful demos ---------- */

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete “aurora-web”?"
        description="The repository, its deployments and 312 issues will be removed. This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete project
            </Button>
          </>
        }
      >
        <TextField label="Type the project name to confirm" placeholder="aurora-web" />
      </Dialog>
    </>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="demo-row">
      <Button
        onClick={() =>
          toast({
            title: 'Changes saved',
            description: 'Your profile is up to date.',
            tone: 'success',
          })
        }
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'New version available', description: 'Reload to update.' })}
      >
        Info toast
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'The file is larger than 10 MB.',
            tone: 'danger',
          })
        }
      >
        Error toast
      </Button>
    </div>
  );
}

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="demo-stack">
      <Switch label="Email notifications" checked={on} onCheckedChange={setOn} />
      <Switch label="Weekly digest" />
      <Switch label="Beta features (admin only)" disabled />
    </div>
  );
}

function AlertDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="demo-stack">
      <Alert tone="info" title="Scheduled maintenance">
        The API will be read-only on Sunday from 02:00 to 03:00 UTC.
      </Alert>
      <Alert tone="success" title="Deployment finished">
        Build #482 is live.
      </Alert>
      <Alert tone="warning" title="You are close to your quota">
        92% of storage used.
      </Alert>
      {visible ? (
        <Alert tone="danger" title="Payment failed" onDismiss={() => setVisible(false)}>
          Update your card to keep your plan active.
        </Alert>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => setVisible(true)}>
          Show the dismissed alert
        </Button>
      )}
    </div>
  );
}

interface Repo {
  id: number;
  name: string;
  language: string;
  stars: number;
  status: 'passing' | 'failing' | 'pending';
}
const repos: Repo[] = [
  { id: 1, name: 'aurora-web', language: 'TypeScript', stars: 1284, status: 'passing' },
  { id: 2, name: 'tide-api', language: 'Go', stars: 342, status: 'failing' },
  { id: 3, name: 'coral-cli', language: 'Rust', stars: 2051, status: 'passing' },
  { id: 4, name: 'reef-docs', language: 'MDX', stars: 97, status: 'pending' },
];
const statusTone = { passing: 'success', failing: 'danger', pending: 'warning' } as const;
const repoColumns: Column<Repo>[] = [
  { key: 'name', header: 'Repository', sortable: true },
  { key: 'language', header: 'Language', sortable: true },
  {
    key: 'status',
    header: 'CI',
    render: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge>,
  },
  {
    key: 'stars',
    header: 'Stars',
    sortable: true,
    align: 'end',
    render: (r) => r.stars.toLocaleString('en'),
  },
];

/* ---------- Docs ---------- */

export const docs: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    summary:
      'Triggers an action. Four variants, three sizes, and a loading state that keeps focus.',
    examples: [
      {
        title: 'Variants',
        code: `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
        render: () => (
          <div className="demo-row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        ),
      },
      {
        title: 'Sizes and states',
        code: `<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button loading>Saving</Button>
<Button disabled>Disabled</Button>`,
        render: () => (
          <div className="demo-row">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
          </div>
        ),
      },
    ],
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        default: "'primary'",
        description: 'Visual emphasis.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height and padding.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Shows a spinner, sets aria-busy and ignores clicks without losing focus.',
      },
      { name: 'icon', type: 'ReactNode', description: 'Decorative icon before the label.' },
      {
        name: 'fullWidth',
        type: 'boolean',
        default: 'false',
        description: 'Stretch to the container width.',
      },
      {
        name: '…rest',
        type: 'ButtonHTMLAttributes',
        description: 'Any native button attribute. type defaults to "button".',
      },
    ],
    a11y: [
      'Always a native <button>, so Enter and Space work and it is announced as a button.',
      'Defaults to type="button" so it never submits a form by accident.',
      'Loading uses aria-disabled instead of disabled, so keyboard focus stays on the button.',
    ],
  },
  {
    slug: 'text-field',
    name: 'TextField',
    summary: 'Single-line input with a visible label, optional hint and error message.',
    examples: [
      {
        title: 'Label, hint and error',
        code: `<TextField label="Full name" autoComplete="name" required />
<TextField label="Username" hint="3–16 characters, letters and numbers." />
<TextField label="Email" type="email" defaultValue="ana@" error="Enter a valid email address." />`,
        render: () => (
          <div className="demo-grid">
            <TextField label="Full name" autoComplete="name" required />
            <TextField label="Username" hint="3–16 characters, letters and numbers." />
            <TextField
              label="Email"
              type="email"
              defaultValue="ana@"
              error="Enter a valid email address."
            />
            <TextField label="Company" disabled defaultValue="Acme Inc." />
          </div>
        ),
      },
    ],
    props: [
      {
        name: 'label',
        type: 'ReactNode',
        description: 'Visible label, always rendered (no placeholder-as-label).',
      },
      { name: 'hint', type: 'ReactNode', description: 'Help text linked with aria-describedby.' },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Error message; sets aria-invalid and is announced with the field.',
      },
      { name: '…rest', type: 'InputHTMLAttributes', description: 'Any native input attribute.' },
    ],
    a11y: [
      'The label is a real <label for>, so clicking it focuses the input.',
      'Hint and error are both referenced by aria-describedby; the error is not colour-only (icon + text).',
      'required is native, so the browser and screen readers both know about it.',
    ],
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    summary: 'Multi-line text with the same label/hint/error contract as TextField.',
    examples: [
      {
        title: 'Basic',
        code: `<Textarea label="Release notes" hint="Markdown is supported." rows={4} />`,
        render: () => <Textarea label="Release notes" hint="Markdown is supported." rows={4} />,
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', description: 'Visible label.' },
      { name: 'hint / error', type: 'ReactNode', description: 'Same behaviour as TextField.' },
      {
        name: 'rows',
        type: 'number',
        default: '4',
        description: 'Initial height; the user can resize vertically.',
      },
    ],
    a11y: [
      'Shares the Field layout with TextField and Select, so every form control is wired the same way.',
    ],
  },
  {
    slug: 'select',
    name: 'Select',
    summary:
      'A styled native <select>. Keyboard, screen readers and mobile pickers come from the platform.',
    examples: [
      {
        title: 'With placeholder',
        code: `<Select
  label="Region"
  placeholder="Choose a region"
  defaultValue=""
  options={[
    { value: 'sa-east', label: 'South America (São Paulo)' },
    { value: 'us-east', label: 'US East (Virginia)' },
    { value: 'eu-west', label: 'Europe (Ireland)' },
    { value: 'ap-south', label: 'Asia Pacific (Mumbai)', disabled: true },
  ]}
/>`,
        render: () => (
          <div className="demo-grid">
            <Select
              label="Region"
              placeholder="Choose a region"
              defaultValue=""
              hint="Pick the one closest to your users."
              options={[
                { value: 'sa-east', label: 'South America (São Paulo)' },
                { value: 'us-east', label: 'US East (Virginia)' },
                { value: 'eu-west', label: 'Europe (Ireland)' },
                { value: 'ap-south', label: 'Asia Pacific (Mumbai)', disabled: true },
              ]}
            />
            <Select
              label="Plan"
              error="Choose a plan to continue."
              options={[
                { value: 'free', label: 'Free' },
                { value: 'pro', label: 'Pro' },
              ]}
            />
          </div>
        ),
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', description: 'Visible label.' },
      {
        name: 'options',
        type: 'SelectOption[]',
        description: '{ value, label, disabled? } items.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Disabled first option; pair with defaultValue="".',
      },
      { name: 'hint / error', type: 'ReactNode', description: 'Same behaviour as TextField.' },
    ],
    a11y: ['Native select: type-ahead, arrow keys and the OS picker on mobile all work for free.'],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    summary:
      'Native checkbox with a custom visual, an optional description and an indeterminate state.',
    examples: [
      {
        title: 'States',
        code: `<Checkbox label="Accept the terms" />
<Checkbox label="Send me product updates" description="About one email a month." defaultChecked />
<Checkbox label="Select all" indeterminate />`,
        render: () => (
          <div className="demo-stack">
            <Checkbox label="Accept the terms" />
            <Checkbox
              label="Send me product updates"
              description="About one email a month."
              defaultChecked
            />
            <Checkbox label="Select all" indeterminate />
            <Checkbox label="Unavailable option" disabled />
          </div>
        ),
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', description: 'Visible label.' },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Secondary text linked with aria-describedby.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Mixed state (announced as "partially checked").',
      },
    ],
    a11y: [
      'The real input stays in the DOM on top of the visual, so hit area, Space and screen readers are native.',
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    summary: 'An on/off control that takes effect immediately.',
    examples: [
      {
        title: 'Controlled and uncontrolled',
        code: `const [on, setOn] = useState(true);

<Switch label="Email notifications" checked={on} onCheckedChange={setOn} />
<Switch label="Weekly digest" />`,
        render: () => <SwitchDemo />,
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', description: 'Visible label.' },
      {
        name: 'checked / defaultChecked',
        type: 'boolean',
        description: 'Controlled or uncontrolled state.',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        description: 'Called with the next state.',
      },
    ],
    a11y: [
      'role="switch" with aria-checked, on a <button>, so Space and Enter toggle it.',
      'Use a Checkbox instead when the value is only applied when a form is submitted.',
    ],
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    summary: 'Pick exactly one option, with optional descriptions.',
    examples: [
      {
        title: 'Shipping options',
        code: `<RadioGroup
  legend="Shipping"
  name="shipping"
  defaultValue="standard"
  options={[
    { value: 'standard', label: 'Standard', description: '3–5 business days · free' },
    { value: 'express', label: 'Express', description: 'Next business day · $12' },
    { value: 'pickup', label: 'Store pickup', disabled: true },
  ]}
/>`,
        render: () => (
          <RadioGroup
            legend="Shipping"
            name="shipping"
            defaultValue="standard"
            options={[
              { value: 'standard', label: 'Standard', description: '3–5 business days · free' },
              { value: 'express', label: 'Express', description: 'Next business day · $12' },
              {
                value: 'pickup',
                label: 'Store pickup',
                description: 'Temporarily unavailable',
                disabled: true,
              },
            ]}
          />
        ),
      },
    ],
    props: [
      { name: 'legend', type: 'ReactNode', description: 'Group label (a real <legend>).' },
      { name: 'name', type: 'string', description: 'Shared input name.' },
      {
        name: 'options',
        type: 'RadioOption[]',
        description: '{ value, label, description?, disabled? }.',
      },
      {
        name: 'value / defaultValue / onValueChange',
        type: 'string',
        description: 'Controlled or uncontrolled selection.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Layout.',
      },
    ],
    a11y: [
      'Native radios in a <fieldset>: one tab stop per group and arrow keys move the selection.',
    ],
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    summary: 'A modal built on the native <dialog> element.',
    examples: [
      {
        title: 'Confirmation',
        code: `const [open, setOpen] = useState(false);

<Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete “aurora-web”?"
  description="This cannot be undone."
  footer={<Button variant="danger">Delete project</Button>}
/>`,
        render: () => <DialogDemo />,
      },
    ],
    props: [
      { name: 'open', type: 'boolean', description: 'Whether the dialog is shown.' },
      {
        name: 'onClose',
        type: '() => void',
        description: 'Called on Esc, the close button and backdrop clicks.',
      },
      { name: 'title', type: 'ReactNode', description: 'Accessible name (aria-labelledby).' },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Accessible description (aria-describedby).',
      },
      { name: 'footer', type: 'ReactNode', description: 'Actions, right-aligned.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Max width.' },
      {
        name: 'closeOnBackdrop',
        type: 'boolean',
        default: 'true',
        description: 'Close when the backdrop is clicked.',
      },
    ],
    a11y: [
      'showModal() puts the dialog in the top layer and makes the page behind it inert: focus cannot escape.',
      'Esc closes it; focus moves into the dialog on open and returns to the opener on close.',
    ],
  },
  {
    slug: 'toast',
    name: 'Toast',
    summary: 'Brief, non-blocking notifications from anywhere in the tree.',
    examples: [
      {
        title: 'Tones',
        code: `// Wrap the app once
<ToastProvider>
  <App />
</ToastProvider>

// Anywhere below it
const { toast } = useToast();
toast({ title: 'Changes saved', description: 'Your profile is up to date.', tone: 'success' });`,
        render: () => <ToastDemo />,
      },
    ],
    props: [
      {
        name: 'toast(options)',
        type: '{ title, description?, tone?, duration? }',
        description: 'Shows a toast and returns its id.',
      },
      { name: 'dismiss(id)', type: '(id: string) => void', description: 'Removes a toast early.' },
      {
        name: 'ToastProvider duration',
        type: 'number',
        default: '5000',
        description: 'Default auto-dismiss time in ms (0 = sticky).',
      },
      {
        name: 'ToastProvider max',
        type: 'number',
        default: '5',
        description: 'Oldest toast is dropped past this.',
      },
    ],
    a11y: [
      'A polite live region exists before the first toast, so additions are announced.',
      'Danger toasts use role="alert". Hovering or focusing a toast pauses its timer (WCAG 2.2.1).',
    ],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    summary: 'Switch between related panels without leaving the page.',
    examples: [
      {
        title: 'Project tabs',
        code: `<Tabs defaultValue="overview">
  <TabList aria-label="Project">
    <Tab value="overview">Overview</Tab>
    <Tab value="activity">Activity</Tab>
    <Tab value="billing" disabled>Billing</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
  <TabPanel value="settings">…</TabPanel>
</Tabs>`,
        render: () => (
          <Tabs defaultValue="overview">
            <TabList aria-label="Project">
              <Tab value="overview">Overview</Tab>
              <Tab value="activity">Activity</Tab>
              <Tab value="billing" disabled>
                Billing
              </Tab>
              <Tab value="settings">Settings</Tab>
            </TabList>
            <TabPanel value="overview">
              4 services, 2 environments, last deploy 12 minutes ago.
            </TabPanel>
            <TabPanel value="activity">
              Ana merged #214 · Leo opened #215 · CI passed on main.
            </TabPanel>
            <TabPanel value="billing">Billing panel</TabPanel>
            <TabPanel value="settings">
              <Switch label="Require review before merge" defaultChecked />
            </TabPanel>
          </Tabs>
        ),
      },
    ],
    props: [
      {
        name: 'Tabs value / defaultValue / onValueChange',
        type: 'string',
        description: 'Controlled or uncontrolled selection. Defaults to the first enabled tab.',
      },
      {
        name: 'TabList aria-label',
        type: 'string',
        description: 'Required name for the tab list.',
      },
      {
        name: 'Tab value / disabled',
        type: 'string / boolean',
        description: 'Identifies the tab; disabled tabs are skipped.',
      },
      { name: 'TabPanel value', type: 'string', description: 'Shown when its tab is selected.' },
    ],
    a11y: [
      'WAI-ARIA tabs pattern: roving tabindex, ←/→ move and activate, Home/End jump, disabled tabs are skipped.',
      'Each panel is labelled by its tab and is focusable, so Tab from the list lands in the content.',
    ],
  },
  {
    slug: 'card',
    name: 'Card',
    summary: 'Groups related content with an optional header and footer.',
    examples: [
      {
        title: 'With footer',
        code: `<Card
  title="Monthly usage"
  description="1–30 September"
  footer={<Button size="sm" variant="secondary">View report</Button>}
>
  …
</Card>`,
        render: () => (
          <div className="demo-grid">
            <Card
              title="Monthly usage"
              description="1–30 September"
              footer={
                <Button size="sm" variant="secondary">
                  View report
                </Button>
              }
            >
              <p className="demo-metric">
                8.4k <span>requests / day</span>
              </p>
            </Card>
            <Card title="Team" description="3 members · 1 pending invite">
              <div className="demo-row">
                <Badge tone="accent">Owner</Badge>
                <Badge>Editor</Badge>
                <Badge tone="warning">Invited</Badge>
              </div>
            </Card>
          </div>
        ),
      },
    ],
    props: [
      { name: 'title', type: 'ReactNode', description: 'Heading; also names the <article>.' },
      { name: 'description', type: 'ReactNode', description: 'Muted text under the title.' },
      { name: 'footer', type: 'ReactNode', description: 'Actions area.' },
      {
        name: 'headingLevel',
        type: '2 | 3 | 4',
        default: '3',
        description: 'Keep the page outline correct.',
      },
      { name: 'padding', type: "'md' | 'lg'", default: "'md'", description: 'Inner spacing.' },
    ],
    a11y: [
      'Rendered as <article> labelled by its title, so it shows up in a screen reader’s landmarks/headings list.',
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    summary: 'Tabular data with sortable columns and custom cells.',
    examples: [
      {
        title: 'Sortable',
        code: `const columns: Column<Repo>[] = [
  { key: 'name', header: 'Repository', sortable: true },
  { key: 'language', header: 'Language', sortable: true },
  { key: 'status', header: 'CI', render: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
  { key: 'stars', header: 'Stars', sortable: true, align: 'end' },
];

<Table caption="Repositories" columns={columns} rows={repos} rowKey={(r) => r.id} />`,
        render: () => (
          <Table caption="Repositories" columns={repoColumns} rows={repos} rowKey={(r) => r.id} />
        ),
      },
    ],
    props: [
      {
        name: 'caption',
        type: 'ReactNode',
        description: 'Required accessible name (hide visually with hideCaption).',
      },
      {
        name: 'columns',
        type: 'Column<T>[]',
        description: '{ key, header, sortable?, align?, render? }.',
      },
      { name: 'rows', type: 'T[]', description: 'Data.' },
      { name: 'rowKey', type: '(row: T) => Key', description: 'Stable key per row.' },
      {
        name: 'emptyMessage',
        type: 'ReactNode',
        default: "'No data'",
        description: 'Shown when rows is empty.',
      },
    ],
    a11y: [
      'Real <table> with <caption> and scope="col" headers.',
      'Sortable headers are buttons; the active column exposes aria-sort. Empty values always sort last.',
    ],
  },
  {
    slug: 'badge',
    name: 'Badge',
    summary: 'Small status or category label.',
    examples: [
      {
        title: 'Tones',
        code: `<Badge>Draft</Badge>
<Badge tone="accent">New</Badge>
<Badge tone="success">Passing</Badge>
<Badge tone="warning">Pending</Badge>
<Badge tone="danger">Failing</Badge>
<Badge tone="info">Beta</Badge>`,
        render: () => (
          <div className="demo-row">
            <Badge>Draft</Badge>
            <Badge tone="accent">New</Badge>
            <Badge tone="success">Passing</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Failing</Badge>
            <Badge tone="info">Beta</Badge>
          </div>
        ),
      },
    ],
    props: [
      {
        name: 'tone',
        type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'",
        default: "'neutral'",
        description: 'Colour.',
      },
    ],
    a11y: [
      'The meaning must be in the text, not only the colour. Every tone passes 4.5:1 in both themes.',
    ],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    summary: 'Short supplementary text on hover or keyboard focus.',
    examples: [
      {
        title: 'Icon buttons',
        code: `<Tooltip content="Copy link">
  <Button variant="secondary" aria-label="Copy link" icon={<LinkIcon />} />
</Tooltip>`,
        render: () => (
          <div className="demo-row">
            <Tooltip content="Copy link">
              <Button variant="secondary" aria-label="Copy link" icon={<LinkIcon />} />
            </Tooltip>
            <Tooltip content="Opens in a new tab" placement="bottom">
              <Button variant="ghost">Documentation</Button>
            </Tooltip>
          </div>
        ),
      },
    ],
    props: [
      { name: 'content', type: 'ReactNode', description: 'Tooltip text.' },
      { name: 'children', type: 'ReactElement', description: 'One focusable trigger.' },
      { name: 'placement', type: "'top' | 'bottom'", default: "'top'", description: 'Position.' },
      {
        name: 'delay',
        type: 'number',
        default: '300',
        description: 'Hover delay in ms; focus shows immediately.',
      },
    ],
    a11y: [
      'Shown on focus as well as hover; linked with aria-describedby.',
      'Esc hides it without moving focus (WCAG 1.4.13). Never put essential information only in a tooltip.',
    ],
  },
  {
    slug: 'alert',
    name: 'Alert',
    summary: 'Inline message about the state of the page or a task.',
    examples: [
      {
        title: 'Tones',
        code: `<Alert tone="info" title="Scheduled maintenance">…</Alert>
<Alert tone="success" title="Deployment finished">…</Alert>
<Alert tone="warning" title="You are close to your quota">…</Alert>
<Alert tone="danger" title="Payment failed" onDismiss={hide}>…</Alert>`,
        render: () => <AlertDemo />,
      },
    ],
    props: [
      {
        name: 'tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        default: "'info'",
        description: 'Colour, icon and urgency.',
      },
      { name: 'title', type: 'ReactNode', description: 'Short summary.' },
      { name: 'onDismiss', type: '() => void', description: 'Shows a dismiss button when set.' },
    ],
    a11y: [
      'Danger and warning use role="alert" (announced at once); info and success use role="status" (polite).',
    ],
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    summary: 'Indeterminate progress for short waits.',
    examples: [
      {
        title: 'Sizes',
        code: `<Spinner size="sm" />
<Spinner />
<Spinner size="lg" label="Loading repositories" />`,
        render: () => (
          <div className="demo-row">
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" label="Loading repositories" />
          </div>
        ),
      },
    ],
    props: [
      {
        name: 'label',
        type: 'string',
        default: "'Loading'",
        description: 'Announced text (visually hidden).',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter.' },
    ],
    a11y: [
      'role="status" with a visually hidden label. With reduced motion the rotation slows down instead of stopping, so it still reads as busy.',
    ],
  },
];

export function LinkIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M6.5 9.5a3 3 0 0 0 4.24 0l2.12-2.12a3 3 0 0 0-4.24-4.24l-.7.7" />
      <path d="M9.5 6.5a3 3 0 0 0-4.24 0L3.14 8.62a3 3 0 0 0 4.24 4.24l.7-.7" />
    </svg>
  );
}
