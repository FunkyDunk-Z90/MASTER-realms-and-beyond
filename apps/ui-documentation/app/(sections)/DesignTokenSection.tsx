import { Section, CodeBlock, SwatchGrid, SpacingGrid, H3, P } from '@rnb/ui'

export default function DesignTokensSection() {
    return (
        <Section id="design-tokens" title="Design Tokens" tag="_variables.scss">
            <P>
                All tokens live in{' '}
                <code className="docs-code-inline">
                    packages/styles/_variables.scss
                </code>{' '}
                and are forwarded as CSS custom properties at{' '}
                <code className="docs-code-inline">:root</code> inside{' '}
                <code className="docs-code-inline">index.scss</code>.
            </P>

            <H3>Colour palette</H3>
            <SwatchGrid />

            <H3>Spacing scale</H3>
            <SpacingGrid />

            <H3>Breakpoints</H3>
            <CodeBlock
                label="Breakpoints"
                lang="scss"
            >{`$tablet:  768px;   // stacked layouts begin
$desktop: 1025px;  // Navbar burger threshold`}</CodeBlock>

            <H3>Size tokens</H3>
            <CodeBlock
                label="Sizes"
                lang="scss"
            >{`$sidebar-max:      400px;  // --sidebar-max  (default variant)
$sidebar-min:      125px;  // --sidebar-min  (compact variant)
$header-height:    100px;  // --header-height (reference)
$nav-height:       80px;   // --nav-height   (rendered header)
$border-radius:    4px;
$transition-speed: 0.3s;`}</CodeBlock>
        </Section>
    )
}
