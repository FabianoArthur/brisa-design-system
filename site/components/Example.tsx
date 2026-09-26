import { useState } from 'react';
import { Button, Tooltip, useToast } from '../../src';
import type { Example as ExampleDoc } from '../docs';

export function Example({ example }: { example: ExampleDoc }) {
  const [showCode, setShowCode] = useState(false);
  const { toast } = useToast();
  const codeId = `code-${example.title.replace(/\W+/g, '-').toLowerCase()}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      toast({ title: 'Copied to clipboard', tone: 'success', duration: 2500 });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Select the code and copy it manually.',
        tone: 'warning',
      });
    }
  };

  return (
    <section className="example" aria-labelledby={`${codeId}-title`}>
      <div className="example__bar">
        <h3 id={`${codeId}-title`} className="example__title">
          {example.title}
        </h3>
        <div className="example__actions">
          <Button
            size="sm"
            variant="ghost"
            aria-expanded={showCode}
            aria-controls={codeId}
            onClick={() => setShowCode((s) => !s)}
          >
            {showCode ? 'Hide code' : 'Show code'}
          </Button>
          <Tooltip content="Copy code">
            <Button
              size="sm"
              variant="ghost"
              aria-label="Copy code"
              icon={<CopyIcon />}
              onClick={copy}
            />
          </Tooltip>
        </div>
      </div>
      <div className="example__preview">{example.render()}</div>
      <pre id={codeId} className="example__code" hidden={!showCode}>
        <code>{example.code}</code>
      </pre>
    </section>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}
