import { Section, P, CodeBlock, Callout } from '@rnb/ui'

export default function ThemingSection() {
    return (
        <Section id="theme" title="Theming & Dark Mode">
            <P>
                Dark mode is fully automatic via{' '}
                <code className="docs-code-inline">
                    @media (prefers-color-scheme: dark)
                </code>{' '}
                in <code className="docs-code-inline">index.scss</code>. The
                following variables are overridden:
            </P>

            <CodeBlock
                label="index.scss — dark overrides"
                lang="scss"
            >{`@media (prefers-color-scheme: dark) {
  :root {
    --bg-color:             #{$dark};           // #181818
    --bg-secondary-color:   #{$dark-secondary}; // #353535
    --text-color:           #{$light};          // #e0e0e0
    --text-secondary-color: #{$light-secondary};
    --border-color:         #{$border-dark};
  }
}`}</CodeBlock>

            <P>
                To override a token in a specific app without modifying the
                package, re-declare the variable after importing{' '}
                <code className="docs-code-inline">@rnb/styles</code>:
            </P>

            <CodeBlock
                label="app-overrides.scss"
                lang="scss"
            >{`@use '@rnb/styles';

:root {
  --primary-color:       #2d6a4f;  // green brand override
  --primary-hover-color: #1b4332;
  --accent-color:        #74c69d;
}`}</CodeBlock>

            <Callout type="warn">
                Some components hard-code{' '}
                <code className="docs-code-inline">$light</code> or{' '}
                <code className="docs-code-inline">$dark</code> SCSS variables
                (e.g. Button text colour). These cannot be overridden via CSS
                variables alone — update{' '}
                <code className="docs-code-inline">_variables.scss</code>{' '}
                directly.
            </Callout>
        </Section>
    )
}
