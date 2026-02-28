import { Section, P, CodeBlock, PropsTable } from '@rnb/ui'

const layoutRows = [
    {
        prop: 'app-wrapper',
        type: 'className',
        desc: 'Root <body> grid: grid-template-rows: auto 1fr auto, min-height: 100dvh. Ensures footer sticks to bottom.',
    },
    {
        prop: 'page-wrapper',
        type: 'className',
        desc: 'Centred content column. max-width: $desktop (1025px) on tablet+. Apply to your top-level <section>.',
    },
    {
        prop: 'section-wrapper',
        type: 'className',
        desc: 'Card-style container: secondary bg, border-radius, $large padding.',
    },
    {
        prop: 'dashboard-wrapper',
        type: 'className',
        desc: 'Grid with $large gap for dashboard panel layouts.',
    },
    {
        prop: 'section-title',
        type: 'className',
        desc: '$medium margin heading helper.',
    },
    {
        prop: 'error-wrapper',
        type: 'className',
        desc: 'Inline validation error list container: grid, justify-items: start, gap, padding.',
    },
    {
        prop: 'error-text',
        type: 'className',
        desc: 'Renders in --warning-color with disc list-style bullets.',
    },
    {
        prop: 'skeleton',
        type: 'className',
        desc: 'Shimmer loading placeholder. Animates a translucent sweep at 4s over any element.',
    },
]

export default function LayoutSection() {
    return (
        <Section id="layout" title="Layout Classes" tag="index.scss">
            <P>
                These utility classes are globally available after importing{' '}
                <code className="docs-code-inline">@rnb/styles</code>.
            </P>

            <PropsTable rows={layoutRows} />

            <CodeBlock
                label="Typical page structure"
                lang="tsx"
            >{`// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <section className="page-wrapper">
      <div className="dashboard-wrapper">
        <div className="section-wrapper">
          <h2 className="section-title">Stats</h2>
          {/* content */}
        </div>
      </div>
    </section>
  )
}`}</CodeBlock>
        </Section>
    )
}
