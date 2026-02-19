'use client'

import { useState, useRef } from 'react'
import { Button } from '@rnb/ui'
import { Dropdown, I_DropdownOption } from '@rnb/ui'
import { Sidebar, I_SidebarSection } from '@rnb/ui'
import { I_Link } from '@rnb/types'

// ─── Sidebar nav for the docs page itself ───────────────────────────────────
const docsSections: I_SidebarSection[] = [
    {
        title: 'Overview',
        items: [
            { id: 'intro', label: 'Introduction', href: '#intro' },
            {
                id: 'design-tokens',
                label: 'Design Tokens',
                href: '#design-tokens',
            },
            { id: 'css-vars', label: 'CSS Variables', href: '#css-vars' },
            { id: 'layout', label: 'Layout Classes', href: '#layout' },
        ],
    },
    {
        title: 'Components',
        items: [
            { id: 'button', label: 'Button', href: '#button' },
            { id: 'dropdown', label: 'Dropdown', href: '#dropdown' },
            { id: 'header', label: 'Header', href: '#header' },
            { id: 'navbar', label: 'Navbar', href: '#navbar' },
            { id: 'sidebar', label: 'Sidebar', href: '#sidebar' },
            { id: 'footer', label: 'Footer', href: '#footer' },
        ],
    },
    {
        title: 'Usage',
        items: [
            { id: 'monorepo', label: 'Monorepo Imports', href: '#monorepo' },
            { id: 'theme', label: 'Theming & Dark Mode', href: '#theme' },
            { id: 'types', label: 'Shared Types', href: '#types' },
        ],
    },
]

// ─── Dropdown demo data ──────────────────────────────────────────────────────
const basicOptions: I_DropdownOption[] = [
    { id: 'dash', label: 'Dashboard', value: 'dashboard' },
    { id: 'profile', label: 'Profile', value: 'profile' },
    { id: 'settings', label: 'Settings', value: 'settings' },
    { id: 'admin', label: 'Admin Panel', value: 'admin', disabled: true },
]

const nestedOptions: I_DropdownOption[] = [
    {
        id: 'reports',
        label: 'Reports',
        children: [
            { id: 'monthly', label: 'Monthly', value: 'monthly' },
            { id: 'annual', label: 'Annual', value: 'annual' },
        ],
    },
    { id: 'export', label: 'Export CSV', value: 'export' },
    { id: 'archive', label: 'Archive', value: 'archive' },
]

