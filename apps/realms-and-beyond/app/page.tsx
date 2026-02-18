'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'server' | 'app' | 'pkg'
type CalloutVariant = 'warn' | 'info' | 'tip'
type BranchVariant = 'main' | 'publish' | 'dev'

interface CardData {
    name: string
    badge: BadgeVariant
    desc: string
    path: string
}

interface EnvVar {
    key: string
    value: string
    note?: string
}

interface EnvGroup {
    label: string
    vars: EnvVar[]
}

interface CommandRow {
    cmd: string
    where: string
    desc: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const servers: CardData[] = [
    {
        name: 'realms-and-beyond-api',
        badge: 'server',
        desc: 'The base account API for all subsidiaries — analogous to a Google account. Handles top-level authentication, identity, and cross-subsidiary user management.',
        path: 'servers/realms-and-beyond-api/',
    },
    {
        name: 'nexus-serve-api',
        badge: 'server',
        desc: 'The POS and employee management system API. Powers the Nexus Serve frontend with order processing, staff management, and operational data.',
        path: 'servers/nexus-serve-api/',
    },
    {
        name: 'aetherscribe-api',
        badge: 'server',
        desc: 'The TTRPG content creation API. Serves the Aetherscribe app with content management, user-generated data, and media handling via Cloudinary.',
        path: 'servers/aetherscribe-api/',
    },
]

const apps: CardData[] = [
    {
        name: 'realms-and-beyond',
        badge: 'app',
        desc: 'The public-facing landing page for the holding company. Showcases all subsidiaries and highlights new and upcoming projects.',
        path: 'apps/realms-and-beyond/',
    },
    {
        name: 'aetherscribe',
        badge: 'app',
        desc: 'TTRPG content creation platform. Connects to aetherscribe-api. Allows users to create, manage, and publish tabletop RPG content.',
        path: 'apps/aetherscribe/',
    },
    {
        name: 'nexus-serve',
        badge: 'app',
        desc: 'POS and employee management dashboard. Connects to nexus-serve-api. Handles orders, staff scheduling, and operational workflows.',
        path: 'apps/nexus-serve/',
    },
    {
        name: 'byte-burger',
        badge: 'app',
        desc: 'Public website for the Byte Burger bistro. Displays the menu, restaurant info, and branding. Connects to realms-and-beyond-api.',
        path: 'apps/byte-burger/',
    },
    {
        name: 'ui-documentation',
        badge: 'app',
        desc: 'Reference app for all shared UI components from packages/ui. Covers usage examples, props, and design guidelines. No API connection.',
        path: 'apps/ui-documentation/',
    },
    {
        name: 'package-documentation',
        badge: 'app',
        desc: 'Reference app for all internal packages — what each exports, how to use them, and any conventions. No API connection.',
        path: 'apps/package-documentation/',
    },
]

const packages: CardData[] = [
    {
        name: 'assets',
        badge: 'pkg',
        desc: 'Global brand assets — images, icons, fonts, and media shared across all apps.',
        path: 'packages/assets/',
    },
    {
        name: 'errors',
        badge: 'pkg',
        desc: 'Unified global error handling. Consistent error classes, messages, and response formatting across all servers and apps.',
        path: 'packages/errors/',
    },
    {
        name: 'middleware',
        badge: 'pkg',
        desc: 'Reusable Express middleware. Request formatting, response helpers, and server action utilities shared across all API servers.',
        path: 'packages/middleware/',
    },
    {
        name: 'security',
        badge: 'pkg',
        desc: 'Global security utilities for server and frontend. Covers auth guards, input sanitisation, and header policies.',
        path: 'packages/security/',
    },
    {
        name: 'styles',
        badge: 'pkg',
        desc: 'SCSS stylesheets shared across all apps. Design tokens, typography, spacing, and theming under the R&B brand.',
        path: 'packages/styles/',
    },
    {
        name: 'types',
        badge: 'pkg',
        desc: 'All global TypeScript types and interfaces reused throughout the monorepo. Single source of truth for shared data shapes.',
        path: 'packages/types/',
    },
    {
        name: 'ui',
        badge: 'pkg',
        desc: 'Shared Next.js component library. Dynamic, reusable components for all apps — no external component library needed.',
        path: 'packages/ui/',
    },
    {
        name: 'validators',
        badge: 'pkg',
        desc: 'Form validation and data comparison utilities. Also contains src/env.ts — the single source of truth for all environment variables.',
        path: 'packages/validators/',
    },
]

const backendEnvGroups: EnvGroup[] = [
    {
        label: 'Application',
        vars: [
            {
                key: 'NODE_ENV',
                value: 'development',
                note: 'development | production | test',
            },
            { key: 'PORT', value: '8000', note: 'default: 8000' },
        ],
    },
    {
        label: 'Database',
        vars: [
            { key: 'DATABASE', value: 'your_mongodb_connection_string' },
            { key: 'DATABASE_PASSWORD', value: 'your_db_password' },
        ],
    },
    {
        label: 'Authentication (JWT)',
        vars: [
            { key: 'JWT_SECRET', value: 'your_jwt_secret' },
            { key: 'JWT_COOKIE_SECRET', value: 'your_jwt_cookie_secret' },
            { key: 'JWT_EXPIRES_IN', value: '7d' },
            { key: 'JWT_COOKIE_EXPIRES_IN', value: '7' },
        ],
    },
    {
        label: 'Cloudinary',
        vars: [
            { key: 'CLOUDINARY_NAME', value: 'your_cloud_name' },
            { key: 'CLOUDINARY_API_KEY', value: 'your_api_key' },
            { key: 'CLOUDINARY_SECRET', value: 'your_api_secret' },
            {
                key: 'CLOUDINARY_URL',
                value: 'cloudinary://api_key:secret@cloud_name',
            },
            {
                key: 'USER_DEFAULT_AVATAR',
                value: 'https://res.cloudinary.com/.../default.png',
            },
        ],
    },
    {
        label: 'Email',
        vars: [
            { key: 'RESEND_API_KEY', value: 're_your_resend_key' },
            { key: 'MAILTRAP_HOST', value: 'smtp.mailtrap.io' },
            { key: 'MAILTRAP_PORT', value: '2525' },
            { key: 'MAILTRAP_USERNAME', value: 'your_mailtrap_username' },
            { key: 'MAILTRAP_PASSWORD', value: 'your_mailtrap_password' },
        ],
    },
]

const frontendEnvGroups: EnvGroup[] = [
    {
        label: 'API Base URLs',
        vars: [
            {
                key: 'NEXT_PUBLIC_BASE_API_URL',
                value: 'http://localhost:8000/api/v1/',
                note: 'realms-and-beyond-api',
            },
            {
                key: 'NEXT_PUBLIC_NEXUS_API_URL',
                value: 'http://localhost:8001/api/v1/',
                note: 'nexus-serve-api',
            },
            {
                key: 'NEXT_PUBLIC_AETHERSCRIBE_API_URL',
                value: 'http://localhost:8002/api/v1/',
                note: 'aetherscribe-api',
            },
        ],
    },
    {
        label: 'Cloudinary',
        vars: [
            {
                key: 'NEXT_PUBLIC_CLOUDINARY_NAME',
                value: 'your_cloud_name',
                note: 'for client-side uploads',
            },
        ],
    },
]

const rootCommands: CommandRow[] = [
    {
        cmd: 'pnpm install',
        where: 'root',
        desc: 'Install all dependencies across the monorepo',
    },
    {
        cmd: 'pnpm build',
        where: 'root',
        desc: 'Build all packages in packages/',
    },
    {
        cmd: 'pnpm build:servers',
        where: 'root',
        desc: 'Build all servers in servers/',
    },
    {
        cmd: 'pnpm build:all',
        where: 'root',
        desc: 'Build packages then servers sequentially',
    },
    {
        cmd: 'pnpm clean',
        where: 'root',
        desc: 'Clean all package build outputs',
    },
]

const turboCommands: CommandRow[] = [
    {
        cmd: 'turbo dev --filter=aetherscribe',
        where: 'root',
        desc: 'Start Aetherscribe in dev mode',
    },
    {
        cmd: 'turbo dev --filter=nexus-serve',
        where: 'root',
        desc: 'Start Nexus Serve in dev mode',
    },
    {
        cmd: 'turbo dev --filter=byte-burger',
        where: 'root',
        desc: 'Start Byte Burger in dev mode',
    },
    {
        cmd: 'turbo dev --filter=realms-and-beyond',
        where: 'root',
        desc: 'Start landing page in dev mode',
    },
    {
        cmd: 'turbo build --filter=<app-name>',
        where: 'root',
        desc: 'Build a specific app',
    },
]

const navSections = [
    {
        label: 'Overview',
        items: [
            { href: 'overview', icon: '◈', text: 'Introduction' },
            { href: 'structure', icon: '⌥', text: 'Repo Structure' },
        ],
    },
    {
        label: 'Packages & Apps',
        items: [
            { href: 'servers', icon: '◎', text: 'Servers' },
            { href: 'apps', icon: '◻', text: 'Apps' },
            { href: 'packages', icon: '◈', text: 'Packages' },
        ],
    },
    {
        label: 'Setup',
        items: [
            { href: 'install', icon: '↓', text: 'Installation' },
            { href: 'sparse', icon: '◌', text: 'Sparse Checkout' },
            { href: 'env', icon: '⊡', text: 'Environment Files' },
            { href: 'commands', icon: '▷', text: 'Commands' },
        ],
    },
    {
        label: 'Workflow',
        items: [{ href: 'git', icon: '⑂', text: 'Git Branches' }],
    },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ variant }: { variant: BadgeVariant }) {
    const labels: Record<BadgeVariant, string> = {
        server: 'Server',
        app: 'App',
        pkg: 'Package',
    }
    return (
        <span className={`${styles.badge} ${styles[`badge_${variant}`]}`}>
            {labels[variant]}
        </span>
    )
}

