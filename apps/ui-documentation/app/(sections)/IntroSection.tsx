import { H3, P, CodeBlock, Section } from '@rnb/ui'

export default function IntroSection() {
    return (
        <Section id="intro" title="Introduction">
            <P>
                <code className="docs-code-inline">@rnb/ui</code> exports all UI
                components.{' '}
                <code className="docs-code-inline">@rnb/styles</code> exports
                the global SCSS entry point, and{' '}
                <code className="docs-code-inline">@rnb/types</code> exports
                shared interfaces. Import styles once at the root layout, then
                use components anywhere in the monorepo.
            </P>

            <H3>Package structure</H3>
            <CodeBlock label="Monorepo package layout" lang="tree">{`packages/
  ui/       ← @rnb/ui    (all React components)
  styles/   ← @rnb/styles (_variables, _mixins, index.scss)
  types/    ← @rnb/types  (shared TS interfaces)`}</CodeBlock>

            <H3>Root layout setup</H3>
            <CodeBlock
                label="app/layout.tsx"
                lang="tsx"
            >{`import { Header, Footer } from '@rnb/ui'
import '@rnb/styles'           // import ONCE — at root layout only
import { I_Link } from '@rnb/types'

const navItems: I_Link[] = [
  { id: 'home', label: 'Home', href: '/' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-wrapper">
        <Header appName="MyApp" hasAuth navbarItems={navItems} />
        {children}
        <Footer appName="MyApp" />
      </body>
    </html>
  )
}`}</CodeBlock>
        </Section>
    )
}
