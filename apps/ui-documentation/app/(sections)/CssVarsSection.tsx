import { Section, P, CssVarsTable } from '@rnb/ui'

export default function CssVarsSection() {
    return (
        <Section id="css-vars" title="CSS Custom Properties" tag=":root">
            <P>
                All SCSS tokens are exposed as CSS variables. Dark mode
                overrides are applied automatically via{' '}
                <code className="docs-code-inline">
                    @media (prefers-color-scheme: dark)
                </code>
                .
            </P>
            <CssVarsTable />
        </Section>
    )
}
