import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Select,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  useToast,
} from '../../src';
import { docs } from '../docs';

const install = `import { Button, ThemeProvider } from 'brisa-ui';
import 'brisa-ui/styles.css';

export function App() {
  return (
    <ThemeProvider>
      <Button onClick={() => alert('Hello!')}>Say hello</Button>
    </ThemeProvider>
  );
}`;

function Showcase() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Settings saved',
        description: 'Deploys now require a review.',
        tone: 'success',
      });
    }, 900);
  };
  return (
    <div
      className="showcase"
      aria-label="Live example: a settings panel built with Brisa"
      role="group"
    >
      <Card
        title="Project settings"
        description="aurora-web · production"
        headingLevel={2}
        footer={
          <>
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={save}>
              Save changes
            </Button>
          </>
        }
      >
        <Tabs defaultValue="general">
          <TabList aria-label="Settings sections">
            <Tab value="general">General</Tab>
            <Tab value="deploys">Deploys</Tab>
            <Tab value="danger">Danger zone</Tab>
          </TabList>
          <TabPanel value="general">
            <div className="showcase__form">
              <TextField label="Project name" defaultValue="aurora-web" />
              <Select
                label="Region"
                defaultValue="sa-east"
                options={[
                  { value: 'sa-east', label: 'South America (São Paulo)' },
                  { value: 'us-east', label: 'US East (Virginia)' },
                  { value: 'eu-west', label: 'Europe (Ireland)' },
                ]}
              />
            </div>
          </TabPanel>
          <TabPanel value="deploys">
            <div className="showcase__form">
              <Switch label="Require review before deploy" defaultChecked />
              <Checkbox
                label="Notify the team on failure"
                description="Posts to the #deploys channel."
                defaultChecked
              />
            </div>
          </TabPanel>
          <TabPanel value="danger">
            <Alert tone="danger" title="Deleting a project is permanent">
              Its deployments and domains are removed immediately.
            </Alert>
          </TabPanel>
        </Tabs>
      </Card>
      <div className="showcase__side">
        <Alert tone="success" title="Deploy #482 is live">
          Rolled out to 3 regions in 41 s.
        </Alert>
        <Card title="Pipelines" headingLevel={2}>
          <ul className="showcase__status">
            <li>
              <code>main</code>
              <Badge tone="success">passing</Badge>
            </li>
            <li>
              <code>feat/search</code>
              <Badge tone="warning">pending</Badge>
            </li>
            <li>
              <code>fix/login</code>
              <Badge tone="danger">failing</Badge>
            </li>
            <li>
              <code>docs/tokens</code>
              <Spinner size="sm" label="Running" />
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <article className="doc home">
      <header className="hero">
        <p className="eyebrow">Design system · React + TypeScript</p>
        <h1 className="hero__title">
          Interfaces that feel light, <span>for everyone.</span>
        </h1>
        <p className="lede">
          Brisa is a small, accessible component library built on themeable design tokens. Light and
          dark themes, keyboard support and screen-reader semantics are part of every component, and
          they are tested.
        </p>
        <div className="hero__actions">
          <Button size="lg" onClick={() => (window.location.hash = '#/components/button')}>
            Browse components
          </Button>
          <Button size="lg" variant="secondary" onClick={() => (window.location.hash = '#/tokens')}>
            See the tokens
          </Button>
        </div>
        <ul className="hero__facts" aria-label="At a glance">
          <li>
            <strong>{docs.length}</strong> components
          </li>
          <li>
            <strong>WCAG AA</strong> contrast, tested
          </li>
          <li>
            <strong>0</strong> runtime dependencies
          </li>
        </ul>
      </header>

      <Showcase />

      <section className="principles" aria-labelledby="principles-title">
        <h2 id="principles-title">Principles</h2>
        <div className="principles__grid">
          <div>
            <Badge tone="accent">Accessible by default</Badge>
            <p>
              Native elements first (<code>&lt;dialog&gt;</code>, <code>&lt;select&gt;</code>,
              radios). Custom widgets follow WAI-ARIA patterns, and every component runs axe-core in
              its tests.
            </p>
          </div>
          <div>
            <Badge tone="info">Themeable by tokens</Badge>
            <p>
              Components only read semantic CSS custom properties. Switching theme is one attribute
              on <code>&lt;html&gt;</code>; no component re-renders.
            </p>
          </div>
          <div>
            <Badge tone="success">Tested contract</Badge>
            <p>
              A test parses the token file and checks every text/background pair against WCAG AA in
              both themes, so a palette change can’t quietly break contrast.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="start-title">
        <h2 id="start-title">Quick start</h2>
        <p>
          Wrap your app in <code>ThemeProvider</code>, import the stylesheet once, and use the
          components.
        </p>
        <pre className="example__code">
          <code>{install}</code>
        </pre>
      </section>
    </article>
  );
}
