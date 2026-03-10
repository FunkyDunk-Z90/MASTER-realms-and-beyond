import { Section, H3, P, CodeBlock, Callout } from '@rnb/ui'

export default function ContributingPage() {
    return (
        <>
            <div className="docs-hero">
                <p className="docs-eyebrow">Contributing</p>
                <h1 className="docs-h1">Contributor Guide</h1>
                <p className="docs-hero-sub">
                    Welcome to the team. This guide covers the conventions, patterns, and
                    workflows you need to know to contribute confidently to the Realms &amp; Beyond
                    monorepo. Read it before opening your first PR.
                </p>
            </div>

            {/* ── Code Standards ── */}
            <Section id="standards" title="Code Standards">
                <H3>TypeScript</H3>
                <P>
                    All TypeScript must be strict — we target{' '}
                    <code className="docs-code-inline">&quot;strict&quot;: true</code> in every{' '}
                    <code className="docs-code-inline">tsconfig.json</code>. Never use{' '}
                    <code className="docs-code-inline">any</code> in production code. If a type is
                    genuinely unknown, use <code className="docs-code-inline">unknown</code> and
                    narrow it explicitly.
                </P>

                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Convention</th><th>Pattern</th><th>Example</th></tr></thead>
                        <tbody>
                            <tr><td>Interfaces</td><td><code className="docs-code-inline">I_</code> prefix</td><td><code className="docs-code-inline">I_UserProps</code></td></tr>
                            <tr><td>Types / unions</td><td><code className="docs-code-inline">T_</code> prefix</td><td><code className="docs-code-inline">T_ThemeName</code></td></tr>
                            <tr><td>Enums</td><td><code className="docs-code-inline">E_</code> prefix</td><td><code className="docs-code-inline">E_UserRole</code></td></tr>
                            <tr><td>React components</td><td>PascalCase</td><td><code className="docs-code-inline">CartridgeCard</code></td></tr>
                            <tr><td>Hooks</td><td><code className="docs-code-inline">use</code> prefix, camelCase</td><td><code className="docs-code-inline">useFetch</code></td></tr>
                            <tr><td>Files (components)</td><td>PascalCase</td><td><code className="docs-code-inline">CartridgeCard.tsx</code></td></tr>
                            <tr><td>Files (utilities)</td><td>camelCase</td><td><code className="docs-code-inline">formatDate.ts</code></td></tr>
                            <tr><td>SCSS files</td><td>camelCase</td><td><code className="docs-code-inline">cartridgeCard.scss</code></td></tr>
                            <tr><td>CSS classes</td><td>kebab-case BEM</td><td><code className="docs-code-inline">.cartridge-card__label</code></td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Component rules</H3>
                <CodeBlock label="Component conventions" lang="tsx">{`// ✓ Props interface above the component, prefixed I_
interface I_MyComponentProps {
    label: string
    onClick?: () => void
    className?: string      // always optional className for flexibility
}

// ✓ Named export (not default) for all utility components
export const MyComponent = ({ label, onClick, className = '' }: I_MyComponentProps) => {
    return (
        <button
            className={\`my-component\${className ? ' ' + className : ''}\`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

// ✓ Default export for page components (Next.js convention)
export default function MyPage() {
    return <div />
}`}</CodeBlock>

                <H3>'use client' directive</H3>
                <P>
                    Do not add <code className="docs-code-inline">&apos;use client&apos;</code> unless
                    the component genuinely requires it. Client components cannot be rendered
                    on the server, which increases bundle size and prevents streaming. You
                    need it when the component uses:
                </P>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Requires client</th><th>Server component safe</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">useState</code>, <code className="docs-code-inline">useEffect</code>, <code className="docs-code-inline">useRef</code></td><td>Pure JSX / layout</td></tr>
                            <tr><td><code className="docs-code-inline">usePathname</code>, <code className="docs-code-inline">useRouter</code></td><td>Async data fetching (await fetch)</td></tr>
                            <tr><td>Event handlers (onClick, onChange)</td><td>Server actions</td></tr>
                            <tr><td>Browser APIs (localStorage, document)</td><td>Static content</td></tr>
                            <tr><td>Context consumers</td><td>Context providers (server-rendered)</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>SCSS conventions</H3>
                <CodeBlock label="DO and DON'T" lang="scss">{`// ✓ DO — use CSS custom properties for all colours
.my-component {
    background-color: var(--bg-surface-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

// ✗ DON'T — hardcode colours
.my-component {
    background-color: #1a1a1a;     // breaks theme switching
    color: white;                   // not accessible in light mode
    border: 1px solid #333;
}

// ✓ DO — use SCSS variables for spacing and radius
.my-component {
    padding: $medium $large;
    border-radius: $border-radius;
}

// ✓ DO — always import at the top of component SCSS files
@use '../../../_variables' as *;
@use '../../../_mixins' as *;`}</CodeBlock>

                <H3>Prettier</H3>
                <P>
                    Code formatting is enforced with Prettier at the root. Run the formatter
                    before committing:
                </P>
                <CodeBlock label="terminal" lang="bash">{`# Format all files
pnpm prettier --write .

# Check formatting without writing
pnpm prettier --check .`}</CodeBlock>
            </Section>

            {/* ── Adding a Package ── */}
            <Section id="packages" title="Adding a Package">
                <P>
                    When shared logic is needed across multiple apps or packages, extract it
                    into a new workspace package. Follow this process exactly.
                </P>

                <H3>1. Scaffold the package</H3>
                <CodeBlock label="terminal" lang="bash">{`# Create the directory structure
mkdir -p packages/my-package/src
cd packages/my-package

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@rnb/my-package",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@rnb/errors": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
EOF`}</CodeBlock>

                <H3>2. Create tsconfig.json</H3>
                <CodeBlock label="packages/my-package/tsconfig.json" lang="json">{`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`}</CodeBlock>

                <H3>3. Write the package entry point</H3>
                <CodeBlock label="packages/my-package/src/index.ts" lang="ts">{`// Export everything from your package here
export * from './myUtility'
export * from './myClass'`}</CodeBlock>

                <H3>4. Install from root</H3>
                <CodeBlock label="terminal" lang="bash">{`# From the monorepo root — pnpm links the package
pnpm install`}</CodeBlock>

                <H3>5. Add to consuming packages/apps</H3>
                <CodeBlock label="apps/aetherscribe/package.json" lang="json">{`{
  "dependencies": {
    "@rnb/my-package": "workspace:*"
  }
}`}</CodeBlock>
                <CodeBlock label="terminal" lang="bash">{`pnpm install`}</CodeBlock>

                <H3>6. Build before use</H3>
                <CodeBlock label="terminal" lang="bash">{`pnpm --filter @rnb/my-package build
# or rebuild all packages:
pnpm build:packages`}</CodeBlock>

                <Callout type="warn">
                    The package <strong>must have a built <code className="docs-code-inline">dist/</code></strong>{' '}
                    before any consumer can import it. If you see a &ldquo;Cannot find module&rdquo; error,
                    the package likely hasn&apos;t been built yet.
                </Callout>
            </Section>

            {/* ── Git Workflow ── */}
            <Section id="git" title="Git Workflow">
                <H3>Branch naming</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Type</th><th>Pattern</th><th>Example</th></tr></thead>
                        <tbody>
                            <tr><td>Feature</td><td><code className="docs-code-inline">feat/short-description</code></td><td><code className="docs-code-inline">feat/cartridge-card</code></td></tr>
                            <tr><td>Bug fix</td><td><code className="docs-code-inline">fix/short-description</code></td><td><code className="docs-code-inline">fix/sidebar-active-state</code></td></tr>
                            <tr><td>Design</td><td><code className="docs-code-inline">ds/short-description</code></td><td><code className="docs-code-inline">ds/folder-restructure</code></td></tr>
                            <tr><td>Docs</td><td><code className="docs-code-inline">docs/short-description</code></td><td><code className="docs-code-inline">docs/codex-overhaul</code></td></tr>
                            <tr><td>Refactor</td><td><code className="docs-code-inline">refactor/short-description</code></td><td><code className="docs-code-inline">refactor/theme-context</code></td></tr>
                            <tr><td>Chore</td><td><code className="docs-code-inline">chore/short-description</code></td><td><code className="docs-code-inline">chore/update-deps</code></td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Commit conventions</H3>
                <P>
                    We follow a conventional commit-like format. Keep the subject under 72 characters,
                    imperative mood, no trailing period.
                </P>
                <CodeBlock label="Format" lang="text">{`<type>: <short summary>

[Optional longer body explaining the why, not the what]
[One blank line between subject and body]`}</CodeBlock>

                <CodeBlock label="Examples" lang="text">{`feat: add CartridgeCard component to @rnb/ui
fix: prevent FOUC on ThemeInitializer in production
ds: add SNES and N64 themes to @rnb/styles
refactor: simplify Sidebar active state detection
docs: overhaul R&B Codex — multi-page monorepo docs
chore: update pnpm to 10.18.2`}</CodeBlock>

                <H3>Daily workflow</H3>
                <CodeBlock label="terminal" lang="bash">{`# 1. Pull latest main
git checkout main
git pull origin main

# 2. Create your branch
git checkout -b feat/my-feature

# 3. Work — build packages after changes to shared code
pnpm build:packages

# 4. Typecheck and lint before committing
pnpm typecheck
pnpm lint

# 5. Stage and commit
git add packages/ui/src/utils/MyComponent.tsx
git add packages/styles/components/ui/util/myComponent.scss
git commit -m "feat: add MyComponent to @rnb/ui"

# 6. Push and open a PR
git push -u origin feat/my-feature`}</CodeBlock>

                <Callout type="tip">
                    Stage specific files — not <code className="docs-code-inline">git add .</code>.
                    This prevents accidentally committing <code className="docs-code-inline">.env</code>{' '}
                    files, build artifacts, or unrelated changes from sneaking into your commit.
                </Callout>
            </Section>

            {/* ── Pull Requests ── */}
            <Section id="prs" title="Pull Requests">
                <H3>PR checklist before requesting review</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Check</th><th>Command</th></tr></thead>
                        <tbody>
                            <tr><td>Packages build cleanly</td><td><code className="docs-code-inline">pnpm build:packages</code></td></tr>
                            <tr><td>No TypeScript errors</td><td><code className="docs-code-inline">pnpm typecheck</code></td></tr>
                            <tr><td>No lint errors</td><td><code className="docs-code-inline">pnpm lint</code></td></tr>
                            <tr><td>Dev server starts</td><td><code className="docs-code-inline">pnpm dev</code></td></tr>
                            <tr><td>Theme switching works</td><td>Manual — toggle through all themes</td></tr>
                            <tr><td>Responsive layout intact</td><td>Manual — check mobile breakpoints</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>PR description template</H3>
                <CodeBlock label="PR body" lang="markdown">{`## Summary
- Brief bullet points describing what changed and why

## Scope
- Which packages/apps were modified
- Any breaking changes

## Test plan
- [ ] Packages build: pnpm build:packages
- [ ] TypeScript: pnpm typecheck
- [ ] Lint: pnpm lint
- [ ] Visual check: dev server running, no layout breaks
- [ ] Theme check: tested in arcade + parchment (dark + light)`}</CodeBlock>

                <H3>Review etiquette</H3>
                <P>
                    Keep PRs focused — one feature or fix per PR. If you&apos;re touching more
                    than three packages, consider splitting into separate PRs. Review comments
                    should be actionable and specific. Resolve all conversations before merging.
                    Squash merge to keep the main branch history clean.
                </P>

                <Callout type="warn">
                    Never force push to <code className="docs-code-inline">main</code>. If the branch
                    is behind, rebase onto main locally:{' '}
                    <code className="docs-code-inline">git rebase origin/main</code>, resolve any
                    conflicts, then push normally.
                </Callout>
            </Section>
        </>
    )
}
