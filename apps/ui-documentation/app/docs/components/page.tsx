import { Section, H3, P, CodeBlock, Callout, PropsTable } from '@rnb/ui'

export default function ComponentsPage() {
    return (
        <>
            <div className="docs-hero">
                <p className="docs-eyebrow">@rnb/ui</p>
                <h1 className="docs-h1">UI Components</h1>
                <p className="docs-hero-sub">
                    <code className="docs-code-inline">@rnb/ui</code> is the shared React component
                    library. It ships as compiled TypeScript (<code className="docs-code-inline">dist/</code>)
                    and must be rebuilt after changes. All components target Next.js App Router —
                    they are server-component safe by default and add{' '}
                    <code className="docs-code-inline">&apos;use client&apos;</code> only where
                    interactivity demands it.
                </p>
            </div>

            {/* ── Overview ── */}
            <Section id="overview" title="Overview">
                <H3>Installation (internal package)</H3>
                <CodeBlock label="package.json" lang="json">{`{
  "dependencies": {
    "@rnb/ui": "workspace:*"
  }
}`}</CodeBlock>

                <H3>Full export tree</H3>
                <CodeBlock label="@rnb/ui exports" lang="ts">{`// Layout
import { Navbar, Sidebar, Footer } from '@rnb/ui'

// Utilities / components
import { Button, Dropdown, EntityCard, CartridgeCard } from '@rnb/ui'

// Context / theming
import { ThemeProvider, ThemeInitializer, ThemeSwitcher } from '@rnb/ui'

// Documentation primitives (for building docs pages)
import { Section, H3, P, CodeBlock, PropsTable, Callout,
         Switchgrid, Spacinggrid, CssVarsTable, ThemeTable } from '@rnb/ui'

// Sidebar types
import { I_SidebarSection, I_SidebarItem, I_SearchResult,
         I_SidebarProps } from '@rnb/ui'`}</CodeBlock>

                <Callout type="info">
                    Styles are separate from components — importing{' '}
                    <code className="docs-code-inline">@rnb/ui</code> does <strong>not</strong> inject
                    any CSS. You must also import{' '}
                    <code className="docs-code-inline">@rnb/styles</code> once at your root layout.
                </Callout>
            </Section>

            {/* ── Button ── */}
            <Section id="button" title="Button" tag="utils/Button.tsx">
                <P>
                    The primary interactive element. Supports semantic variants, size modifiers,
                    and an optional loading state. Renders as a native{' '}
                    <code className="docs-code-inline">&lt;button&gt;</code> by default.
                </P>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'label', type: 'string', required: true, desc: 'Button text content' },
                    { prop: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'submit'", default: "'primary'", desc: 'Visual style variant' },
                    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size modifier' },
                    { prop: 'onClick', type: '() => void', desc: 'Click handler' },
                    { prop: 'href', type: 'string', desc: 'When provided, renders as a Next.js Link instead of button' },
                    { prop: 'disabled', type: 'boolean', default: 'false', desc: 'Disabled state' },
                    { prop: 'loading', type: 'boolean', default: 'false', desc: 'Shows a loading indicator and disables interaction' },
                    { prop: 'className', type: 'string', desc: 'Additional class on the root element' },
                ]} />

                <H3>Usage</H3>
                <CodeBlock label="Example" lang="tsx">{`import { Button } from '@rnb/ui'

// Standard button
<Button label="Save Character" onClick={handleSave} />

// Link button
<Button label="View Campaign" href="/hub/campaigns/123" variant="secondary" />

// Danger action
<Button label="Delete Entry" variant="danger" onClick={handleDelete} />

// Loading state
<Button label="Saving..." loading disabled />`}</CodeBlock>

                <H3>CSS classes</H3>
                <CodeBlock label="SCSS classes applied" lang="text">{`.btn                  — base
.btn--primary         — filled amber CTA
.btn--secondary       — outlined
.btn--ghost           — transparent / text-only
.btn--danger          — danger red
.btn--submit          — submit blue
.btn--sm / .btn--lg   — size modifiers`}</CodeBlock>
            </Section>

            {/* ── Dropdown ── */}
            <Section id="dropdown" title="Dropdown" tag="utils/Dropdown.tsx">
                <P>
                    A fully-accessible custom dropdown. Supports grouping items into sections,
                    an optional search bar, and a custom trigger element.
                </P>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'trigger', type: 'React.ReactNode', required: true, desc: 'Element that opens/closes the dropdown' },
                    { prop: 'sections', type: 'I_DropdownSection[]', required: true, desc: 'Array of item groups' },
                    { prop: 'searchable', type: 'boolean', default: 'false', desc: 'Show a search input that filters items' },
                    { prop: 'searchPlaceholder', type: 'string', default: "'Search...'", desc: 'Placeholder for the search input' },
                    { prop: 'align', type: "'left' | 'right'", default: "'left'", desc: 'Alignment of the dropdown panel relative to the trigger' },
                    { prop: 'className', type: 'string', desc: 'Additional class on the wrapper' },
                ]} />

                <H3>I_DropdownSection shape</H3>
                <CodeBlock label="Type" lang="ts">{`interface I_DropdownSection {
    label?: string          // Optional group heading
    items: I_DropdownItem[]
}

interface I_DropdownItem {
    id: string
    label: string
    onClick?: () => void
    href?: string
    icon?: string
    disabled?: boolean
}`}</CodeBlock>

                <H3>Usage</H3>
                <CodeBlock label="Example" lang="tsx">{`import { Dropdown, Button } from '@rnb/ui'

const sections = [
    {
        label: 'Actions',
        items: [
            { id: 'edit',   label: 'Edit',   onClick: () => router.push('/edit') },
            { id: 'share',  label: 'Share',  onClick: handleShare },
        ],
    },
    {
        label: 'Danger Zone',
        items: [
            { id: 'delete', label: 'Delete', onClick: handleDelete },
        ],
    },
]

<Dropdown
    trigger={<Button label="Actions" variant="secondary" />}
    sections={sections}
    searchable
/>`}</CodeBlock>
            </Section>

            {/* ── Navbar ── */}
            <Section id="navbar" title="Navbar" tag="layout/Navbar.tsx">
                <P>
                    The top navigation bar. Used in all apps. Includes the app logo/title,
                    primary navigation links, and integrates the{' '}
                    <code className="docs-code-inline">ThemeSwitcher</code> and auth actions
                    automatically.
                </P>

                <Callout type="info">
                    The Navbar is a <code className="docs-code-inline">&apos;use client&apos;</code>{' '}
                    component. It manages responsive collapse (mobile hamburger), the theme
                    switcher dropdown, and active link highlighting via{' '}
                    <code className="docs-code-inline">usePathname()</code>.
                </Callout>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'headerTitle', type: 'string', desc: 'App name shown in the header' },
                    { prop: 'headerIcon', type: 'StaticImageData', desc: 'Optional Next.js image for the app logo' },
                    { prop: 'navItems', type: 'I_Link[]', required: true, desc: 'Primary navigation links' },
                    { prop: 'hasAuth', type: 'boolean', default: 'false', desc: 'Show login/account actions in the navbar' },
                    { prop: 'className', type: 'string', desc: 'Additional class on the nav element' },
                ]} />

                <H3>I_Link shape</H3>
                <CodeBlock label="@rnb/types" lang="ts">{`interface I_Link {
    id: string
    label: string
    href: string
    icon?: string | StaticImageData
}`}</CodeBlock>

                <H3>Root layout usage</H3>
                <CodeBlock label="app/layout.tsx" lang="tsx">{`import { Navbar, Footer, ThemeProvider, ThemeInitializer } from '@rnb/ui'
import { I_Link } from '@rnb/types'
import '@rnb/styles'
import Logo from '@/public/logo.jpg'

const THEME_KEY = 'myapp-theme'
const MODE_KEY  = 'myapp-mode'

const navLinks: I_Link[] = [
    { id: 'hub',      label: 'Hub',      href: '/hub' },
    { id: 'settings', label: 'Settings', href: '/settings' },
]

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeInitializer
                    themeStorageKey={THEME_KEY}
                    modeStorageKey={MODE_KEY}
                />
            </head>
            <body className="app-wrapper">
                <ThemeProvider
                    themeStorageKey={THEME_KEY}
                    modeStorageKey={MODE_KEY}
                >
                    <Navbar
                        headerIcon={Logo}
                        headerTitle="My App"
                        navItems={navLinks}
                    />
                    <main className="page-wrapper">{children}</main>
                    <Footer appName="My App" />
                </ThemeProvider>
            </body>
        </html>
    )
}`}</CodeBlock>

                <Callout type="warn">
                    Use unique <code className="docs-code-inline">themeStorageKey</code> /
                    <code className="docs-code-inline">modeStorageKey</code> values per app
                    (e.g. <code className="docs-code-inline">aether-theme</code>) so theme
                    preferences don&apos;t bleed across apps when the user has multiple
                    R&amp;B tabs open.
                </Callout>
            </Section>

            {/* ── Sidebar ── */}
            <Section id="sidebar" title="Sidebar" tag="layout/Sidebar.tsx">
                <P>
                    A collapsible, accessible sidebar used for secondary navigation within a page
                    or section. Supports nested items, an optional search, and persists its
                    open/collapsed state in localStorage.
                </P>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'sections', type: 'I_SidebarSection[]', required: true, desc: 'Navigation sections, each with a title and items array' },
                    { prop: 'footer', type: 'React.ReactNode', desc: 'Optional content pinned to the bottom of the sidebar' },
                    { prop: 'searchFn', type: '(query: string) => I_SearchResult[]', desc: 'When provided, renders a search bar above navigation' },
                    { prop: 'storageKey', type: 'string', default: "'rnb-sidebar-open'", desc: 'localStorage key for persisting open/collapsed state' },
                    { prop: 'defaultOpen', type: 'boolean', default: 'false', desc: 'Initial open state (overridden by localStorage after first visit)' },
                ]} />

                <H3>I_SidebarSection and I_SidebarItem</H3>
                <CodeBlock label="Types" lang="ts">{`interface I_SidebarSection {
    title?: string
    items: I_SidebarItem[]
}

interface I_SidebarItem {
    id: string
    label: string
    href: string
    icon?: string | StaticImageData  // emoji string or Next.js image
    children?: I_SidebarItem[]       // nested sub-items (one level deep)
}`}</CodeBlock>

                <H3>Usage</H3>
                <CodeBlock label="Example — docs shell layout" lang="tsx">{`import { Sidebar, I_SidebarSection } from '@rnb/ui'

const sections: I_SidebarSection[] = [
    {
        title: 'Getting Started',
        items: [
            { id: 'overview', label: 'Overview', href: '/docs/overview' },
            { id: 'install',  label: 'Install',  href: '/docs/install'  },
        ],
    },
    {
        title: 'Components',
        items: [
            {
                id: 'ui',
                label: 'UI Kit',
                href: '/docs/ui',
                icon: '⚡',
                children: [
                    { id: 'button',  label: 'Button',  href: '/docs/ui/button'  },
                    { id: 'modal',   label: 'Modal',   href: '/docs/ui/modal'   },
                ],
            },
        ],
    },
]

export default function DocsLayout({ children }) {
    return (
        <div className="docs-shell">
            <Sidebar
                sections={sections}
                defaultOpen
                storageKey="my-docs-sidebar"
                footer={<p className="docs-sidebar-footer-text">v1.0.0</p>}
            />
            <main className="docs-main">{children}</main>
        </div>
    )
}`}</CodeBlock>

                <H3>Active state</H3>
                <P>
                    The Sidebar uses <code className="docs-code-inline">usePathname()</code> from
                    Next.js to detect the current route and applies the{' '}
                    <code className="docs-code-inline">.active</code> class to the matching
                    item. Items with hash-only hrefs (
                    <code className="docs-code-inline">#section</code>) will not trigger active
                    highlighting — use full page paths for proper active state.
                </P>
            </Section>

            {/* ── Footer ── */}
            <Section id="footer" title="Footer" tag="layout/Footer.tsx">
                <P>
                    A minimal site footer that displays the app name and copyright year.
                    Anchored to the bottom of the page via the{' '}
                    <code className="docs-code-inline">app-wrapper</code> flex column layout.
                </P>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'appName', type: 'string', required: true, desc: 'App name shown in the footer copyright line' },
                ]} />

                <CodeBlock label="Usage" lang="tsx">{`import { Footer } from '@rnb/ui'

<Footer appName="Aetherscribe" />`}</CodeBlock>
            </Section>

            {/* ── EntityCard ── */}
            <Section id="entitycard" title="EntityCard" tag="utils/EntityCard.tsx">
                <P>
                    A minimal list-item card for displaying a named entity with a navigation
                    link. Intended to be rendered inside a{' '}
                    <code className="docs-code-inline">&lt;ul className=&quot;card-wrapper&quot;&gt;</code>.
                </P>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'name', type: 'string', required: true, desc: 'Display name of the entity' },
                    { prop: 'href', type: 'string', required: true, desc: 'Full path for the view link' },
                    { prop: 'className', type: 'string', desc: 'Additional class on the li wrapper' },
                ]} />

                <CodeBlock label="Usage" lang="tsx">{`import { EntityCard } from '@rnb/ui'

<ul className="card-wrapper">
    {characters.map(c => (
        <EntityCard
            key={c.id}
            name={c.name}
            href={\`/hub/player-characters/\${c.id}\`}
        />
    ))}
</ul>`}</CodeBlock>
            </Section>

            {/* ── CartridgeCard ── */}
            <Section id="cartridgecard" title="CartridgeCard" tag="utils/CartridgeCard.tsx">
                <P>
                    A Game Boy cartridge-shaped card component. Uses{' '}
                    <code className="docs-code-inline">clip-path</code> to achieve chamfered
                    bottom corners and renders a platform strip, label sticker area, and gold
                    connector pin strip. Ideal for displaying campaigns, characters, or game
                    entries in a retro-styled grid.
                </P>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'title', type: 'string', required: true, desc: 'Main title on the cartridge label' },
                    { prop: 'subtitle', type: 'string', desc: 'Genre or subtitle shown below the title' },
                    { prop: 'description', type: 'string', desc: 'Short body text on the label (clamped to 3 lines)' },
                    { prop: 'platform', type: 'string', default: "'GAME BOY'", desc: 'Text in the top platform strip' },
                    { prop: 'badge', type: 'string', desc: 'Small badge above the title (e.g. "★ RPG")' },
                    { prop: 'tag', type: 'string', desc: 'Small tag bottom-right (e.g. "v1.2", "Draft")' },
                    { prop: 'accentColor', type: 'string', desc: 'CSS color for the platform strip and hover border' },
                    { prop: 'href', type: 'string', desc: 'When provided, wraps the card in a Next.js Link' },
                    { prop: 'onClick', type: '() => void', desc: 'Click handler (used when href is not provided)' },
                    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Cartridge size variant' },
                    { prop: 'className', type: 'string', desc: 'Additional class on the root element' },
                ]} />

                <H3>Usage</H3>
                <CodeBlock label="Example" lang="tsx">{`import { CartridgeCard } from '@rnb/ui'

// Grid of cartridges
<div className="cartridge-grid">
    <CartridgeCard
        title="The Shattered Crown"
        subtitle="Epic Fantasy · Act I"
        description="An ancient crown shattered across five realms."
        platform="AETHERSCRIBE"
        badge="★ Campaign"
        tag="v2.1"
        accentColor="#C47818"
        href="/hub/campaigns/shattered-crown"
    />
</div>`}</CodeBlock>

                <H3>CSS custom property</H3>
                <P>
                    The <code className="docs-code-inline">accentColor</code> prop sets the CSS
                    custom property <code className="docs-code-inline">--cartridge-accent</code> on
                    the component root, which controls:
                </P>
                <CodeBlock label="cartridgeCard.scss" lang="scss">{`.cartridge-top {
    background-color: var(--cartridge-accent);   // platform strip fill
}

.cartridge-card:hover {
    border-color: var(--cartridge-accent);        // hover border
    box-shadow: 2px 8px 24px var(--primary-glow),
                0 0 0 1px var(--cartridge-accent);
}

.cartridge-badge {
    color: var(--cartridge-accent);               // badge text
}`}</CodeBlock>

                <H3>Size variants</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Size</th><th>Width</th><th>Height</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">sm</code></td><td>110px</td><td>145px</td></tr>
                            <tr><td><code className="docs-code-inline">md</code></td><td>140px</td><td>180px</td></tr>
                            <tr><td><code className="docs-code-inline">lg</code></td><td>180px</td><td>230px</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Grid layout helper</H3>
                <CodeBlock label="CSS class" lang="scss">{`.cartridge-grid {
    display: flex;
    flex-wrap: wrap;
    gap: $xLarge;
    padding: $large 0;
}`}</CodeBlock>
            </Section>

            {/* ── ThemeSwitcher ── */}
            <Section id="themeswitcher" title="ThemeSwitcher" tag="context/ThemeSwitcher.tsx">
                <P>
                    A standalone dropdown component for switching themes. Automatically integrated
                    inside the <code className="docs-code-inline">Navbar</code> — you rarely need
                    to render it manually. Uses the{' '}
                    <code className="docs-code-inline">ThemeContext</code> internally.
                </P>

                <H3>Props</H3>
                <PropsTable rows={[
                    { prop: 'className', type: 'string', desc: 'Additional class on the wrapper' },
                ]} />

                <CodeBlock label="Standalone usage" lang="tsx">{`import { ThemeSwitcher } from '@rnb/ui'

// Standalone usage (e.g. settings page)
// Must be inside a ThemeProvider
<ThemeSwitcher />`}</CodeBlock>
            </Section>

            {/* ── Theme Context ── */}
            <Section id="theme-context" title="Theme Context" tag="context/ThemeContext.tsx">
                <P>
                    The context layer that provides theme state and mutation to all components in
                    the tree. Always wrap your app with <code className="docs-code-inline">ThemeProvider</code>{' '}
                    and include <code className="docs-code-inline">ThemeInitializer</code> in{' '}
                    <code className="docs-code-inline">&lt;head&gt;</code> to prevent flash of
                    un-themed content (FOUC).
                </P>

                <H3>ThemeProvider props</H3>
                <PropsTable rows={[
                    { prop: 'themeStorageKey', type: 'string', default: "'rnb-theme'", desc: 'localStorage key for the saved theme name' },
                    { prop: 'modeStorageKey', type: 'string', default: "'rnb-mode'", desc: "localStorage key for the saved mode ('light' | 'dark' | 'system')" },
                    { prop: 'defaultTheme', type: 'T_ThemeName', default: "'arcade'", desc: 'Theme to use on first visit before localStorage is set' },
                    { prop: 'children', type: 'React.ReactNode', required: true, desc: 'App tree' },
                ]} />

                <H3>ThemeInitializer props</H3>
                <PropsTable rows={[
                    { prop: 'themeStorageKey', type: 'string', default: "'rnb-theme'", desc: 'Must match the ThemeProvider value' },
                    { prop: 'modeStorageKey', type: 'string', default: "'rnb-mode'", desc: 'Must match the ThemeProvider value' },
                    { prop: 'defaultTheme', type: 'string', default: "'arcade'", desc: 'Fallback if no localStorage value exists' },
                ]} />

                <H3>useTheme hook (consuming context)</H3>
                <CodeBlock label="Example — settings page" lang="tsx">{`'use client'
import { useTheme } from '@rnb/ui'

export function ThemeSettings() {
    const { theme, setTheme, mode, setMode } = useTheme()

    return (
        <div>
            <p>Current theme: {theme}</p>
            <button onClick={() => setTheme('phosphor')}>
                Switch to Phosphor
            </button>
            <button onClick={() => setMode('dark')}>
                Force dark mode
            </button>
        </div>
    )
}`}</CodeBlock>

                <H3>T_ThemeName type</H3>
                <CodeBlock label="@rnb/ui" lang="ts">{`export type T_ThemeName =
    | 'arcade'
    | 'phosphor'
    | 'sovereign'
    | 'void'
    | 'dusk'
    | 'parchment'
    | 'byte-burger'
    | 'snes'
    | 'n64'`}</CodeBlock>

                <Callout type="tip">
                    When adding a new app, always use a unique storage key pair. This prevents
                    the Aetherscribe user&apos;s theme preference from overwriting the
                    Byte Burger theme when both run on the same domain (or localhost).
                </Callout>
            </Section>
        </>
    )
}
