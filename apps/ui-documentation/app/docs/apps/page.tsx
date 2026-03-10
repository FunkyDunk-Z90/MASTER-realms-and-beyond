import { Section, H3, P, CodeBlock, Callout } from '@rnb/ui'

export default function AppsPage() {
    return (
        <>
            <div className="docs-hero">
                <p className="docs-eyebrow">Applications</p>
                <h1 className="docs-h1">Apps Overview</h1>
                <p className="docs-hero-sub">
                    The monorepo hosts four production Next.js applications plus this documentation
                    site. Each app is fully independent — its own routes, layouts, and
                    app-specific logic — but all share the same packages, design system, and
                    deployment pipeline.
                </p>
            </div>

            {/* ── Aetherscribe ── */}
            <Section id="aetherscribe" title="Aetherscribe" tag="apps/aetherscribe/">
                <P>
                    The flagship app. A TTRPG worldbuilding and campaign management suite for
                    game masters and players. Users create and manage campaigns, player
                    characters, NPCs, bestiary entries, spells, items, feats, worlds,
                    ancestries, and backgrounds.
                </P>

                <H3>Route structure</H3>
                <CodeBlock label="apps/aetherscribe/app/" lang="tree">{`app/
├── layout.tsx              # Root layout — ThemeProvider, Navbar, Footer
├── page.tsx                # Landing / redirect
├── (auth)/
│   ├── layout.tsx
│   └── login/page.tsx
└── (dashboard)/
    ├── layout.tsx          # Dashboard shell
    └── hub/
        ├── layout.tsx      # Hub layout with Sidebar
        ├── page.tsx        # Hub home — CartridgeCard grid
        ├── campaigns/
        │   ├── page.tsx
        │   └── [id]/page.tsx
        ├── player-characters/
        │   ├── page.tsx
        │   └── [id]/page.tsx
        ├── worlds/page.tsx
        ├── bestiary/page.tsx
        ├── spells/page.tsx
        ├── items/page.tsx
        ├── feats/page.tsx
        ├── ancestries/page.tsx
        ├── backgrounds/page.tsx
        └── npcs/page.tsx`}</CodeBlock>

                <H3>Running locally</H3>
                <CodeBlock label="terminal" lang="bash">{`# From the monorepo root
pnpm --filter aetherscribe dev

# Or from inside the app directory
cd apps/aetherscribe
pnpm dev`}</CodeBlock>

                <H3>Theme</H3>
                <P>
                    Aetherscribe uses a unique storage key pair so the user&apos;s theme
                    preference is scoped to this app only.
                </P>
                <CodeBlock label="app/layout.tsx" lang="tsx">{`const THEME_KEY = 'aether-theme'
const MODE_KEY  = 'aether-mode'`}</CodeBlock>

                <H3>Adding a new hub page</H3>
                <CodeBlock label="Example — add /hub/factions" lang="bash">{`# 1. Create the page file
touch apps/aetherscribe/app/(dashboard)/hub/factions/page.tsx`}</CodeBlock>
                <CodeBlock label="hub/factions/page.tsx" lang="tsx">{`export default function FactionsPage() {
    return (
        <>
            <h1>Factions</h1>
            <p>Manage political factions in your world.</p>
        </>
    )
}`}</CodeBlock>
                <CodeBlock label="apps/aetherscribe/data/sidebarSections.ts" lang="tsx">{`// 2. Add a sidebar entry
{
    id: 'factions',
    label: 'Factions',
    href: '/hub/factions',
    icon: '⚜',
}`}</CodeBlock>
            </Section>

            {/* ── Byte Burger ── */}
            <Section id="byte-burger" title="Byte Burger" tag="apps/byte-burger/">
                <P>
                    A food ordering platform for the fictional Byte Burger restaurant chain.
                    Uses the <code className="docs-code-inline">byte-burger</code> theme — warm
                    dark with hot-orange primary and mustard accent — setting it apart visually
                    from other R&amp;B apps while sharing the same component and style foundation.
                </P>

                <H3>Running locally</H3>
                <CodeBlock label="terminal" lang="bash">{`pnpm --filter byte-burger dev`}</CodeBlock>

                <H3>Theme configuration</H3>
                <P>
                    The Byte Burger app sets the theme to{' '}
                    <code className="docs-code-inline">byte-burger</code> as its default via
                    the <code className="docs-code-inline">defaultTheme</code> prop on
                    <code className="docs-code-inline">ThemeInitializer</code>.
                </P>
                <CodeBlock label="app/layout.tsx" lang="tsx">{`<ThemeInitializer
    themeStorageKey="bb-theme"
    modeStorageKey="bb-mode"
    defaultTheme="byte-burger"
/>`}</CodeBlock>
            </Section>

            {/* ── Nexus Serve ── */}
            <Section id="nexus-serve" title="Nexus Serve" tag="apps/nexus-serve/">
                <P>
                    A POS (point of sale) and employee management system for the Byte Burger
                    operation. Handles orders, staff scheduling, and inventory. Runs alongside
                    Byte Burger as a back-office companion app.
                </P>

                <H3>Running locally</H3>
                <CodeBlock label="terminal" lang="bash">{`pnpm --filter nexus-serve dev`}</CodeBlock>
            </Section>

            {/* ── R&B Landing ── */}
            <Section id="landing" title="R&B Landing" tag="apps/realms-and-beyond/">
                <P>
                    The public-facing landing page for the Realms &amp; Beyond holding company.
                    Links out to all sub-products and serves as the primary brand touchpoint.
                </P>

                <H3>Running locally</H3>
                <CodeBlock label="terminal" lang="bash">{`pnpm --filter realms-and-beyond dev`}</CodeBlock>
            </Section>

            {/* ── Adding an App ── */}
            <Section id="adding" title="Adding a New App">
                <P>
                    Follow these steps exactly to scaffold a new Next.js app in the monorepo.
                    Do not copy an existing app directly — the setup is straightforward and
                    starting fresh avoids carrying stale configuration.
                </P>

                <H3>1. Create the app with Next.js</H3>
                <CodeBlock label="terminal" lang="bash">{`cd apps/
npx create-next-app@latest my-new-app \
    --typescript \
    --no-tailwind \
    --no-src-dir \
    --app \
    --import-alias "@/*"`}</CodeBlock>

                <H3>2. Update package.json</H3>
                <CodeBlock label="apps/my-new-app/package.json" lang="json">{`{
  "name": "my-new-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start",
    "lint":  "eslint"
  },
  "dependencies": {
    "@rnb/styles": "workspace:*",
    "@rnb/types":  "workspace:*",
    "@rnb/ui":     "workspace:*",
    "next":        "16.1.6",
    "react":       "19.2.4",
    "react-dom":   "19.2.4",
    "sass":        "^1.97.3"
  }
}`}</CodeBlock>

                <H3>3. Set up the root layout</H3>
                <CodeBlock label="app/layout.tsx" lang="tsx">{`import type { Metadata } from 'next'
import { Navbar, Footer, ThemeProvider, ThemeInitializer } from '@rnb/ui'
import { I_Link } from '@rnb/types'
import '@rnb/styles'

const THEME_KEY = 'my-new-app-theme'
const MODE_KEY  = 'my-new-app-mode'

export const metadata: Metadata = {
    title: 'My New App',
    description: 'Realms & Beyond — My New App',
}

const navLinks: I_Link[] = [
    { id: 'home', label: 'Home', href: '/' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                    <Navbar headerTitle="My New App" navItems={navLinks} />
                    <main className="page-wrapper">{children}</main>
                    <Footer appName="My New App" />
                </ThemeProvider>
            </body>
        </html>
    )
}`}</CodeBlock>

                <H3>4. Install workspace dependencies</H3>
                <CodeBlock label="terminal" lang="bash">{`# From the monorepo root
pnpm install`}</CodeBlock>

                <Callout type="tip">
                    After adding a new app, run{' '}
                    <code className="docs-code-inline">pnpm build:packages</code> from the root
                    before starting the dev server. Packages need a{' '}
                    <code className="docs-code-inline">dist/</code> before your app can import them.
                </Callout>

                <H3>5. Verify in turbo</H3>
                <P>
                    Turborepo automatically picks up the new app from{' '}
                    <code className="docs-code-inline">pnpm-workspace.yaml</code> — no
                    additional config needed. Run <code className="docs-code-inline">pnpm dev</code>{' '}
                    from the root to confirm the new app starts alongside the others.
                </P>
            </Section>
        </>
    )
}
