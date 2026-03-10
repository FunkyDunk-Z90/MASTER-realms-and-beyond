import { Section, H3, P, CodeBlock, Callout } from '@rnb/ui'

export default function GettingStartedPage() {
    return (
        <>
            {/* ── Hero ── */}
            <div className="docs-hero">
                <p className="docs-eyebrow">Developer Documentation</p>
                <h1 className="docs-h1">
                    Realms &amp; Beyond <em>Codex</em>
                </h1>
                <p className="docs-hero-sub">
                    A full-stack TypeScript monorepo powering three production apps — a
                    TTRPG worldbuilding suite, a food-ordering platform, and a POS system —
                    all sharing a unified design system, component library, and server utilities.
                    This guide is your entry point as a contributor.
                </p>
                <div className="docs-badges">
                    {['pnpm workspaces', 'Turborepo', 'Next.js 16', 'TypeScript 5', 'SCSS Design System', 'React 19'].map(
                        (b) => <span key={b} className="docs-badge">{b}</span>
                    )}
                </div>
            </div>

            {/* ── Overview ── */}
            <Section id="overview" title="Overview">
                <P>
                    The <code className="docs-code-inline">realms-and-beyond</code> monorepo
                    is managed with <strong>pnpm workspaces</strong> and orchestrated with{' '}
                    <strong>Turborepo</strong>. All packages and apps share a single lockfile,
                    meaning dependencies are deduplicated and internal packages are referenced
                    via <code className="docs-code-inline">workspace:*</code> protocol.
                </P>

                <H3>What lives here</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead>
                            <tr><th>Directory</th><th>Purpose</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">apps/</code></td><td>Next.js frontend applications (aetherscribe, byte-burger, nexus-serve, realms-and-beyond)</td></tr>
                            <tr><td><code className="docs-code-inline">packages/</code></td><td>Shared internal packages — styles, UI components, types, hooks, utilities</td></tr>
                            <tr><td><code className="docs-code-inline">servers/</code></td><td>Express + Mongoose API servers (one per app domain)</td></tr>
                            <tr><td><code className="docs-code-inline">docs/</code></td><td>Architecture PDFs, concept art, and design references</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Internal package registry</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead>
                            <tr><th>Package</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">@rnb/styles</code></td><td>SCSS design tokens, themes, mixins, and global component styles</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/ui</code></td><td>React component library — layout, utilities, and context providers</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/types</code></td><td>Shared TypeScript interfaces and type aliases</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/hooks</code></td><td>Reusable React hooks</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/errors</code></td><td>Centralised <code className="docs-code-inline">AppError</code> class</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/validators</code></td><td>Form and environment validation utilities</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/middleware</code></td><td>Reusable Express middleware</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/security</code></td><td>JWT helpers and security utilities</td></tr>
                            <tr><td><code className="docs-code-inline">@rnb/assets</code></td><td>Brand images, icons, and static assets</td></tr>
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* ── Installation ── */}
            <Section id="installation" title="Installation">
                <H3>Prerequisites</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Tool</th><th>Version</th><th>Notes</th></tr></thead>
                        <tbody>
                            <tr><td>Node.js</td><td>≥ 20.x</td><td>LTS recommended</td></tr>
                            <tr><td>pnpm</td><td>≥ 10.18</td><td><code className="docs-code-inline">npm i -g pnpm</code></td></tr>
                            <tr><td>Git</td><td>any</td><td>—</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Clone and install</H3>
                <CodeBlock label="terminal" lang="bash">{`git clone https://github.com/your-org/realms-and-beyond.git
cd realms-and-beyond

# Install all workspace dependencies in one shot
pnpm install`}</CodeBlock>

                <Callout type="info">
                    pnpm resolves all workspace packages automatically. You do not need to
                    install packages individually per app or per package directory.
                </Callout>

                <H3>Run the full monorepo in dev mode</H3>
                <CodeBlock label="terminal" lang="bash">{`# Start every app and package in watch mode simultaneously
pnpm dev

# Or start only a specific app
pnpm --filter aetherscribe dev
pnpm --filter ui-documentation dev`}</CodeBlock>

                <H3>Build packages first (required for fresh installs)</H3>
                <CodeBlock label="terminal" lang="bash">{`# Packages must be built before apps can consume them
pnpm build:packages

# Then build everything
pnpm build`}</CodeBlock>

                <Callout type="tip">
                    Turborepo caches build outputs. Subsequent builds only rebuild what changed.
                    The cache lives at <code className="docs-code-inline">.turbo/</code> and is safe to delete.
                </Callout>
            </Section>

            {/* ── Project Structure ── */}
            <Section id="structure" title="Project Structure">
                <CodeBlock label="Monorepo tree" lang="tree">{`realms-and-beyond/
├── apps/
│   ├── aetherscribe/          # TTRPG worldbuilding app
│   ├── byte-burger/           # Food ordering platform
│   ├── nexus-serve/           # POS & employee management
│   ├── realms-and-beyond/     # Holding company landing page
│   └── ui-documentation/      # This docs site (R&B Codex)
│
├── packages/
│   ├── styles/                # @rnb/styles — design system
│   ├── ui/                    # @rnb/ui — component library
│   ├── types/                 # @rnb/types — shared TS types
│   ├── hooks/                 # @rnb/hooks — shared React hooks
│   ├── errors/                # @rnb/errors — AppError class
│   ├── validators/            # @rnb/validators — validation
│   ├── middleware/            # @rnb/middleware — Express middleware
│   ├── security/              # @rnb/security — JWT & auth utils
│   └── assets/                # @rnb/assets — brand images
│
├── servers/
│   ├── aetherscribe-api/      # Aetherscribe Express API
│   ├── nexus-serve-api/       # Nexus Serve Express API
│   └── realms-and-beyond-api/ # Base identity API
│
├── docs/                      # PDFs, concept art, design refs
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Workspace definitions
└── turbo.json                 # Turborepo task pipeline`}</CodeBlock>

                <H3>App structure (Next.js App Router)</H3>
                <P>
                    Every app uses the Next.js 16 App Router. The canonical directory layout
                    within any app is:
                </P>
                <CodeBlock label="apps/aetherscribe/" lang="tree">{`app/
├── layout.tsx          # Root layout — imports @rnb/styles ONCE here
├── page.tsx            # Root route (/)
├── (auth)/             # Route group — auth-gated pages
│   ├── layout.tsx
│   └── login/page.tsx
└── (dashboard)/        # Route group — protected hub pages
    ├── layout.tsx
    └── hub/
        ├── layout.tsx
        └── page.tsx
public/                 # Static assets specific to this app
next.config.ts
tsconfig.json
package.json`}</CodeBlock>

                <Callout type="tip">
                    Route groups using <code className="docs-code-inline">(parentheses)</code> allow
                    you to segment layouts without affecting the URL path. Use them to
                    apply different shell layouts (e.g. auth shell vs. full dashboard shell).
                </Callout>

                <H3>Package structure</H3>
                <CodeBlock label="packages/ui/" lang="tree">{`src/
├── index.ts              # Main barrel export
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── indexLayout.ts    # Layout barrel
├── utils/
│   ├── Button.tsx
│   ├── Dropdown.tsx
│   ├── EntityCard.tsx
│   ├── CartridgeCard.tsx
│   ├── ui-docs-page/     # Documentation primitives (Section, CodeBlock, etc.)
│   └── indexUtils.ts     # Utils barrel
└── context/
    ├── ThemeContext.tsx
    ├── ThemeInitializer.tsx
    ├── ThemeSwitcher.tsx
    └── indexContext.ts   # Context barrel`}</CodeBlock>
            </Section>

            {/* ── Workspace Commands ── */}
            <Section id="commands" title="Workspace Commands">
                <P>
                    All commands are run from the <strong>root</strong> of the monorepo unless
                    otherwise noted. Turborepo executes tasks in parallel across workspaces
                    respecting the dependency graph defined in <code className="docs-code-inline">turbo.json</code>.
                </P>

                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead>
                            <tr><th>Command</th><th>What it does</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">pnpm dev</code></td><td>Start all apps and packages in watch/dev mode concurrently</td></tr>
                            <tr><td><code className="docs-code-inline">pnpm build</code></td><td>Build all workspaces in topological order (packages before apps)</td></tr>
                            <tr><td><code className="docs-code-inline">pnpm build:packages</code></td><td>Build only the packages in <code className="docs-code-inline">packages/</code></td></tr>
                            <tr><td><code className="docs-code-inline">pnpm build:services</code></td><td>Build only the API servers</td></tr>
                            <tr><td><code className="docs-code-inline">pnpm lint</code></td><td>Run ESLint across all workspaces</td></tr>
                            <tr><td><code className="docs-code-inline">pnpm typecheck</code></td><td>Run <code className="docs-code-inline">tsc --noEmit</code> across all workspaces</td></tr>
                            <tr><td><code className="docs-code-inline">pnpm clean</code></td><td>Remove all <code className="docs-code-inline">dist/</code>, <code className="docs-code-inline">.next/</code>, and <code className="docs-code-inline">node_modules/.cache</code></td></tr>
                            <tr><td><code className="docs-code-inline">pnpm update:all</code></td><td>Update all dependencies across all workspaces</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Scoped commands (filter)</H3>
                <P>
                    Use the <code className="docs-code-inline">--filter</code> flag to run a command
                    against a single workspace:
                </P>
                <CodeBlock label="terminal" lang="bash">{`# Dev only the styles package
pnpm --filter @rnb/styles dev

# Build only aetherscribe
pnpm --filter aetherscribe build

# Typecheck only the UI package
pnpm --filter @rnb/ui typecheck

# Add a dependency to a specific app
pnpm --filter aetherscribe add some-package`}</CodeBlock>

                <H3>turbo.json — task pipeline</H3>
                <CodeBlock label="turbo.json" lang="json">{`{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "persistent": true
    },
    "start": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "typecheck": {}
  }
}`}</CodeBlock>

                <P>
                    The <code className="docs-code-inline">^build</code> dependency means{' '}
                    <em>&ldquo;build all packages that this workspace depends on first&rdquo;</em>.
                    This ensures <code className="docs-code-inline">@rnb/ui</code> is compiled before
                    any app that consumes it starts its dev server.
                </P>

                <Callout type="warn">
                    Always run <code className="docs-code-inline">pnpm build:packages</code> after a
                    fresh <code className="docs-code-inline">pnpm install</code>. Packages must have
                    a <code className="docs-code-inline">dist/</code> output before apps can import them.
                </Callout>
            </Section>
        </>
    )
}
