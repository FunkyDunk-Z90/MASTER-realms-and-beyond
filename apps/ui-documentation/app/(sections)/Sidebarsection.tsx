'use client'

import { useState } from 'react'
import {
    Button,
    Sidebar,
    I_SidebarSection,
    Section,
    H3,
    P,
    CodeBlock,
    PropsTable,
    Callout,
} from '@rnb/ui'

const sidebarProps = [
    {
        prop: 'sections',
        type: 'I_SidebarSection[]',
        required: true,
        desc: 'Array of section groups. Each has an optional title and items: I_Link[] array.',
    },
    {
        prop: 'variant',
        type: 'T_SidebarVariant',
        default: "'default'",
        desc: "'default' — var(--sidebar-max) width. 'compact' — var(--sidebar-min) width.",
    },
    {
        prop: 'isOpen',
        type: 'boolean',
        desc: 'When provided, enables controlled overlay (drawer) mode with backdrop and slide transition.',
    },
    {
        prop: 'onClose',
        type: '() => void',
        desc: 'Fired on backdrop click or outside click in overlay mode.',
    },
    {
        prop: 'footer',
        type: 'ReactNode',
        desc: 'Content pinned to the bottom of the sidebar (version info, user card, etc.).',
    },
]

const cssProps = [
    {
        prop: 'sidebar-wrapper',
        type: 'className',
        desc: 'Flex column, full height, secondary bg, primary border-right. Smooth width transitions.',
    },
    {
        prop: 'sidebar-default',
        type: 'className',
        desc: 'Width: var(--sidebar-max), min-width: var(--sidebar-min).',
    },
    {
        prop: 'sidebar-compact',
        type: 'className',
        desc: 'Width: var(--sidebar-min). For icon-rail layouts.',
    },
    {
        prop: 'sidebar-overlay',
        type: 'className',
        desc: 'Position fixed, z-index 200, box-shadow. Added in controlled mode.',
    },
    {
        prop: 'sidebar-overlay-open',
        type: 'className',
        desc: 'transform: translateX(0) at 0.35s cubic-bezier.',
    },
    {
        prop: 'sidebar-overlay-closed',
        type: 'className',
        desc: 'transform: translateX(-100%).',
    },
    {
        prop: 'sidebar-backdrop',
        type: 'className',
        desc: 'Fixed full-screen overlay, backdrop-filter: blur(3px) + var(--blur) tint.',
    },
    {
        prop: 'sidebar-section-title',
        type: 'className',
        desc: 'Monospaced, 0.7rem, uppercase, --accent-color, letter-spacing.',
    },
    {
        prop: 'sidebar-link',
        type: 'className',
        desc: 'Flex row with gap and padding. Hover: --bg-primary-color bg + primary hover text.',
    },
    {
        prop: 'sidebar-link.active',
        type: 'className',
        desc: 'Primary bg, light text. Matched by usePathname() against item.href.',
    },
    {
        prop: 'sidebar-footer',
        type: 'className',
        desc: 'Pinned below nav, border-top, padding, margin-top: auto.',
    },
]

const overlayDemoSections: I_SidebarSection[] = [
    {
        title: 'Demo',
        items: [
            { id: 'od1', label: 'Dashboard', href: '#sidebar' },
            { id: 'od2', label: 'Analytics', href: '#sidebar' },
            { id: 'od3', label: 'Reports', href: '#sidebar' },
        ],
    },
]

export default function SidebarSection() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <Section id="sidebar" title="Sidebar" tag="@rnb/ui · 'use client'">
            <P>
                Supports two width variants, section grouping with headings,
                active-route highlighting, a collapsible toggle in self-managed
                (desktop) mode, and a controlled overlay/drawer mode for mobile.
            </P>

            <H3>Live demos</H3>
            <div className="docs-demo-card">
                <div className="docs-demo-row">
                    <Button
                        theme="accent"
                        handleClick={() => setSidebarOpen(true)}
                    >
                        Open overlay Sidebar
                    </Button>
                    <p className="docs-demo-hint">
                        The left sidebar on this page is the self-managed
                        desktop variant.
                    </p>
                </div>
            </div>

            <Sidebar
                sections={overlayDemoSections}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                footer={
                    <Button
                        theme="danger"
                        handleClick={() => setSidebarOpen(false)}
                    >
                        Close
                    </Button>
                }
            />

            <H3>Props</H3>
            <PropsTable rows={sidebarProps} />

            <H3>I_SidebarSection shape</H3>
            <CodeBlock label="types" lang="ts">{`interface I_SidebarSection {
  title?: string   // section heading (uppercase, accent colour)
  items:  I_Link[] // from @rnb/types
}`}</CodeBlock>

            <H3>CSS classes</H3>
            <PropsTable rows={cssProps} />

            <H3>Usage examples</H3>
            <CodeBlock
                label="Desktop self-managed"
                lang="tsx"
            >{`import { Sidebar, I_SidebarSection } from '@rnb/ui'

const sections: I_SidebarSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'dash',      label: 'Dashboard', href: '/'          },
      { id: 'analytics', label: 'Analytics', href: '/analytics' },
    ]
  },
  {
    title: 'Admin',
    items: [
      { id: 'users',    label: 'Users',    href: '/admin/users' },
      { id: 'settings', label: 'Settings', href: '/settings'   },
    ]
  }
]

// Manages its own open/collapse state — includes a collapse toggle button
<Sidebar sections={sections} footer={<p>v1.0</p>} />`}</CodeBlock>

            <CodeBlock
                label="Mobile controlled overlay"
                lang="tsx"
            >{`const [open, setOpen] = useState(false)

<Button handleClick={() => setOpen(true)}>☰ Menu</Button>

<Sidebar
  sections={sections}
  isOpen={open}
  onClose={() => setOpen(false)}
  footer={<Button theme="danger" handleClick={() => setOpen(false)}>Close</Button>}
/>`}</CodeBlock>

            <CodeBlock
                label="Compact (icon rail) variant"
                lang="tsx"
            >{`<Sidebar sections={sections} variant="compact" />`}</CodeBlock>

            <Callout type="tip">
                <strong>App shell pattern:</strong> Wrap{' '}
                <code className="docs-code-inline">page-wrapper</code> and{' '}
                <code className="docs-code-inline">&lt;Sidebar&gt;</code> in a
                flex/grid row. The sidebar uses{' '}
                <code className="docs-code-inline">height: 100%</code> so it
                fills its grid cell automatically.
            </Callout>
        </Section>
    )
}