function Callout({
    variant,
    children,
}: {
    variant: CalloutVariant
    children: React.ReactNode
}) {
    const icons: Record<CalloutVariant, string> = {
        warn: '⚠',
        info: 'ℹ',
        tip: '✦',
    }
    return (
        <div className={`${styles.callout} ${styles[`callout_${variant}`]}`}>
            <span className={styles.calloutIcon}>{icons[variant]}</span>
            <span>{children}</span>
        </div>
    )
}

function Card({ card }: { card: CardData }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.cardName}>{card.name}</span>
                <Badge variant={card.badge} />
            </div>
            <p className={styles.cardDesc}>{card.desc}</p>
            <span className={styles.cardPath}>{card.path}</span>
        </div>
    )
}

function EnvBlock({
    title,
    location,
    groups,
    note,
}: {
    title: string
    location: string
    groups: EnvGroup[]
    note?: React.ReactNode
}) {
    return (
        <div className={styles.envBlock}>
            <div className={styles.envHeader}>
                <span className={styles.envTitle}>{title}</span>
                <span className={styles.envLocation}>{location}</span>
            </div>
            <div className={styles.envBody}>
                {note && note}
                {groups.map((group) => (
                    <div key={group.label} className={styles.envGroup}>
                        <div className={styles.envGroupLabel}>
                            {group.label}
                        </div>
                        {group.vars.map((v) => (
                            <div key={v.key} className={styles.envVar}>
                                <span className={styles.envKey}>{v.key}</span>
                                <span className={styles.envEq}>=</span>
                                <span className={styles.envVal}>{v.value}</span>
                                {v.note && (
                                    <span className={styles.envNote}>
                                        {v.note}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

function CmdTable({ rows }: { rows: CommandRow[] }) {
    return (
        <table className={styles.cmdTable}>
            <thead>
                <tr>
                    <th>Command</th>
                    <th>Where</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.cmd}>
                        <td className={styles.cmdCell}>
                            <code>{row.cmd}</code>
                        </td>
                        <td className={styles.whereCell}>{row.where}</td>
                        <td className={styles.descCell}>{row.desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function TreeLine({
    connector,
    name,
    comment,
    isFolder,
}: {
    connector?: string
    name: string
    comment?: string
    isFolder?: boolean
}) {
    return (
        <div className={styles.treeLine}>
            {connector && (
                <span className={styles.treeConnector}>{connector}</span>
            )}
            <span className={isFolder ? styles.treeFolder : styles.treeFile}>
                {name}
            </span>
            {comment && <span className={styles.treeComment}>{comment}</span>}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MonorepoDocs() {
    const [activeSection, setActiveSection] = useState('overview')
    const mainRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const sectionEls = document.querySelectorAll('section[id]')
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id)
                })
            },
            { threshold: 0.3 }
        )
        sectionEls.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className={styles.layout}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarLogo}>
                        Realms <span className={styles.logoAccent}>&amp;</span>{' '}
                        Beyond
                    </div>
                    <div className={styles.sidebarSub}>
                        Monorepo Documentation
                    </div>
                    <div className={styles.sidebarVersion}>
                        <span className={styles.dot} />
                        v1.0.0 — Development
                    </div>
                </div>
                <nav className={styles.nav}>
                    {navSections.map((section) => (
                        <div key={section.label} className={styles.navSection}>
                            <span className={styles.navLabel}>
                                {section.label}
                            </span>
                            {section.items.map((item) => (
                                <button
                                    key={item.href}
                                    className={`${styles.navLink} ${activeSection === item.href ? styles.navLinkActive : ''}`}
                                    onClick={() => scrollTo(item.href)}
                                >
                                    <span className={styles.navIcon}>
                                        {item.icon}
                                    </span>
                                    {item.text}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* ── Main ── */}
            <main className={styles.main} ref={mainRef}>
                {/* Overview */}
                <section id="overview" className={styles.section}>
                    <div className={styles.sectionLabel}>Introduction</div>
                    <h1 className={styles.h1}>
                        Realms <em className={styles.h1Accent}>&amp;</em> Beyond
                    </h1>
                    <p className={styles.heroDesc}>
                        A holding company monorepo encompassing multiple
                        subsidiaries across game design, gastronomy,
                        point-of-sale &amp; employee management, book editing,
                        and TTRPG content creation. All products share a common
                        codebase of packages, styles, and tooling.
                    </p>
                    <div className={styles.heroTags}>
                        {[
                            'Turborepo',
                            'pnpm workspaces',
                            'Next.js',
                            'Express',
                            'TypeScript 5.9',
                            'Mongoose',
                        ].map((t) => (
                            <span key={t} className={styles.tag}>
                                {t}
                            </span>
                        ))}
                    </div>
                    <Callout variant="info">
                        This repo is currently in{' '}
                        <strong>active development</strong>. All services run on
                        localhost. No production servers are active yet.
                        Frontend developers should focus on the{' '}
                        <code>apps/</code> directory only — packages and servers
                        are maintained by the core team.
                    </Callout>
                </section>

                {/* Structure */}
                <section id="structure" className={styles.section}>
                    <div className={styles.sectionLabel}>Repo Structure</div>
                    <h2 className={styles.h2}>Directory Overview</h2>
                    <div className={styles.tree}>
                        <TreeLine name="realms-and-beyond/" isFolder />
                        <div className={styles.treeIndent}>
                            <TreeLine
                                connector="├──"
                                name="apps/"
                                isFolder
                                comment="— Next.js frontend applications"
                            />
                            <div className={styles.treeIndent}>
                                {[
                                    'realms-and-beyond/',
                                    'aetherscribe/',
                                    'nexus-serve/',
                                    'byte-burger/',
                                    'ui-documentation/',
                                    'package-documentation/',
                                ].map((name, i, arr) => (
                                    <TreeLine
                                        key={name}
                                        connector={
                                            i === arr.length - 1 ? '└──' : '├──'
                                        }
                                        name={name}
                                    />
                                ))}
                            </div>
                            <TreeLine
                                connector="├──"
                                name="servers/"
                                isFolder
                                comment="— Express + Mongoose API servers"
                            />
                            <div className={styles.treeIndent}>
                                {[
                                    'realms-and-beyond-api/',
                                    'nexus-serve-api/',
                                    'aetherscribe-api/',
                                ].map((name, i, arr) => (
                                    <TreeLine
                                        key={name}
                                        connector={
                                            i === arr.length - 1 ? '└──' : '├──'
                                        }
                                        name={name}
                                    />
                                ))}
                            </div>
                            <TreeLine
                                connector="├──"
                                name="packages/"
                                isFolder
                                comment="— Shared internal packages"
                            />
                            <div className={styles.treeIndent}>
                                {[
                                    'assets/',
                                    'errors/',
                                    'middleware/',
                                    'security/',
                                    'styles/',
                                    'types/',
                                    'ui/',
                                    'validators/',
                                ].map((name, i, arr) => (
                                    <TreeLine
                                        key={name}
                                        connector={
                                            i === arr.length - 1 ? '└──' : '├──'
                                        }
                                        name={name}
                                    />
                                ))}
                            </div>
                            <TreeLine connector="├──" name="turbo.json" />
                            <TreeLine
                                connector="├──"
                                name="pnpm-workspace.yaml"
                            />
                            <TreeLine connector="└──" name="package.json" />
                        </div>
                    </div>
                </section>

                {/* Servers */}
                <section id="servers" className={styles.section}>
                    <div className={styles.sectionLabel}>
                        Packages &amp; Apps — Servers
                    </div>
                    <h2 className={styles.h2}>API Servers</h2>
                    <Callout variant="warn">
                        Servers are <strong>maintained only</strong> — no new
                        servers should be created. Changes require review and a
                        pull request into <code>development</code>. All servers
                        use Express + Mongoose and share packages from the{' '}
                        <code>packages/</code> directory.
                    </Callout>
                    <div className={styles.cards}>
                        {servers.map((s) => (
                            <Card key={s.name} card={s} />
                        ))}
                    </div>
                    <p className={styles.footnote}>
                        All APIs follow the route format:{' '}
                        <code>api/v&#123;versionNumber&#125;/</code>
                    </p>
                </section>

                {/* Apps */}
                <section id="apps" className={styles.section}>
                    <div className={styles.sectionLabel}>
                        Packages &amp; Apps — Applications
                    </div>
                    <h2 className={styles.h2}>Frontend Apps</h2>
                    <Callout variant="tip">
                        Frontend developers work exclusively within the{' '}
                        <code>apps/</code> directory. All apps are built with{' '}
                        <strong>Next.js</strong> and consume shared packages
                        from <code>packages/</code>. Do not duplicate components
                        or styles that already exist in <code>packages/ui</code>{' '}
                        or <code>packages/styles</code>.
                    </Callout>
                    <div className={styles.cards}>
                        {apps.map((a) => (
                            <Card key={a.name} card={a} />
                        ))}
                    </div>
                </section>

                {/* Packages */}
                <section id="packages" className={styles.section}>
                    <div className={styles.sectionLabel}>
                        Packages &amp; Apps — Packages
                    </div>
                    <h2 className={styles.h2}>Shared Packages</h2>
                    <Callout variant="warn">
                        Packages are <strong>maintained only</strong> — no new
                        packages should be created at this time. If you modify a
                        package, you <strong>must rebuild it</strong> before
                        changes are accessible elsewhere in the repo. Run{' '}
                        <code>pnpm build</code> from the root or within the
                        specific package.
                    </Callout>
                    <div className={styles.cards}>
                        {packages.map((p) => (
                            <Card key={p.name} card={p} />
                        ))}
                    </div>
                </section>

                {/* Install */}
                <section id="install" className={styles.section}>
                    <div className={styles.sectionLabel}>
                        Setup — Installation
                    </div>
                    <h2 className={styles.h2}>Installation</h2>
                    <div className={styles.steps}>
                        {[
                            {
                                num: '1',
                                title: 'Prerequisites',
                                content: (
                                    <>
                                        <p className={styles.stepNote}>
                                            Ensure the following are installed
                                            globally before cloning.
                                        </p>
                                        <pre
                                            className={styles.pre}
                                        >{`# Node.js — check .nvmrc or package engines for required version
$ node --version

# pnpm — install globally if not present
$ npm install -g pnpm

# Turborepo CLI (optional but useful)
$ npm install -g turbo`}</pre>
                                    </>
                                ),
                            },
                            {
                                num: '2',
                                title: 'Clone the repository',
                                content: (
                                    <pre
                                        className={styles.pre}
                                    >{`$ git clone https://github.com/your-org/realms-and-beyond.git
$ cd realms-and-beyond`}</pre>
                                ),
                            },
                            {
                                num: '3',
                                title: 'Install dependencies',
                                content: (
                                    <>
                                        <p className={styles.stepNote}>
                                            Run from the repo root. pnpm
                                            workspaces installs all packages and
                                            apps in one step.
                                        </p>
                                        <pre className={styles.pre}>
                                            {'$ pnpm install'}
                                        </pre>
                                    </>
                                ),
                            },
                            {
                                num: '4',
                                title: 'Add environment files',
                                content: (
                                    <p className={styles.stepNote}>
                                        Place the correct <code>.env</code> file
                                        in each app or server before running.
                                        See the{' '}
                                        <strong>Environment Files</strong>{' '}
                                        section below for all variables.
                                    </p>
                                ),
                            },
                            {
                                num: '5',
                                title: 'Build packages first',
                                content: (
                                    <>
                                        <p className={styles.stepNote}>
                                            Packages must be compiled before
                                            apps and servers can consume them.
                                        </p>
                                        <pre className={styles.pre}>
                                            {
                                                '$ pnpm build   # builds all packages'
                                            }
                                        </pre>
                                        <Callout variant="warn">
                                            Any time you make changes to a
                                            package, you must rebuild it before
                                            those changes are visible in apps or
                                            servers.
                                        </Callout>
                                    </>
                                ),
                            },
                            {
                                num: '6',
                                title: "Start the app you're working on",
                                content: (
                                    <pre
                                        className={styles.pre}
                                    >{`# From root using Turbo filter
$ turbo dev --filter=aetherscribe

# Or navigate into the app directory
$ cd apps/aetherscribe
$ pnpm dev`}</pre>
                                ),
                            },
                        ].map((step, i, arr) => (
                            <div key={step.num} className={styles.step}>
                                <div className={styles.stepNumCol}>
                                    <div className={styles.stepNum}>
                                        {step.num}
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className={styles.stepLine} />
                                    )}
                                </div>
                                <div className={styles.stepContent}>
                                    <div className={styles.stepTitle}>
                                        {step.title}
                                    </div>
                                    {step.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sparse Checkout */}
                <section id="sparse" className={styles.section}>
                    <div className={styles.sectionLabel}>
                        Setup — Sparse Checkout
                    </div>
                    <h2 className={styles.h2}>
                        Working on a Single App or Package
                    </h2>
                    <p className={styles.body}>
                        You don&apos;t need to pull the entire monorepo to work
                        on a single app, server, or package. Git sparse checkout
                        lets you clone only the parts you need.
                    </p>
                    <Callout variant="info">
                        You must always include the{' '}
                        <strong>root config files</strong> (
                        <code>package.json</code>,{' '}
                        <code>pnpm-workspace.yaml</code>,{' '}
                        <code>turbo.json</code>) and any{' '}
                        <strong>packages your app depends on</strong>, or{' '}
                        <code>pnpm install</code> will fail.
                    </Callout>
                    <h3 className={styles.h3}>
                        Example: pulling only the Aetherscribe app
                    </h3>
                    <pre
                        className={styles.pre}
                    >{`# 1. Clone without checking out any files
$ git clone --no-checkout https://github.com/your-org/realms-and-beyond.git
$ cd realms-and-beyond

# 2. Enable sparse checkout
$ git sparse-checkout init --cone

# 3. Specify what to include (root files + your app + shared packages)
$ git sparse-checkout set apps/aetherscribe packages

# 4. Checkout your working branch
$ git checkout development

# 5. Install dependencies
$ pnpm install

# 6. Add your .env file then build packages
$ pnpm build`}</pre>

                    <h3 className={styles.h3} style={{ marginTop: '20px' }}>
                        Example: pulling only a server
                    </h3>
                    <pre className={styles.pre}>
                        {
                            '$ git sparse-checkout set servers/nexus-serve-api packages'
                        }
                    </pre>
                </section>

                {/* Env */}
                <section id="env" className={styles.section}>
                    <div className={styles.sectionLabel}>
                        Setup — Environment Files
                    </div>
                    <h2 className={styles.h2}>Environment Files</h2>
                    <p className={styles.body}>
                        Environment variables are validated via{' '}
                        <code>envalid</code> in{' '}
                        <code>packages/validators/src/env.ts</code>.
                        Executive-access developers manage that config file. The
                        app will throw on startup if any required variable is
                        missing.
                    </p>
                    <Callout variant="warn">
                        Never commit <code>.env</code> files to the repository.
                        Ensure <code>.env</code> is listed in{' '}
                        <code>.gitignore</code>. Obtain values from your team
                        lead.
                    </Callout>
                    <div className={styles.envStack}>
                        <EnvBlock
                            title="Backend — All API Servers"
                            location="servers/{server-name}/.env"
                            groups={backendEnvGroups}
                        />
                        <EnvBlock
                            title="Frontend — Next.js Apps"
                            location="apps/{app-name}/.env.local"
                            groups={frontendEnvGroups}
                            note={
                                <Callout variant="info">
                                    Frontend env variables are not yet
                                    finalised. Values below are placeholders for
                                    localhost development. Variables prefixed
                                    with <code>NEXT_PUBLIC_</code> are exposed
                                    to the browser.
                                </Callout>
                            }
                        />
                    </div>
                    <p className={styles.footnote}>
                        Not all apps require all variables. Only include what
                        each specific app uses.
                    </p>
                </section>

                {/* Commands */}
                <section id="commands" className={styles.section}>
                    <div className={styles.sectionLabel}>Setup — Commands</div>
                    <h2 className={styles.h2}>Commands Reference</h2>

                    <h3 className={styles.h3}>Root Commands</h3>
                    <p className={styles.stepNote}>
                        Run from the repo root (<code>realms-and-beyond/</code>)
                    </p>
                    <CmdTable rows={rootCommands} />

                    <h3 className={styles.h3} style={{ marginTop: '28px' }}>
                        Running a Specific App (Turbo filter)
                    </h3>
                    <p className={styles.stepNote}>
                        Use Turborepo&apos;s <code>--filter</code> flag to
                        target a specific app from the root.
                    </p>
                    <CmdTable rows={turboCommands} />

                    <h3 className={styles.h3} style={{ marginTop: '28px' }}>
                        Running Directly Inside an App
                    </h3>
                    <pre className={styles.pre}>{`$ cd apps/aetherscribe
$ pnpm dev     # start dev server
$ pnpm build   # production build
$ pnpm lint    # lint check`}</pre>

                    <h3 className={styles.h3} style={{ marginTop: '28px' }}>
                        Rebuilding a Package After Changes
                    </h3>
                    <pre
                        className={styles.pre}
                    >{`# From repo root — rebuild all packages
$ pnpm build

# Or rebuild a specific package
$ cd packages/validators
$ pnpm build`}</pre>
                </section>

                {/* Git */}
                <section id="git" className={styles.section}>
                    <div className={styles.sectionLabel}>Workflow — Git</div>
                    <h2 className={styles.h2}>Git Branch Strategy</h2>
                    <p className={styles.body}>
                        All work is managed through GitHub. The following branch
                        structure enforces a controlled, reviewed workflow
                        across the team.
                    </p>
                    <div className={styles.branchBlock}>
                        {[
                            {
                                dot: 'main' as BranchVariant,
                                name: 'main',
                                desc: 'Core protected branch. Never work directly on main. Code only enters via an approved pull request. This represents the canonical source of truth.',
                            },
                            {
                                dot: 'publish' as BranchVariant,
                                name: 'publish',
                                desc: 'The currently deployed version. Reflects what is live and in use. Changes are promoted here after passing QA on development.',
                            },
                            {
                                dot: 'dev' as BranchVariant,
                                name: 'development',
                                desc: 'The active integration branch. All feature branches are merged here first for bug testing and cross-feature compatibility. A dedicated team controls this branch. Always open a PR — never merge directly.',
                            },
                        ].map((branch) => (
                            <div key={branch.name} className={styles.branchRow}>
                                <div className={styles.branchName}>
                                    <span
                                        className={`${styles.branchDot} ${styles[`branchDot_${branch.dot}`]}`}
                                    />
                                    {branch.name}
                                </div>
                                <p className={styles.branchDesc}>
                                    {branch.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <h3 className={styles.h3} style={{ marginTop: '24px' }}>
                        Feature Branch Workflow
                    </h3>
                    <pre
                        className={styles.pre}
                    >{`# 1. Create your feature branch from development
$ git checkout development
$ git pull origin development
$ git checkout -b feature/your-feature-name

# 2. Do your work, commit regularly
$ git add .
$ git commit -m "feat: describe your change"

# 3. Push and open a PR into development
$ git push origin feature/your-feature-name`}</pre>
                    <Callout variant="tip">
                        PRs into <code>development</code> are reviewed by the
                        integration team. Once approved and merged, they go
                        through testing before being promoted to{' '}
                        <code>publish</code> and eventually <code>main</code>.
                    </Callout>
                </section>
            </main>
        </div>
    )
}
