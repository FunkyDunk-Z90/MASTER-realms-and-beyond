'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, AlertTriangle, Info } from 'lucide-react'
import { CodeSnippet } from '@rnb/ui'
import ComponentShowcase from './ComponentShowcase'
import {
  NAV_SECTIONS,
  TECH_STACKS,
  PRODUCTS,
  PACKAGES,
  CONVENTIONS,
  TURBOREPO_TASKS,
} from '@/lib/data'
import { Z_SearchQuery } from '@/lib/schemas'

// ─── Search index ──────────────────────────────────────────────────────────────

interface I_SearchResult {
  title: string
  section: string
  href: string
}

const SEARCH_INDEX: I_SearchResult[] = [
  { title: 'Project Overview', section: 'Overview', href: '#overview' },
  { title: 'Products List', section: 'Overview', href: '#products' },
  { title: 'Core Philosophy / IAM', section: 'Overview', href: '#philosophy' },
  { title: 'Workspace Structure', section: 'Architecture', href: '#workspace' },
  { title: 'Turborepo Pipeline', section: 'Architecture', href: '#turborepo' },
  { title: 'Technology Stack', section: 'Stack', href: '#stack' },
  { title: 'Development Setup', section: 'Setup', href: '#setup' },
  { title: '@rnb/errors — AppError', section: 'Packages', href: '#pkg-errors' },
  { title: '@rnb/validators — Zod schemas', section: 'Packages', href: '#pkg-validators' },
  { title: '@rnb/middleware — authenticate', section: 'Packages', href: '#pkg-middleware' },
  { title: '@rnb/security — JWT & cookies', section: 'Packages', href: '#pkg-security' },
  { title: '@rnb/database — Identity model', section: 'Packages', href: '#pkg-database' },
  { title: 'Authentication & Identity', section: 'Auth', href: '#auth' },
  { title: 'API Reference', section: 'API', href: '#api' },
  { title: 'Code Conventions — Naming', section: 'Conventions', href: '#conventions' },
  { title: 'Zod Schema Conventions', section: 'Conventions', href: '#conventions' },
  { title: 'Dependency Graph', section: 'Deps', href: '#deps' },
  // UI Components
  { title: 'Button — variants, sizes, states', section: 'Components', href: '#comp-buttons' },
  { title: 'Card — dark, parchment, crimson, relic, glow, inset', section: 'Components', href: '#comp-cards' },
  { title: 'Frame / Panel / Divider / StatBlock', section: 'Components', href: '#comp-frames' },
  { title: 'Seal / Toast — badges and notifications', section: 'Components', href: '#comp-decorative' },
  { title: 'CartridgeCard — game cartridge card', section: 'Components', href: '#comp-cartridge' },
  { title: 'Dropdown — searchable, nested menus', section: 'Components', href: '#comp-dropdown' },
  { title: 'CodeSnippet — code display component', section: 'Components', href: '#comp-code-snippet' },
  { title: 'Design Tokens — CSS custom properties', section: 'Components', href: '#comp-tokens' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function Callout({ type = 'warning', children }: { type?: 'warning' | 'info' | 'danger'; children: React.ReactNode }) {
  return (
    <div className={`callout${type !== 'warning' ? ` callout--${type}` : ''}`}>
      <span className="callout-icon">
        {type === 'info' ? <Info size={14} /> : <AlertTriangle size={14} />}
      </span>
      <p className="callout-text">{children}</p>
    </div>
  )
}

function SubsectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="subsection-title">{children}</h3>
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function DevGuide() {
  const [activeSection, setActiveSection] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<I_SearchResult[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // ── Active section tracking via IntersectionObserver ──────────────────────
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') ?? '')
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // ── Search ─────────────────────────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    const parsed = Z_SearchQuery.safeParse({ query: value })
    if (!parsed.success || !value.trim()) {
      setSearchResults([])
      setSearchOpen(false)
      return
    }
    const q = value.toLowerCase()
    const results = SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q)
    ).slice(0, 6)
    setSearchResults(results)
    setSearchOpen(results.length > 0)
  }, [])

  // ── Close search on outside click ─────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Nav link helper ───────────────────────────────────────────────────────
  function navCls(id: string) {
    return `nav-link${activeSection === id ? ' active' : ''}`
  }
  function subNavCls(id: string) {
    return `sub-nav-link${activeSection === id ? ' active' : ''}`
  }

  return (
    <div className="layout">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="header">
        <div className="header-brand">
          <span className="brand-logo">
            Realms <span>&amp;</span> Beyond
          </span>
          <span className="brand-divider" />
          <span className="brand-label">Developer Guide</span>
        </div>

        <div className="header-meta">
          <span className="header-date">Updated 2026-03-15</span>
          <span className="version-badge">v1.0</span>

          <div className="search-wrapper" ref={searchRef}>
            <div className="search-bar">
              <Search size={12} />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
              />
            </div>

            {searchOpen && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((r) => (
                    <a
                      key={r.href + r.title}
                      href={r.href}
                      className="search-result-item"
                      onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    >
                      <div className="search-result-title">{r.title}</div>
                      <div className="search-result-section">{r.section}</div>
                    </a>
                  ))
                ) : (
                  <div className="search-no-results">
                    <p>No results for &ldquo;{searchQuery}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <p className="sidebar-section-title">Contents</p>
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id} className="nav-item">
              <a href={section.href} className={navCls(section.id)}>
                {section.label}
              </a>
              {section.subsections && (
                <div className="sub-nav">
                  {section.subsections.map((sub) => (
                    <a key={sub.id} href={sub.href} className={subNavCls(sub.id)}>
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="main">

        {/* Hero */}
        <div className="hero">
          <p className="hero-eyebrow">Engineering Team · Internal Documentation</p>
          <h1 className="hero-title">
            Realms <span>&amp;</span> Beyond
          </h1>
          <p className="hero-subtitle">
            // Developer Guide — v1.0 — pnpm monorepo · Next.js · Express · MongoDB
          </p>
          <div className="hero-tags">
            <span className="tag tag--primary">TypeScript 5</span>
            <span className="tag tag--primary">Next.js 14+</span>
            <span className="tag tag--primary">Express 5</span>
            <span className="tag tag--accent">Zod v4</span>
            <span className="tag tag--accent">Turborepo</span>
            <span className="tag">pnpm 9+</span>
            <span className="tag">MongoDB / Mongoose 9</span>
          </div>
        </div>

        {/* ── 1. Overview ──────────────────────────────────────────────────── */}
        <section id="overview" data-section="overview" className="section">
          <div className="section-header">
            <span className="section-number">01</span>
            <h2 className="section-title">Project Overview</h2>
          </div>
          <div className="section-body">
            <div className="prose">
              <p>
                <strong>Realms &amp; Beyond</strong> is a multi-application platform built as a pnpm monorepo.
                It hosts several distinct products that share a single Identity and Access Management (IAM) system,
                a unified design language, and a set of reusable backend packages.
              </p>
            </div>

            {/* Products */}
            <div id="products" data-section="products" className="subsection">
              <SubsectionTitle>Products</SubsectionTitle>
              <div className="products-grid">
                {PRODUCTS.map((p) => (
                  <div key={p.name} className="product-card">
                    <span className="product-icon">{p.icon}</span>
                    <p className="product-name">{p.name}</p>
                    <p className="product-type">{p.type}</p>
                    <p className="product-purpose">{p.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div id="philosophy" data-section="philosophy" className="subsection">
              <SubsectionTitle>Core Philosophy</SubsectionTitle>
              <div className="prose">
                <p>
                  Every product authenticates through a single <span className="ic">realms-and-beyond-api</span> IAM server.
                  Once authenticated, users are linked to product-specific accounts stored in that product&apos;s own API server.
                  The <span className="ic">Identity</span> document in MongoDB is the canonical source of truth for who a user is;
                  each product appends a <span className="ic">linkedService</span> entry when a product account is created.
                </p>
              </div>
              <Callout type="info">
                Adding a new product requires only registering a new serviceName, creating a product model, and building a product API. The auth system is never duplicated.
              </Callout>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 2. Architecture ──────────────────────────────────────────────── */}
        <section id="architecture" data-section="architecture" className="section">
          <div className="section-header">
            <span className="section-number">02</span>
            <h2 className="section-title">Monorepo Architecture</h2>
          </div>
          <div className="section-body">

            <div id="workspace" data-section="workspace" className="subsection">
              <SubsectionTitle>Workspace Structure</SubsectionTitle>
              <CodeSnippet lang="bash" filename="realms-and-beyond/" code={`
realms-and-beyond/
├── apps/                        # Next.js frontend applications
│   ├── aetherscribe/            # RPG worldbuilding app
│   ├── byte-burger/             # Food ordering app
│   ├── nexus-serve/             # POS/management app
│   ├── realms-and-beyond/       # Platform portal
│   └── ui-documentation/        # Design system docs
│
├── packages/                    # Shared libraries
│   ├── assets/                  # @rnb/assets  — SVG icon components
│   ├── database/                # @rnb/database — Mongoose models
│   ├── errors/                  # @rnb/errors   — AppError class
│   ├── middleware/              # @rnb/middleware — Express middleware
│   ├── security/                # @rnb/security — JWT, cookies, tokens
│   ├── styles/                  # @rnb/styles   — SCSS design system
│   ├── types/                   # @rnb/types    — TypeScript types
│   ├── ui/                      # @rnb/ui       — React components
│   └── validators/              # @rnb/validators — Zod schemas
│
├── servers/                     # Express backend API servers
│   ├── realms-and-beyond-api/   # IAM server (auth, identity)
│   ├── aetherscribe-api/        # Aetherscribe domain server
│   └── nexus-serve-api/         # NexusServe domain server
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
              `} />
              <div className="prose">
                <p>
                  All packages within these paths are resolvable via their <span className="ic">name</span> field
                  using <span className="ic">workspace:*</span> as the version specifier.
                </p>
              </div>
            </div>

            <div id="turborepo" data-section="turborepo" className="subsection">
              <SubsectionTitle>Turborepo Pipeline</SubsectionTitle>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Behaviour</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TURBOREPO_TASKS.map((t) => (
                      <tr key={t.task}>
                        <td className="td-primary">{t.task}</td>
                        <td>{t.behaviour}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout type="info">
                The ^build syntax means &ldquo;all packages I depend on must finish building before this task runs.&rdquo; Apps import packages via TypeScript source files, and the TS compiler resolves them through the exports field.
              </Callout>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 3. Tech Stack ────────────────────────────────────────────────── */}
        <section id="stack" data-section="stack" className="section">
          <div className="section-header">
            <span className="section-number">03</span>
            <h2 className="section-title">Technology Stack</h2>
          </div>
          <div className="section-body">
            <div className="stack-groups">
              {TECH_STACKS.map((group) => (
                <div key={group.label} className="stack-group">
                  <p className="stack-group-header">{group.label}</p>
                  {group.entries.map((entry) => (
                    <div key={entry.concern} className="stack-row">
                      <span className="stack-concern">{entry.concern}</span>
                      <span className="stack-tech">{entry.technology}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 4. Dev Setup ─────────────────────────────────────────────────── */}
        <section id="setup" data-section="setup" className="section">
          <div className="section-header">
            <span className="section-number">04</span>
            <h2 className="section-title">Development Setup</h2>
          </div>
          <div className="section-body">
            <div className="subsection">
              <SubsectionTitle>Prerequisites</SubsectionTitle>
              <div className="prose">
                <p>Node.js 20+, pnpm 9+ (<span className="ic">npm install -g pnpm</span>), and a MongoDB instance (local or Atlas).</p>
              </div>
            </div>

            <div className="subsection">
              <SubsectionTitle>Installation &amp; Running</SubsectionTitle>
              <CodeSnippet lang="bash" code={`
# Clone and install
git clone <repo-url>
cd realms-and-beyond
pnpm install

# Copy environment files
cp servers/realms-and-beyond-api/.env.example servers/realms-and-beyond-api/.env
cp servers/aetherscribe-api/.env.example servers/aetherscribe-api/.env

# Run everything in parallel
pnpm dev

# Run a specific workspace
pnpm --filter @rnb/realms-api dev
pnpm --filter @aetherscribe/app dev

# Build all
pnpm build

# Type check
pnpm typecheck
              `} />
            </div>

            <div className="subsection">
              <SubsectionTitle>Frontend .env.local</SubsectionTitle>
              <CodeSnippet lang="bash" filename="apps/aetherscribe/.env.local" code={`
NEXT_PUBLIC_API_URL=http://localhost:2611
NEXT_PUBLIC_AETHERSCRIBE_API_URL=http://localhost:2612
              `} />
              <Callout>
                Never put secrets in NEXT_PUBLIC_ variables. These are injected at build time and exposed to the browser.
              </Callout>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── 5–11. Packages ───────────────────────────────────────────────── */}
        <section id="packages" data-section="packages" className="section">
          <div className="section-header">
            <span className="section-number">05–11</span>
            <h2 className="section-title">Packages</h2>
          </div>
          <div className="section-body">
            <div className="packages-list">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  id={`pkg-${pkg.name.replace('@rnb/', '')}`}
                  data-section={`pkg-${pkg.name.replace('@rnb/', '')}`}
                  className="package-card"
                >
                  <div className="package-header">
                    <span className="package-name">{pkg.name}</span>
                    <span className="package-path">{pkg.path}</span>
                  </div>
                  <div className="package-body">
                    <p className="package-description">{pkg.description}</p>
                    <div className="package-meta">
                      <span className="package-meta-label">Consumed by:</span>
                      <span className="ic" style={{ fontSize: '0.72rem' }}>{pkg.consumedBy}</span>
                    </div>
                    {pkg.exports && (
                      <div className="package-meta">
                        <span className="package-meta-label">Exports:</span>
                        <div className="package-exports">
                          {pkg.exports.map((exp) => (
                            <span key={exp} className="export-badge">{exp}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* AppError example */}
            <div className="subsection">
              <SubsectionTitle>AppError Usage</SubsectionTitle>
              <CodeSnippet lang="typescript" filename="packages/errors/src/AppError.ts" code={`
class AppError extends Error {
  public statusCode: number   // HTTP status code (400, 401, 403, 404…)
  public status: string       // 'fail' for 4xx, 'error' for 5xx
  public isOperational: boolean
  public field?: string       // Which field caused the error (for forms)
}

// Simple error
throw new AppError('Email already in use.', 409)

// With field hint — frontend highlights the offending input
throw new AppError('Invalid email format.', 400, 'email')
              `} />
            </div>

            {/* Zod conventions */}
            <div className="subsection">
              <SubsectionTitle>Zod Schema Conventions</SubsectionTitle>
              <CodeSnippet lang="typescript" filename="packages/validators/src/zod/zod.example.ts" code={`
import { z } from 'zod'

// All schemas exported as Z_* named exports
export const Z_SetPassword = z.object({
  plaintext: z.string().min(8).max(128),
})

// Inferred type exported immediately after
export type T_SetPassword = z.infer<typeof Z_SetPassword>

// Zod v4 syntax — NOT z.string().email()
export const Z_Register = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
})

// Use .safeParse() in controllers
const result = Z_Register.safeParse(req.body)
if (!result.success) throw new AppError('Invalid input.', 400)

// Use z.iso.datetime() for ISO strings — Zod v4 syntax
export const Z_Timestamp = z.iso.datetime()
              `} />
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── Auth & Identity ──────────────────────────────────────────────── */}
        <section id="auth" data-section="auth" className="section">
          <div className="section-header">
            <span className="section-number">20</span>
            <h2 className="section-title">Authentication &amp; Identity</h2>
          </div>
          <div className="section-body">
            <div className="prose">
              <p>
                All auth flows go through the <span className="ic">realms-and-beyond-api</span> IAM server.
                JWT tokens are signed with HS256, stored in httpOnly cookies, and verified by the
                <span className="ic"> authenticate</span> middleware in every protected route.
              </p>
            </div>

            <div className="subsection">
              <SubsectionTitle>Login Flow</SubsectionTitle>
              <div className="auth-flow">
                {[
                  { n: '01', title: 'POST /api/v1/auth/login', desc: 'Client sends email + password. Controller calls Z_Login.safeParse().' },
                  { n: '02', title: 'Email lookup', desc: 'Identity.findOne({ email }). Returns "Invalid email or password" for both missing email and wrong password — prevents user enumeration.' },
                  { n: '03', title: 'verifyPassword()', desc: 'bcrypt.compare(plaintext, hash). Timing-safe via bcrypt internals.' },
                  { n: '04', title: 'setAuthCookie()', desc: 'Creates HS256 JWT (sub: identityId, 7d expiry), sets httpOnly + SameSite=Strict cookie.' },
                  { n: '05', title: 'toClient() serialisation', desc: 'Strips all sensitive fields (password hash, tokens, IPs) before sending the Identity document to the client.' },
                ].map((step) => (
                  <div key={step.n} className="flow-step">
                    <span className="flow-step-number">{step.n}</span>
                    <div className="flow-step-content">
                      <span className="flow-step-title">{step.title}</span>
                      <span className="flow-step-desc">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="subsection">
              <SubsectionTitle>Cookie Configuration</SubsectionTitle>
              <CodeSnippet lang="typescript" code={`
setAuthCookie(res, identity._id.toString(), env.JWT_SECRET, isDev)

// Cookie properties
{
  httpOnly: true,          // Not accessible from JavaScript
  secure: !isDev,          // HTTPS-only in production
  sameSite: 'strict',      // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
}

// Critical: isDev must be true in development — localhost
// serves over HTTP. secure:true in dev silently drops the cookie.
              `} />
            </div>

            <Callout type="danger">
              JWT_SECRET must be identical across all servers. If secrets differ, token verification in aetherscribe-api will fail with 401 on all requests.
            </Callout>

            <div className="subsection">
              <SubsectionTitle>Token Utilities</SubsectionTitle>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Function</th><th>Signature</th><th>Purpose</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { fn: 'hashToken', sig: '(string) => string', desc: 'SHA-256 hash a raw token before DB storage' },
                      { fn: 'generateSecureToken', sig: '() => string', desc: '64-char cryptographically secure hex token' },
                      { fn: 'safeCompareTokens', sig: '(string, string) => boolean', desc: 'Constant-time comparison — prevents timing attacks' },
                      { fn: 'hoursFromNow', sig: '(number) => string', desc: 'ISO datetime n hours in the future' },
                      { fn: 'daysFromNow', sig: '(number) => string', desc: 'ISO datetime n days in the future' },
                    ].map((row) => (
                      <tr key={row.fn}>
                        <td className="td-primary">{row.fn}</td>
                        <td className="td-accent">{row.sig}</td>
                        <td>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── API Reference ────────────────────────────────────────────────── */}
        <section id="api" data-section="api" className="section">
          <div className="section-header">
            <span className="section-number">22</span>
            <h2 className="section-title">API Reference</h2>
          </div>
          <div className="section-body">
            <div className="subsection">
              <SubsectionTitle>realms-and-beyond-api — Identity Routes</SubsectionTitle>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Method</th><th>Route</th><th>Auth</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { method: 'POST', route: '/api/v1/auth/register', auth: 'None', desc: 'Create a new Identity' },
                      { method: 'POST', route: '/api/v1/auth/login', auth: 'None', desc: 'Authenticate and set auth cookie' },
                      { method: 'POST', route: '/api/v1/auth/logout', auth: 'Cookie', desc: 'Clear the auth cookie' },
                      { method: 'GET', route: '/api/v1/auth/me', auth: 'Cookie', desc: 'Get current authenticated Identity' },
                      { method: 'PATCH', route: '/api/v1/auth/update-password', auth: 'Cookie', desc: 'Change password (requires currentPassword)' },
                      { method: 'POST', route: '/api/v1/auth/forgot-password', auth: 'None', desc: 'Send password reset email' },
                      { method: 'PATCH', route: '/api/v1/auth/reset-password/:token', auth: 'None', desc: 'Reset password with token' },
                      { method: 'GET', route: '/api/v1/auth/verify-email/:token', auth: 'None', desc: 'Verify email address' },
                    ].map((row) => (
                      <tr key={row.route}>
                        <td className="td-accent">{row.method}</td>
                        <td className="td-primary">{row.route}</td>
                        <td className="td-muted">{row.auth}</td>
                        <td>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="subsection">
              <SubsectionTitle>Error Response Shape</SubsectionTitle>
              <CodeSnippet lang="json" code={`
{
  "status": "fail",
  "message": "An account with this email already exists.",
  "field": "email"
}

// field is only present when supplied.
// Frontends use this to set per-field error state in forms.
// 5xx responses always return a generic message — never internal details.
              `} />
            </div>

            <div className="subsection">
              <SubsectionTitle>CRUD Handler Factories</SubsectionTitle>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Factory</th><th>HTTP</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { f: 'createOne(Model)', http: 'POST', desc: 'Create a new document' },
                      { f: 'getAll(Model)', http: 'GET', desc: 'Get all documents (with optional filter)' },
                      { f: 'getOne(Model)', http: 'GET', desc: 'Get document by req.params.id' },
                      { f: 'updateOne(Model)', http: 'PATCH', desc: 'Update document by req.params.id' },
                      { f: 'updateMany(Model)', http: 'PATCH', desc: 'Bulk update' },
                      { f: 'deleteOne(Model)', http: 'DELETE', desc: 'Hard delete by req.params.id' },
                    ].map((row) => (
                      <tr key={row.f}>
                        <td className="td-primary">{row.f}</td>
                        <td className="td-accent">{row.http}</td>
                        <td>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── Conventions ──────────────────────────────────────────────────── */}
        <section id="conventions" data-section="conventions" className="section">
          <div className="section-header">
            <span className="section-number">27</span>
            <h2 className="section-title">Code Conventions</h2>
          </div>
          <div className="section-body">
            <div className="subsection">
              <SubsectionTitle>Naming Conventions</SubsectionTitle>
              <div className="conventions-grid">
                {CONVENTIONS.map((c) => (
                  <div key={c.type} className="convention-card">
                    <span className="convention-type">{c.type}</span>
                    <span className="convention-rule">{c.convention}</span>
                    <span className="convention-example">{c.example}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="subsection">
              <SubsectionTitle>Error Handling Rules</SubsectionTitle>
              <div className="prose">
                <p>
                  Controllers always use <span className="ic">catchAsync</span>. Throw <span className="ic">AppError</span> for
                  expected failures. Never <span className="ic">try/catch</span> in a controller unless recovering from a specific error.
                  Login failures always return &ldquo;Invalid email or password&rdquo; regardless of whether the email was found — prevents user enumeration attacks.
                </p>
              </div>
            </div>

            <div className="subsection">
              <SubsectionTitle>SCSS Rules</SubsectionTitle>
              <div className="prose">
                <p>
                  Every component SCSS file starts with <span className="ic">@use &apos;../../../_variables&apos; as *</span> and
                  <span className="ic"> @use &apos;../../../_mixins&apos; as *</span>.
                  Never hardcode colour values — always use CSS custom properties for theme-sensitive values
                  and SCSS variables for structural values. BEM methodology for complex components.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── UI Components ────────────────────────────────────────────────── */}
        <section id="components" data-section="components" className="section">
          <div className="section-header">
            <span className="section-number">29</span>
            <h2 className="section-title">UI Components</h2>
          </div>
          <div className="section-body">
            <div className="prose">
              <p>
                Every UI primitive from <span className="ic">@rnb/ui</span> shown in all available states and variants.
                Import components directly — styles are provided automatically by <span className="ic">@rnb/styles</span> via the global stylesheet imported in <span className="ic">layout.tsx</span>.
                No additional CSS imports required per-component.
              </p>
            </div>
            <ComponentShowcase />
          </div>
        </section>

        <hr className="section-divider" />

        {/* ── Dependency Graph ─────────────────────────────────────────────── */}
        <section id="deps" data-section="deps" className="section">
          <div className="section-header">
            <span className="section-number">28</span>
            <h2 className="section-title">Dependency Graph</h2>
          </div>
          <div className="section-body">
            <div className="dep-graph">
              <pre><code>{`
                      ┌───────────────┐
                      │  @rnb/errors  │
                      └───────┬───────┘
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
  ┌─────────▼────────┐               ┌──────────▼────────┐
  │ @rnb/validators  │               │  @rnb/middleware  │
  └─────────┬────────┘               └──────────┬────────┘
            │                                   │
            │    ┌──────────────────────────────┘
            │    │
  ┌─────────▼────▼───┐
  │  @rnb/security   │
  └─────────┬────────┘
            │
            │    ┌─────────────────┐
            │    │  @rnb/database  │──── @rnb/validators
            │    │                 │──── @rnb/middleware
            └────┤                 │
                 └────────┬────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
realms-and-        aetherscribe-      nexus-serve-
beyond-api             api               api
                        │
        ┌───────────────────────────────────────┐
        │  @rnb/styles  │  @rnb/ui  │ @rnb/assets │
        └───────────────────────────────────────┘
                        │
        ┌───────────────┼────────────────────┐
        ▼               ▼                    ▼
  aetherscribe     byte-burger          nexus-serve
     (app)           (app)               (app)
              `}</code></pre>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Rule</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {[
                    { rule: '@rnb/errors has no dependencies', details: 'It is the foundation — imports nothing from this monorepo' },
                    { rule: 'No circular dependencies', details: 'No package may import from a package higher in the graph than itself' },
                    { rule: 'Frontend packages are app-only', details: '@rnb/ui, @rnb/styles, @rnb/assets are never consumed by servers' },
                    { rule: 'Shared JWT secret', details: 'JWT_SECRET must be identical across all servers for cross-service auth to work' },
                  ].map((row) => (
                    <tr key={row.rule}>
                      <td className="td-primary">{row.rule}</td>
                      <td>{row.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted-color)', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>
            Realms &amp; Beyond — Developer Guide v1.0 · Engineering Team · 2026-03-15
          </p>
        </footer>

      </main>
    </div>
  )
}
