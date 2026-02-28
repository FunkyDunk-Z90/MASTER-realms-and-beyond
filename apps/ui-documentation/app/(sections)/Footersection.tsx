import { Section, H3, P, CodeBlock, PropsTable, Callout } from '@rnb/ui'

const footerProps = [
    {
        prop: 'appName',
        type: 'string',
        required: true,
        desc: 'Rendered in .footer-app-name and lowercased/trimmed in the copyright line.',
    },
]

const cssProps = [
    {
        prop: 'footer-wrapper',
        type: 'className',
        desc: '120px tall grid, centred items, secondary bg, primary top-border, block padding $large.',
    },
    {
        prop: 'footer-copyright',
        type: 'className',
        desc: 'Bold weight. Renders @copyright {appName} {year}.',
    },
    {
        prop: 'footer-company-name',
        type: 'className',
        desc: 'Lighter weight. Reserved for a separate company name alongside appName.',
    },
]

export default function FooterSection() {
    return (
        <Section id="footer" title="Footer" tag="@rnb/ui">
            <P>
                A minimal, server-component-safe footer with app name and
                auto-generated copyright year. Slots into the third row of{' '}
                <code className="docs-code-inline">app-wrapper</code>.
            </P>

            <Callout type="info">
                The footer at the bottom of this page is the live component.
            </Callout>

            <H3>Props</H3>
            <PropsTable rows={footerProps} />

            <H3>CSS classes</H3>
            <PropsTable rows={cssProps} />

            <CodeBlock label="Usage" lang="tsx">{`<Footer appName="Modularix" />
// renders: "@copyright modularix 2025"`}</CodeBlock>
        </Section>
    )
}
