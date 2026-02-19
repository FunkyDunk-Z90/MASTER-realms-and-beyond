import { useRef } from 'react'

import {
    Button,
    Section,
    H3,
    P,
    CodeBlock,
    PropsTable,
    Callout,
    ThemeTable,
} from '@rnb/ui'

const buttonProps = [
    {
        prop: 'children',
        type: 'ReactNode',
        required: true,
        desc: 'Button label or inner content.',
    },
    {
        prop: 'handleClick',
        type: '(e?) => void',
        desc: 'Click / change handler. Accepts MouseEvent or ChangeEvent.',
    },
    {
        prop: 'isDisabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables and forces .disabled class regardless of theme.',
    },
    {
        prop: 'theme',
        type: 'T_BtnTheme',
        desc: "'accent' | 'warning' | 'danger' | 'submit' | 'success' | 'disabled'",
    },
    {
        prop: 'btnType',
        type: 'T_BtnTypes',
        default: "'button'",
        desc: "'button' | 'reset' | 'submit' — maps to native type attribute.",
    },
    {
        prop: 'withRef',
        type: 'RefObject<HTMLButtonElement>',
        desc: 'Attaches a React ref to the underlying <button>.',
    },
]

export default function ButtonSection() {
    const logRef = useRef<HTMLButtonElement>(null)

    return (
        <Section id="button" title="Button" tag="@rnb/ui">
            <P>
                A versatile button wrapper with full theme support, ref
                forwarding, and hydration suppression. Server-component safe —
                no{' '}
                <code className="docs-code-inline">&#39;use client&#39;</code>{' '}
                directive.
            </P>

            <H3>Live demo</H3>
            <div className="docs-demo-card">
                <div className="docs-demo-row">
                    <Button>Default</Button>
                    <Button theme="accent">Accent</Button>
                    <Button theme="danger">Danger</Button>
                    <Button theme="warning">Warning</Button>
                    <Button theme="submit">Submit</Button>
                    <Button theme="success">Success</Button>
                    <Button isDisabled>Disabled</Button>
                    <Button
                        theme="danger"
                        withRef={logRef}
                        handleClick={() => alert('ref fired!')}
                    >
                        With Ref
                    </Button>
                </div>
            </div>

            <H3>Props</H3>
            <PropsTable rows={buttonProps} />

            <H3>Theme → CSS class mapping</H3>
            <ThemeTable />

            <H3>Usage examples</H3>
            <CodeBlock
                label="All variants"
                lang="tsx"
            >{`import { Button } from '@rnb/ui'

// Default (primary colour)
<Button>Save</Button>

// Themed variants
<Button theme="accent">Upgrade</Button>
<Button theme="danger" handleClick={handleDelete}>Delete</Button>
<Button theme="warning">Review</Button>
<Button theme="submit" btnType="submit">Send</Button>
<Button theme="success">Confirm</Button>

// Disabled state — ignores theme prop
<Button isDisabled>Unavailable</Button>

// With ref forwarding
const btnRef = useRef<HTMLButtonElement>(null)
<Button withRef={btnRef} theme="accent">Focus me</Button>`}</CodeBlock>

            <Callout type="warn">
                <strong>Warning button contrast:</strong> The{' '}
                <code className="docs-code-inline">warning</code> theme sets{' '}
                <code className="docs-code-inline">color: $dark</code> to
                maintain contrast against the bright yellow background.
            </Callout>
        </Section>
    )
}
