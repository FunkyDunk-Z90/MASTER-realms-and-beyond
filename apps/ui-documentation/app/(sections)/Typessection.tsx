import { Section, H3, P, CodeBlock, PropsTable } from '@rnb/ui'

const iLinkProps = [
    {
        prop: 'id',
        type: 'string',
        required: true,
        desc: 'React key and DOM id. Must be unique within the items array.',
    },
    {
        prop: 'label',
        type: 'string',
        required: true,
        desc: 'Link display text.',
    },
    {
        prop: 'href',
        type: 'string',
        required: true,
        desc: 'Next.js <Link href>. Compared against usePathname() for active state.',
    },
    {
        prop: 'iconName',
        type: 'string',
        desc: 'Text label rendered below the icon image in the mobile Navbar.',
    },
    {
        prop: 'icon',
        type: 'StaticImageData | ReactNode',
        desc: 'In Navbar: StaticImageData rendered as Next.js <Image>. In Sidebar: any ReactNode.',
    },
]

export default function TypesSection() {
    return (
        <Section id="types" title="Shared Types" tag="@rnb/types">
            <P>
                All interfaces consumed by more than one package live in{' '}
                <code className="docs-code-inline">@rnb/types</code>.
            </P>

            <H3>I_Link</H3>
            <CodeBlock
                label="packages/types/index.ts"
                lang="ts"
            >{`export interface I_Link {
  id:        string
  label:     string
  href:      string
  iconName?: string                      // text label for icon (Navbar)
  icon?:     StaticImageData | ReactNode // image or node (Sidebar/Navbar)
}`}</CodeBlock>

            <PropsTable rows={iLinkProps} />
        </Section>
    )
}