const searchableOptions: I_DropdownOption[] = [
    { id: 's1', label: 'TypeScript', value: 'ts' },
    { id: 's2', label: 'JavaScript', value: 'js' },
    { id: 's3', label: 'Rust', value: 'rust' },
    { id: 's4', label: 'Go', value: 'go' },
    { id: 's5', label: 'Python', value: 'python' },
    { id: 's6', label: 'Elixir', value: 'elixir' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({
    id,
    title,
    tag,
    children,
}: {
    id: string
    title: string
    tag?: string
    children: React.ReactNode
}) {
    return (
        <section className="docs-section" id={id}>
            <h2 className="docs-h2">
                {title}
                {tag && <span className="docs-tag">{tag}</span>}
            </h2>
            {children}
        </section>
    )
}

function H3({ children }: { children: React.ReactNode }) {
    return <h3 className="docs-h3">{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
    return <p className="docs-p">{children}</p>
}

function CodeBlock({
    label,
    lang,
    children,
}: {
    label?: string
    lang?: string
    children: React.ReactNode
}) {
    return (
        <div className="docs-code-block">
            <div className="docs-code-header">
                <span>{label}</span>
                <span className="docs-code-lang">{lang}</span>
            </div>
            <pre className="docs-pre">{children}</pre>
        </div>
    )
}

function PropsTable({
    rows,
}: {
    rows: {
        prop: string
        type: string
        default?: string
        required?: boolean
        desc: string
    }[]
}) {
    return (
        <div className="docs-table-wrap">
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.prop}>
                            <td>
                                <code className="docs-code-inline prop-name">
                                    {r.prop}
                                </code>
                                {r.required && (
                                    <span className="docs-req">required</span>
                                )}
                            </td>
                            <td>
                                <code className="docs-code-inline prop-type">
                                    {r.type}
                                </code>
                            </td>
                            <td>
                                <code className="docs-code-inline prop-default">
                                    {r.default ?? '—'}
                                </code>
                            </td>
                            <td className="docs-td-desc">{r.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function Callout({
    type = 'info',
    children,
}: {
    type?: 'info' | 'warn' | 'tip'
    children: React.ReactNode
}) {
    const icon = type === 'warn' ? '⚠' : type === 'tip' ? '✓' : 'ℹ'
    return (
        <div className={`docs-callout docs-callout-${type}`}>
            <span className="docs-callout-icon">{icon}</span>
            <div>{children}</div>
        </div>
    )
}

function SwatchGrid() {
    const swatches = [
        { name: '$primary', val: '#5f4680', bg: '#5f4680' },
        { name: '$primary-hover', val: '#7c42a3', bg: '#7c42a3' },
        { name: '$primary-light', val: '#5a4d6b', bg: '#5a4d6b' },
        { name: '$accent', val: '#cfae70', bg: '#cfae70' },
        { name: '$danger', val: '#b0182c', bg: '#b0182c' },
        { name: '$warning', val: '#dbd02e', bg: '#dbd02e' },
        { name: '$success', val: '#29971f', bg: '#29971f' },
        { name: '$submit', val: '#1f5d97', bg: '#1f5d97' },
        { name: '$disabled', val: '#adadad', bg: '#adadad' },
        { name: '$dark', val: '#181818', bg: '#181818', border: true },
        { name: '$light', val: '#e0e0e0', bg: '#e0e0e0' },
    ]
    return (
        <div className="docs-swatch-grid">
            {swatches.map((s) => (
                <div key={s.name} className="docs-swatch">
                    <div
                        className="docs-swatch-color"
                        style={{
                            background: s.bg,
                            border: s.border ? '1px solid #353535' : undefined,
                        }}
                    />
                    <span className="docs-swatch-name">{s.name}</span>
                    <span className="docs-swatch-val">{s.val}</span>
                </div>
            ))}
        </div>
    )
}

// ─── Main docs page ──────────────────────────────────────────────────────────

export default function DocsPage() {
    // Button demo
    const logRef = useRef<HTMLButtonElement>(null)

    // Dropdown demos
    const [basicVal, setBasicVal] = useState<string | undefined>()
    const [nestedVal, setNestedVal] = useState<string | undefined>()
    const [searchVal, setSearchVal] = useState<string | undefined>()
    const [themeVal, setThemeVal] = useState<string | undefined>()

    // Sidebar overlay demo
    const [sidebarOpen, setSidebarOpen] = useState(false)

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

    return (
        <>
            {/* ── inline styles for docs-only classes ── */}
            <style>{docsStyles}</style>

            <div className="docs-shell">
                {/* ════ SIDEBAR (self-managed desktop nav) ════ */}
                <Sidebar
                    sections={docsSections}
                    footer={
                        <p className="docs-sidebar-footer-text">
                            @rnb/ui · v1.0
                        </p>
                    }
                />

                {/* ════ CONTENT ════ */}
                <main className="docs-main">
                    {/* ── HERO ── */}
                    <div className="docs-hero">
                        <p className="docs-eyebrow">
                            Component Library Reference
                        </p>
                        <h1 className="docs-h1">
                            @rnb/<em>ui</em> Docs
                        </h1>
                        <p className="docs-hero-sub">
                            A production-ready component library for Next.js 14
                            App Router, TypeScript and SCSS. Every component is
                            server-component-safe by default —{' '}
                            <code className="docs-code-inline">
                                &#39;use client&#39;
                            </code>{' '}
                            is added only where interactivity requires it.
                        </p>
                        <div className="docs-badges">
                            {[
                                'Next.js App Router',
                                'SCSS Design System',
                                'Dark Mode',
                                'Accessible (ARIA)',
                                'Monorepo-ready',
                            ].map((b) => (
                                <span key={b} className="docs-badge">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ════════════════════════════════════════
                        INTRODUCTION
                    ════════════════════════════════════════ */}
                    <Section id="intro" title="Introduction">
                        <P>
                            <code className="docs-code-inline">@rnb/ui</code>{' '}
                            exports all UI components.{' '}
                            <code className="docs-code-inline">
                                @rnb/styles
                            </code>{' '}
                            exports the global SCSS entry point, and{' '}
                            <code className="docs-code-inline">@rnb/types</code>{' '}
                            exports shared interfaces. Import styles once at the
                            root layout, then use components anywhere in the
                            monorepo.
                        </P>

                        <H3>Package structure</H3>
                        <CodeBlock
                            label="Monorepo package layout"
                            lang="tree"
                        >{`packages/
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

                    {/* ════════════════════════════════════════
                        DESIGN TOKENS
                    ════════════════════════════════════════ */}
                    <Section
                        id="design-tokens"
                        title="Design Tokens"
                        tag="_variables.scss"
                    >
                        <P>
                            All tokens live in{' '}
                            <code className="docs-code-inline">
                                packages/styles/_variables.scss
                            </code>{' '}
                            and are forwarded as CSS custom properties at{' '}
                            <code className="docs-code-inline">:root</code>{' '}
                            inside{' '}
                            <code className="docs-code-inline">index.scss</code>
                            .
                        </P>

                        <H3>Colour palette</H3>
                        <SwatchGrid />

                        <H3>Spacing scale</H3>
                        <div className="docs-spacing-grid">
                            {[
                                { name: '$small', val: '0.3rem', w: 14 },
                                { name: '$medium', val: '0.5rem', w: 24 },
                                { name: '$large', val: '1rem', w: 48 },
                                { name: '$xLarge', val: '1.5rem', w: 72 },
                            ].map((s) => (
                                <div key={s.name} className="docs-spacing-row">
                                    <span className="docs-spacing-label">
                                        {s.name} · {s.val}
                                    </span>
                                    <div
                                        className="docs-spacing-bar"
                                        style={{ width: s.w }}
                                    />
                                </div>
                            ))}
                        </div>

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

                    {/* ════════════════════════════════════════
                        CSS VARIABLES
                    ════════════════════════════════════════ */}
                    <Section
                        id="css-vars"
                        title="CSS Custom Properties"
                        tag=":root"
                    >
                        <P>
                            All SCSS tokens are exposed as CSS variables. Dark
                            mode overrides are applied automatically via{' '}
                            <code className="docs-code-inline">
                                @media (prefers-color-scheme: dark)
                            </code>
                            .
                        </P>

                        <div className="docs-table-wrap">
                            <table className="docs-table">
                                <thead>
                                    <tr>
                                        <th>Variable</th>
                                        <th>Light value</th>
                                        <th>Dark override</th>
                                        <th>Used by</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        [
                                            '--bg-color',
                                            '$light (#e0e0e0)',
                                            '$dark (#181818)',
                                            'body background',
                                        ],
                                        [
                                            '--bg-secondary-color',
                                            '$light-secondary',
                                            '$dark-secondary',
                                            'Header, Footer, Sidebar, cards',
                                        ],
                                        [
                                            '--bg-primary-color',
                                            '$primary-light',
                                            '—',
                                            'Navbar hover, section bg',
                                        ],
                                        [
                                            '--text-color',
                                            '$dark',
                                            '$light',
                                            'All text',
                                        ],
                                        [
                                            '--primary-color',
                                            '#5f4680',
                                            '—',
                                            'Buttons, borders, active states',
                                        ],
                                        [
                                            '--primary-hover-color',
                                            '#7c42a3',
                                            '—',
                                            'Button hover, link hover',
                                        ],
                                        [
                                            '--accent-color',
                                            '#cfae70',
                                            '—',
                                            'Accent buttons, sidebar headings',
                                        ],
                                        [
                                            '--danger-color',
                                            '#b0182c',
                                            '—',
                                            'Danger buttons',
                                        ],
                                        [
                                            '--warning-color',
                                            '#dbd02e',
                                            '—',
                                            'Warning buttons, error text',
                                        ],
                                        [
                                            '--success-color',
                                            '#29971f',
                                            '—',
                                            'Success buttons',
                                        ],
                                        [
                                            '--submit-color',
                                            '#1f5d97',
                                            '—',
                                            'Submit/form buttons',
                                        ],
                                        [
                                            '--disabled-color',
                                            '#adadad',
                                            '—',
                                            'Disabled button state',
                                        ],
                                        [
                                            '--blur',
                                            '$light-blur',
                                            '$dark-blur',
                                            'Header overlay backdrop',
                                        ],
                                        [
                                            '--sidebar-max',
                                            '400px',
                                            '—',
                                            'Sidebar default width',
                                        ],
                                        [
                                            '--sidebar-min',
                                            '125px',
                                            '—',
                                            'Sidebar compact width',
                                        ],
                                        [
                                            '--header-height',
                                            '100px',
                                            '—',
                                            'Offset calculations',
                                        ],
                                        [
                                            '--nav-height',
                                            '80px',
                                            '—',
                                            'Header rendered height',
                                        ],
                                        [
                                            '--transition-speed',
                                            '0.3s',
                                            '—',
                                            'All CSS transitions',
                                        ],
                                    ].map(([name, light, dark, used]) => (
                                        <tr key={name}>
                                            <td>
                                                <code className="docs-code-inline prop-name">
                                                    {name}
                                                </code>
                                            </td>
                                            <td>
                                                <code className="docs-code-inline prop-default">
                                                    {light}
                                                </code>
                                            </td>
                                            <td>
                                                <code className="docs-code-inline prop-type">
                                                    {dark}
                                                </code>
                                            </td>
                                            <td className="docs-td-desc">
                                                {used}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    {/* ════════════════════════════════════════
                        LAYOUT CLASSES
                    ════════════════════════════════════════ */}
                    <Section
                        id="layout"
                        title="Layout Classes"
                        tag="index.scss"
                    >
                        <P>
                            These utility classes are globally available after
                            importing{' '}
                            <code className="docs-code-inline">
                                @rnb/styles
                            </code>
                            .
                        </P>
                        <PropsTable
                            rows={[
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
                            ]}
                        />

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

                    <hr className="docs-divider" />

                    {/* ════════════════════════════════════════
                        BUTTON
                    ════════════════════════════════════════ */}
                    <Section id="button" title="Button" tag="@rnb/ui">
                        <P>
                            A versatile button wrapper with full theme support,
                            ref forwarding, and hydration suppression.
                            Server-component safe — no{' '}
                            <code className="docs-code-inline">
                                &#39;use client&#39;
                            </code>{' '}
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
                        <PropsTable
                            rows={[
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
                            ]}
                        />

                        <H3>Theme → CSS class mapping</H3>
                        <div className="docs-table-wrap">
                            <table className="docs-table">
                                <thead>
                                    <tr>
                                        <th>theme</th>
                                        <th>CSS class</th>
                                        <th>Background var</th>
                                        <th>Hover behaviour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        [
                                            'undefined',
                                            '.btn',
                                            '--primary-color',
                                            '--primary-hover-color background',
                                        ],
                                        [
                                            'accent',
                                            '.btn.accent',
                                            '--accent-color',
                                            'Box shadow glow in --accent-color',
                                        ],
                                        [
                                            'danger',
                                            '.btn.danger',
                                            '--danger-color',
                                            'Box shadow glow in --danger-color',
                                        ],
                                        [
                                            'warning',
                                            '.btn.warning',
                                            '--warning-color',
                                            'Dark text ($dark), glow in --warning-color',
                                        ],
                                        [
                                            'submit',
                                            '.btn.submit',
                                            '--submit-color',
                                            'Box shadow glow in --submit-color',
                                        ],
                                        [
                                            'success',
                                            '.btn.success',
                                            '--success-color',
                                            'Box shadow glow in --success-color',
                                        ],
                                        [
                                            'disabled / isDisabled',
                                            '.btn.disabled',
                                            '--disabled-color',
                                            'cursor: not-allowed, no transform',
                                        ],
                                    ].map(([t, cls, bg, hover]) => (
                                        <tr key={t}>
                                            <td>
                                                <code className="docs-code-inline prop-name">
                                                    {t}
                                                </code>
                                            </td>
                                            <td>
                                                <code className="docs-code-inline prop-type">
                                                    {cls}
                                                </code>
                                            </td>
                                            <td>
                                                <code className="docs-code-inline prop-default">
                                                    {bg}
                                                </code>
                                            </td>
                                            <td className="docs-td-desc">
                                                {hover}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
                            <code className="docs-code-inline">warning</code>{' '}
                            theme sets{' '}
                            <code className="docs-code-inline">
                                color: $dark
                            </code>{' '}
                            to maintain contrast against the bright yellow
                            background.
                        </Callout>
                    </Section>

                    {/* ════════════════════════════════════════
                        DROPDOWN
                    ════════════════════════════════════════ */}
                    <Section
                        id="dropdown"
                        title="Dropdown"
                        tag="@rnb/ui · 'use client'"
                    >
                        <P>
                            A fully featured, accessible dropdown with nested
                            multi-level menus, search filtering, hover-open
                            mode, and a custom renderer. Manages its own
                            open/close state and closes on outside click.
                        </P>

                        <H3>Live demos</H3>
                        <div className="docs-demo-card">
                            <div className="docs-demo-row docs-demo-row--wrap">
                                <div className="docs-demo-col">
                                    <p className="docs-demo-label">
                                        Basic controlled
                                    </p>
                                    <Dropdown
                                        options={basicOptions}
                                        selectedValue={basicVal}
                                        placeholder="Navigate to…"
                                        onChange={(v) => setBasicVal(v)}
                                    />
                                    {basicVal && (
                                        <p className="docs-demo-hint">
                                            Selected:{' '}
                                            <strong>{basicVal}</strong>
                                        </p>
                                    )}
                                </div>

                                <div className="docs-demo-col">
                                    <p className="docs-demo-label">
                                        Nested + hover open
                                    </p>
                                    <Dropdown
                                        options={nestedOptions}
                                        selectedValue={nestedVal}
                                        placeholder="Choose report…"
                                        openOnHover
                                        onChange={(v) => setNestedVal(v)}
                                    />
                                </div>

                                <div className="docs-demo-col">
                                    <p className="docs-demo-label">
                                        Searchable
                                    </p>
                                    <Dropdown
                                        options={searchableOptions}
                                        selectedValue={searchVal}
                                        placeholder="Search language…"
                                        searchable
                                        onChange={(v) => setSearchVal(v)}
                                    />
                                </div>

                                <div className="docs-demo-col">
                                    <p className="docs-demo-label">Disabled</p>
                                    <Dropdown
                                        options={basicOptions}
                                        placeholder="Unavailable"
                                        disabled
                                        onChange={() => {}}
                                    />
                                </div>
                            </div>
                        </div>

                        <H3>Props</H3>
                        <PropsTable
                            rows={[
                                {
                                    prop: 'options',
                                    type: 'I_DropdownOption[]',
                                    required: true,
                                    desc: 'The full option tree. Each option can have a children array for nested menus.',
                                },
                                {
                                    prop: 'selectedValue',
                                    type: 'string',
                                    desc: 'Controlled selection. Must match an option.value.',
                                },
                                {
                                    prop: 'placeholder',
                                    type: 'string',
                                    default: "'Select…'",
                                    desc: 'Shown when no option is selected.',
                                },
                                {
                                    prop: 'disabled',
                                    type: 'boolean',
                                    default: 'false',
                                    desc: 'Prevents opening the menu.',
                                },
                                {
                                    prop: 'closeOnSelect',
                                    type: 'boolean',
                                    default: 'true',
                                    desc: 'Auto-close after selecting a leaf option.',
                                },
                                {
                                    prop: 'searchable',
                                    type: 'boolean',
                                    default: 'false',
                                    desc: 'Renders a text input above the menu. Filters all levels recursively.',
                                },
                                {
                                    prop: 'openOnHover',
                                    type: 'boolean',
                                    default: 'false',
                                    desc: 'Sub-menus open on mouseenter instead of click.',
                                },
                                {
                                    prop: 'placement',
                                    type: 'T_DropdownPlacement',
                                    desc: "Position hint: 'bottom' | 'top' | 'left' | 'right' with optional '-start' | '-end' suffix.",
                                },
                                {
                                    prop: 'onChange',
                                    type: '(value, option) => void',
                                    desc: 'Fires with the selected option.value and full option object.',
                                },
                                {
                                    prop: 'renderOption',
                                    type: '(option, isSelected, depth) => ReactNode',
                                    desc: 'Custom renderer per option. Receives selection state and nesting depth.',
                                },
                                {
                                    prop: 'id',
                                    type: 'string',
                                    desc: 'Passed to the root wrapper <div>.',
                                },
                                {
                                    prop: 'children',
                                    type: 'ReactNode',
                                    default: '▾ icon',
                                    desc: 'Custom trigger icon/node rendered after the label.',
                                },
                            ]}
                        />

                        <H3>I_DropdownOption shape</H3>
                        <CodeBlock
                            label="types"
                            lang="ts"
                        >{`interface I_DropdownOption {
  id:           string
  label:        string       // display text (also searched)
  value?:       string       // passed to onChange; leaf options only
  description?: string
  iconName?:    string
  disabled?:    boolean
  children?:    I_DropdownOption[]  // nesting → submenu
}`}</CodeBlock>

                        <H3>Usage examples</H3>
                        <CodeBlock
                            label="Basic controlled"
                            lang="tsx"
                        >{`import { Dropdown, I_DropdownOption } from '@rnb/ui'
import { useState } from 'react'

const options: I_DropdownOption[] = [
  { id: '1', label: 'Dashboard', value: 'dashboard' },
  { id: '2', label: 'Profile',   value: 'profile'   },
  { id: '3', label: 'Admin',     value: 'admin', disabled: true },
]

function MyComponent() {
  const [val, setVal] = useState<string>()
  return (
    <Dropdown
      options={options}
      selectedValue={val}
      placeholder="Navigate to…"
      onChange={(v) => setVal(v)}
    />
  )
}`}</CodeBlock>
                        <CodeBlock
                            label="Nested + hover open"
                            lang="tsx"
                        >{`const nested: I_DropdownOption[] = [
  {
    id: 'reports', label: 'Reports',
    children: [
      { id: 'monthly', label: 'Monthly', value: 'monthly' },
      { id: 'annual',  label: 'Annual',  value: 'annual'  },
    ]
  },
  { id: 'export', label: 'Export CSV', value: 'export' },
]

<Dropdown options={nested} openOnHover onChange={handleChange} />`}</CodeBlock>
                        <CodeBlock
                            label="Searchable with custom renderer"
                            lang="tsx"
                        >{`<Dropdown
  options={largeOptions}
  searchable
  placeholder="Search items…"
  renderOption={(option, isSelected, depth) => (
    <span style={{ paddingLeft: depth * 12 }}>
      {isSelected && '✓ '}{option.label}
    </span>
  )}
  onChange={handleChange}
/>`}</CodeBlock>

                        <Callout type="info">
                            <strong>Search filtering:</strong> Walks the entire
                            option tree recursively. A parent node is kept in
                            results if any of its children match, preserving the
                            submenu structure.
                        </Callout>
                    </Section>

                    {/* ════════════════════════════════════════
                        HEADER
                    ════════════════════════════════════════ */}
                    <Section
                        id="header"
                        title="Header"
                        tag="@rnb/ui · 'use client'"
                    >
                        <P>
                            A fixed top bar with intelligent scroll-hide
                            behaviour. Hides immediately on scroll-down, reveals
                            on intentional upward scroll using a
                            velocity-smoothed accumulator. Also manages body
                            scroll-lock when the mobile nav is open.
                        </P>
                        <Callout type="info">
                            The <code className="docs-code-inline">Header</code>{' '}
                            at the top of this page is the live component.
                            Scroll down to see the hide behaviour in action.
                        </Callout>

                        <H3>Props</H3>
                        <PropsTable
                            rows={[
                                {
                                    prop: 'appName',
                                    type: 'string',
                                    required: true,
                                    desc: 'Displayed as the h1 title. Also used in image alt text.',
                                },
                                {
                                    prop: 'navbarItems',
                                    type: 'I_Link[]',
                                    required: true,
                                    desc: 'Navigation links passed to <Navbar>. Pass [] to render only the Logout button.',
                                },
                                {
                                    prop: 'hasAuth',
                                    type: 'boolean',
                                    default: 'false',
                                    desc: 'Renders the <Navbar> (including auth controls) when true.',
                                },
                                {
                                    prop: 'appLogo',
                                    type: 'StaticImageData',
                                    desc: 'Next.js image import. Renders a .logo-app <Image> that navigates to rootLink on click.',
                                },
                                {
                                    prop: 'appBanner',
                                    type: 'StaticImageData',
                                    desc: 'Wide banner image. Renders with .banner-app class alongside the logo.',
                                },
                                {
                                    prop: 'rootLink',
                                    type: 'string',
                                    desc: 'Route pushed when the title or logo is clicked.',
                                },
                            ]}
                        />

                        <H3>Scroll-hide algorithm</H3>
                        <CodeBlock
                            label="Scroll algorithm summary"
                            lang="ts"
                        >{`// Always visible if scrollY < headerHeight (80px)
// Scroll DOWN  → setIsHidden(true) immediately, reset accumulator
// Scroll UP    → accumulate delta using EMA-smoothed velocity
//                reveal only when accumulated > SHOW_THRESHOLD (50px)
// This prevents trackpad momentum bounce from flashing the header
//
// Tuning constants:
const SHOW_THRESHOLD = 50        // px of upward scroll required to reveal
const VELOCITY_ALPHA = 0.2       // EMA smoothing 0–1 (lower = smoother)
const MIN_VELOCITY   = 0.4       // ignore frames slower than this`}</CodeBlock>

                        <H3>CSS classes</H3>
                        <PropsTable
                            rows={[
                                {
                                    prop: 'header-wrapper',
                                    type: 'className',
                                    desc: 'Base: position fixed, full-width, z-index 100, 80px height, primary border-bottom, secondary bg.',
                                },
                                {
                                    prop: 'header-wrapper.hidden',
                                    type: 'className',
                                    desc: 'transform: translateY(-100%) with cubic-bezier(0.4, 0, 0.2, 1) transition.',
                                },
                                {
                                    prop: 'header-spacer',
                                    type: 'className',
                                    desc: '80px sibling div. Prevents content jumping under the fixed header.',
                                },
                                {
                                    prop: 'header-overlay',
                                    type: 'className',
                                    desc: 'Full-screen backdrop, hidden by default.',
                                },
                                {
                                    prop: 'header-overlay.active',
                                    type: 'className',
                                    desc: 'Shows blurred overlay (backdrop-filter: blur(4px)) behind the open mobile nav.',
                                },
                                {
                                    prop: 'header-contents',
                                    type: 'className',
                                    desc: 'Grid: auto auto 1fr on desktop (logo · title · nav), auto 1fr below $tablet.',
                                },
                            ]}
                        />

                        <H3>Usage example</H3>
                        <CodeBlock
                            label="app/layout.tsx"
                            lang="tsx"
                        >{`import logo from '@/assets/logo.png'
import { I_Link } from '@rnb/types'

const navItems: I_Link[] = [
  { id: 'home',     label: 'Home',     href: '/'         },
  { id: 'docs',     label: 'Docs',     href: '/docs'     },
  { id: 'settings', label: 'Settings', href: '/settings' },
]

<Header
  appName="Modularix"
  appLogo={logo}
  rootLink="/"
  navbarItems={navItems}
  hasAuth
/>`}</CodeBlock>
                    </Section>

                    {/* ════════════════════════════════════════
                        NAVBAR
                    ════════════════════════════════════════ */}
                    <Section
                        id="navbar"
                        title="Navbar"
                        tag="@rnb/ui · 'use client'"
                    >
                        <P>
                            Rendered by{' '}
                            <code className="docs-code-inline">
                                &lt;Header&gt;
                            </code>{' '}
                            when{' '}
                            <code className="docs-code-inline">hasAuth</code> is
                            set. Handles responsive behaviour: a horizontal link
                            row on desktop with an animated underline tracker,
                            collapsing to a burger-menu drawer on mobile (&lt;
                            1025px).
                        </P>
                        <Callout type="info">
                            <strong>Internal component:</strong>{' '}
                            <code className="docs-code-inline">Navbar</code> is
                            consumed by{' '}
                            <code className="docs-code-inline">Header</code>.
                            You can import it directly for custom headers, but
                            it requires a{' '}
                            <code className="docs-code-inline">scrollLock</code>{' '}
                            dispatch prop.
                        </Callout>

                        <H3>Props</H3>
                        <PropsTable
                            rows={[
                                {
                                    prop: 'items',
                                    type: 'I_Link[]',
                                    required: true,
                                    desc: 'Navigation links. Each rendered as a Next.js <Link> with .active class when pathname matches href.',
                                },
                                {
                                    prop: 'scrollLock',
                                    type: 'Dispatch<SetStateAction<boolean>>',
                                    required: true,
                                    desc: 'Setter from Header that drives body scroll-lock when the mobile nav is open.',
                                },
                                {
                                    prop: 'onNavigate',
                                    type: '(link: I_Link) => void',
                                    desc: 'Optional callback fired after a nav link is clicked.',
                                },
                            ]}
                        />

                        <H3>Responsive behaviour</H3>
                        <div className="docs-table-wrap">
                            <table className="docs-table">
                                <thead>
                                    <tr>
                                        <th>Breakpoint</th>
                                        <th>Layout</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <code className="docs-code-inline">
                                                ≥ 1025px
                                            </code>
                                        </td>
                                        <td className="docs-td-desc">
                                            Horizontal row
                                        </td>
                                        <td className="docs-td-desc">
                                            Animated underline slides to active
                                            route using offsetWidth measurement
                                            + CSS transitions.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <code className="docs-code-inline">
                                                &lt; 1025px
                                            </code>
                                        </td>
                                        <td className="docs-td-desc">
                                            Burger drawer
                                        </td>
                                        <td className="docs-td-desc">
                                            Nav hidden to the right
                                            (translateX(100%)). Burger icon
                                            animates to X on open via slide-in
                                            keyframe.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <H3>CSS classes</H3>
                        <PropsTable
                            rows={[
                                {
                                    prop: 'nav-wrapper',
                                    type: 'className',
                                    desc: 'Relative container. On mobile: fixed-position drawer, 50% width, slides in from right.',
                                },
                                {
                                    prop: 'nav-wrapper.opened',
                                    type: 'className',
                                    desc: 'Triggers slide-in animation (0% → -1% translateX).',
                                },
                                {
                                    prop: 'nav-wrapper.closed',
                                    type: 'className',
                                    desc: 'Triggers slide-out animation (0% → 100% translateX).',
                                },
                                {
                                    prop: 'nav-link',
                                    type: 'className',
                                    desc: 'white-space: nowrap, font-size: 1.2rem. Active route gets --primary-color.',
                                },
                                {
                                    prop: 'nav-link-underline',
                                    type: 'className',
                                    desc: 'Absolute bar beneath links on desktop. Position/width calculated dynamically from link offsetWidth.',
                                },
                                {
                                    prop: 'nav-link-underline.hidden',
                                    type: 'className',
                                    desc: 'Applied when no route is active (activeIndex === -1).',
                                },
                                {
                                    prop: 'burgerIcon',
                                    type: 'className',
                                    desc: 'Three-line icon, visible only below $desktop. Lines animate to X when .active.',
                                },
                            ]}
                        />
                    </Section>

                    {/* ════════════════════════════════════════
                        SIDEBAR
                    ════════════════════════════════════════ */}
                    <Section
                        id="sidebar"
                        title="Sidebar"
                        tag="@rnb/ui · 'use client'"
                    >
                        <P>
                            Supports two width variants, section grouping with
                            headings, active-route highlighting, a collapsible
                            toggle in self-managed (desktop) mode, and a
                            controlled overlay/drawer mode for mobile.
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
                                    The left sidebar on this page is the
                                    self-managed desktop variant.
                                </p>
                            </div>
                        </div>

                        {/* Overlay sidebar controlled demo */}
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
                        <PropsTable
                            rows={[
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
                            ]}
                        />

                        <H3>I_SidebarSection shape</H3>
                        <CodeBlock
                            label="types"
                            lang="ts"
                        >{`interface I_SidebarSection {
  title?: string   // section heading (uppercase, accent colour)
  items:  I_Link[] // from @rnb/types
}`}</CodeBlock>

                        <H3>CSS classes</H3>
                        <PropsTable
                            rows={[
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
                            ]}
                        />

                        <H3>Usage examples</H3>
                        <CodeBlock
                            label="Desktop self-managed"
                            lang="tsx"
                        >{`import { Sidebar, I_SidebarSection } from '@rnb/ui'

const sections: I_SidebarSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'dash',     label: 'Dashboard', href: '/'          },
      { id: 'analytics',label: 'Analytics', href: '/analytics' },
    ]
  },
  {
    title: 'Admin',
    items: [
      { id: 'users',    label: 'Users',     href: '/admin/users' },
      { id: 'settings', label: 'Settings',  href: '/settings'   },
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
                            <code className="docs-code-inline">
                                page-wrapper
                            </code>{' '}
                            and{' '}
                            <code className="docs-code-inline">
                                &lt;Sidebar&gt;
                            </code>{' '}
                            in a flex/grid row. The sidebar uses{' '}
                            <code className="docs-code-inline">
                                height: 100%
                            </code>{' '}
                            so it fills its grid cell automatically.
                        </Callout>
                    </Section>

                    {/* ════════════════════════════════════════
                        FOOTER
                    ════════════════════════════════════════ */}
                    <Section id="footer" title="Footer" tag="@rnb/ui">
                        <P>
                            A minimal, server-component-safe footer with app
                            name and auto-generated copyright year. Slots into
                            the third row of{' '}
                            <code className="docs-code-inline">
                                app-wrapper
                            </code>
                            .
                        </P>
                        <Callout type="info">
                            The footer at the bottom of this page is the live
                            component.
                        </Callout>

                        <H3>Props</H3>
                        <PropsTable
                            rows={[
                                {
                                    prop: 'appName',
                                    type: 'string',
                                    required: true,
                                    desc: 'Rendered in .footer-app-name and lowercased/trimmed in the copyright line.',
                                },
                            ]}
                        />

                        <H3>CSS classes</H3>
                        <PropsTable
                            rows={[
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
                            ]}
                        />

                        <CodeBlock
                            label="Usage"
                            lang="tsx"
                        >{`<Footer appName="Modularix" />
// renders: "@copyright modularix 2025"`}</CodeBlock>
                    </Section>

                    <hr className="docs-divider" />

                    {/* ════════════════════════════════════════
                        MONOREPO IMPORTS
                    ════════════════════════════════════════ */}
                    <Section id="monorepo" title="Monorepo Imports">
                        <P>
                            All packages are registered via{' '}
                            <code className="docs-code-inline">
                                tsconfig.json
                            </code>{' '}
                            path aliases. Always use the package alias — never
                            relative paths that cross package boundaries.
                        </P>
                        <CodeBlock label="tsconfig.json (root)" lang="json">{`{
  "compilerOptions": {
    "paths": {
      "@rnb/ui":     ["packages/ui/src/index.ts"],
      "@rnb/styles": ["packages/styles/index.scss"],
      "@rnb/types":  ["packages/types/index.ts"]
    }
  }
}`}</CodeBlock>
                        <CodeBlock
                            label="All component + type imports"
                            lang="tsx"
                        >{`// Components
import { Button }   from '@rnb/ui'
import { Dropdown } from '@rnb/ui'
import { Header }   from '@rnb/ui'
import { Footer }   from '@rnb/ui'
import { Navbar }   from '@rnb/ui'
import { Sidebar }  from '@rnb/ui'

// Sidebar types
import { I_SidebarSection, I_SidebarProps, T_SidebarVariant } from '@rnb/ui'

// Dropdown types
import { I_DropdownOption, I_DropdownProps, T_DropdownPlacement } from '@rnb/ui'

// Shared types
import { I_Link } from '@rnb/types'

// Global styles — ONCE, at root layout only
import '@rnb/styles'`}</CodeBlock>
                    </Section>

                    {/* ════════════════════════════════════════
                        THEMING
                    ════════════════════════════════════════ */}
                    <Section id="theme" title="Theming & Dark Mode">
                        <P>
                            Dark mode is fully automatic via{' '}
                            <code className="docs-code-inline">
                                @media (prefers-color-scheme: dark)
                            </code>{' '}
                            in{' '}
                            <code className="docs-code-inline">index.scss</code>
                            . The following variables are overridden:
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
                            To override a token in a specific app without
                            modifying the package, re-declare the variable after
                            importing{' '}
                            <code className="docs-code-inline">
                                @rnb/styles
                            </code>
                            :
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
                            <code className="docs-code-inline">$dark</code> SCSS
                            variables (e.g. Button text colour). These cannot be
                            overridden via CSS variables alone — update{' '}
                            <code className="docs-code-inline">
                                _variables.scss
                            </code>{' '}
                            directly.
                        </Callout>
                    </Section>

                    {/* ════════════════════════════════════════
                        SHARED TYPES
                    ════════════════════════════════════════ */}
                    <Section id="types" title="Shared Types" tag="@rnb/types">
                        <P>
                            All interfaces consumed by more than one package
                            live in{' '}
                            <code className="docs-code-inline">@rnb/types</code>
                            .
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
                        <PropsTable
                            rows={[
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
                            ]}
                        />
                    </Section>
                </main>
            </div>
        </>
    )
}

// ─── Scoped styles for docs-only classes ─────────────────────────────────────
// These sit alongside @rnb/styles and do not override any existing tokens.
const docsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

  .docs-shell {
    display: grid;
    grid-template-columns: var(--sidebar-max, 400px) 1fr;
    min-height: calc(100vh - var(--nav-height, 80px));
    align-items: start;
  }

  @media (max-width: 1024px) {
    .docs-shell {
      grid-template-columns: 1fr;
    }
    /* hide the self-managed sidebar on mobile — use overlay mode instead */
    .docs-shell > aside.sidebar-wrapper:not(.sidebar-overlay) {
      display: none;
    }
  }

  .docs-main {
    padding: 3rem 3.5rem 6rem;
    max-width: 860px;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .docs-main { padding: 2rem 1.25rem 5rem; }
  }

  /* ── Hero ── */
  .docs-hero { margin-bottom: 3.5rem; }
  .docs-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: .72rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--accent-color);
    margin-bottom: .65rem;
  }
  .docs-h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2.6rem;
    font-weight: 800;
    letter-spacing: -.04em;
    line-height: 1.1;
    margin-bottom: 1rem;
  }
  .docs-h1 em { font-style: normal; color: var(--accent-color); }
  .docs-hero-sub {
    color: var(--text-color);
    opacity: .6;
    max-width: 580px;
    margin-bottom: 1.25rem;
  }
  .docs-badges { display: flex; flex-wrap: wrap; gap: .4rem; }
  .docs-badge {
    font-family: 'DM Mono', monospace;
    font-size: .68rem;
    padding: .2rem .6rem;
    border-radius: 4px;
    border: 1px solid var(--primary-color);
    color: var(--text-color);
    opacity: .7;
    background: var(--bg-secondary-color);
  }

  /* ── Section headings ── */
  .docs-section { margin-bottom: 4rem; }
  .docs-h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.55rem;
    font-weight: 700;
    letter-spacing: -.03em;
    margin-bottom: 1.25rem;
    padding-bottom: .65rem;
    border-bottom: 1px solid var(--bg-secondary-color);
    display: flex;
    align-items: center;
    gap: .65rem;
    flex-wrap: wrap;
  }
  .docs-tag {
    font-family: 'DM Mono', monospace;
    font-size: .7rem;
    font-weight: 400;
    color: var(--accent-color);
    background: var(--bg-secondary-color);
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    padding: .15rem .5rem;
  }
  .docs-h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    margin: 1.75rem 0 .65rem;
  }
  .docs-p {
    color: var(--text-color);
    opacity: .75;
    margin-bottom: .65rem;
    line-height: 1.7;
  }

  /* ── Code ── */
  .docs-code-block {
    background: var(--bg-secondary-color);
    border: 1px solid var(--bg-primary-color);
    border-radius: 4px;
    overflow: hidden;
    margin: .75rem 0 1.25rem;
  }
  .docs-code-header {
    display: flex;
    justify-content: space-between;
    padding: .3rem 1rem;
    background: var(--bg-secondary-color);
    border-bottom: 1px solid var(--bg-primary-color);
    font-family: 'DM Mono', monospace;
    font-size: .68rem;
    opacity: .6;
  }
  .docs-code-lang { color: var(--accent-color); }
  .docs-pre {
    padding: 1.1rem 1.25rem;
    overflow-x: auto;
    font-family: 'DM Mono', monospace;
    font-size: .8rem;
    line-height: 1.75;
    white-space: pre;
    color: var(--text-color);
    opacity: .9;
    text-align: start;
  }
  .docs-code-inline {
    font-family: 'DM Mono', monospace;
    font-size: .82em;
    background: var(--bg-secondary-color);
    border: 1px solid var(--bg-primary-color);
    border-radius: 3px;
    padding: .1em .38em;
  }
  .prop-name    { color: #9d6bc7; }
  .prop-type    { color: #3db8cf; }
  .prop-default { color: var(--accent-color); }

  /* ── Tables ── */
  .docs-table-wrap { overflow-x: auto; margin: .75rem 0 1.25rem; }
  .docs-table { width: 100%; border-collapse: collapse; font-size: .84rem; }
  .docs-table th {
    font-family: 'DM Mono', monospace;
    font-size: .67rem;
    text-transform: uppercase;
    letter-spacing: .08em;
    text-align: left;
    padding: .45rem .7rem;
    border-bottom: 1px solid var(--bg-secondary-color);
    opacity: .5;
  }
  .docs-table td {
    padding: .5rem .7rem;
    border-bottom: 1px solid var(--bg-secondary-color);
    vertical-align: top;
  }
  .docs-table tr:last-child td { border-bottom: none; }
  .docs-td-desc { opacity: .7; font-size: .83rem; }
  .docs-req {
    display: inline-block;
    font-size: .58rem;
    font-family: 'DM Mono', monospace;
    padding: .08rem .32rem;
    background: rgba(176,24,44,.15);
    border: 1px solid rgba(176,24,44,.35);
    color: var(--danger-color);
    border-radius: 3px;
    margin-left: .3rem;
    vertical-align: middle;
  }

  /* ── Callouts ── */
  .docs-callout {
    display: flex;
    gap: .65rem;
    padding: .8rem 1rem;
    border-radius: 4px;
    border-left: 3px solid;
    margin: 1rem 0;
    font-size: .875rem;
  }
  .docs-callout-info  { background: var(--bg-secondary-color); border-color: var(--submit-color); }
  .docs-callout-warn  { background: var(--bg-secondary-color); border-color: var(--warning-color); }
  .docs-callout-tip   { background: var(--bg-secondary-color); border-color: var(--success-color); }
  .docs-callout-icon  { flex-shrink: 0; }
  .docs-callout p     { margin: 0; opacity: .8; }

  /* ── Demo cards ── */
  .docs-demo-card {
    background: var(--bg-secondary-color);
    border: 1px solid var(--bg-primary-color);
    border-radius: 4px;
    padding: 1.25rem;
    margin: .75rem 0 1.25rem;
  }
  .docs-demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: .65rem;
    align-items: center;
  }
  .docs-demo-row--wrap { align-items: flex-start; }
  .docs-demo-col { display: flex; flex-direction: column; gap: .45rem; }
  .docs-demo-label {
    font-family: 'DM Mono', monospace;
    font-size: .7rem;
    opacity: .5;
    text-transform: uppercase;
    letter-spacing: .08em;
  }
  .docs-demo-hint {
    font-size: .8rem;
    opacity: .55;
    font-style: italic;
  }

  /* ── Colour swatches ── */
  .docs-swatch-grid { display: flex; flex-wrap: wrap; gap: .55rem; margin: .75rem 0 1.25rem; }
  .docs-swatch { display: flex; flex-direction: column; align-items: center; gap: .3rem; }
  .docs-swatch-color { width: 50px; height: 50px; border-radius: 4px; }
  .docs-swatch-name  { font-family: 'DM Mono', monospace; font-size: .6rem; opacity: .6; text-align: center; }
  .docs-swatch-val   { font-family: 'DM Mono', monospace; font-size: .58rem; opacity: .4; }

  /* ── Spacing ── */
  .docs-spacing-grid { margin: .75rem 0 1.25rem; display: flex; flex-direction: column; gap: .4rem; }
  .docs-spacing-row  { display: flex; align-items: center; gap: 1rem; }
  .docs-spacing-label { font-family: 'DM Mono', monospace; font-size: .72rem; opacity: .6; min-width: 160px; }
  .docs-spacing-bar  { height: 8px; background: var(--primary-color); border-radius: 2px; }

  /* ── Divider ── */
  .docs-divider { border: none; border-top: 1px solid var(--bg-secondary-color); margin: 3rem 0; }

  /* ── Sidebar footer text ── */
  .docs-sidebar-footer-text {
    font-family: 'DM Mono', monospace;
    font-size: .72rem;
    opacity: .45;
  }

  /* ── Dropdown wrapper (existing .dropdown-wrapper from @rnb/styles) ── */
  .dropdown-wrapper { position: relative; display: inline-block; }
`
