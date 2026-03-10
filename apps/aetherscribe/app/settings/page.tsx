'use client'

import { ThemeSwitcher, useTheme } from '@rnb/ui'
import styles from './settings.module.scss'

// ─── Colour swatch ────────────────────────────────────────────────────────────

function Swatch({ label, cssVar }: { label: string; cssVar: string }) {
    return (
        <div className={styles.swatch}>
            <div
                className={styles.swatchColor}
                style={{ background: `var(${cssVar})` }}
            />
            <span className={styles.swatchLabel}>{label}</span>
        </div>
    )
}

// ─── Theme signature ──────────────────────────────────────────────────────────
// Shows the unique design utilities for whichever theme is active.

function ThemeSignature({ theme }: { theme: string }) {
    switch (theme) {
        case 'arcade':
            return (
                <div className={styles.signatureGrid}>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Score Display</span>
                        <span className="score-display">009999</span>
                        <span className="insert-coin">INSERT COIN</span>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Amber Glow Text</span>
                        <span
                            className="amber-glow"
                            style={{ fontSize: '1.1rem', letterSpacing: '0.12em', fontFamily: 'Cinzel' }}
                        >
                            REALMS &amp; BEYOND
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-color)' }}>
                            Primary colour with glow text-shadow
                        </span>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Pixel Corner + Fire Tag</span>
                        <div
                            className="pixel-corner"
                            style={{
                                padding: '0.75rem',
                                background: 'var(--bg-inset-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span className="fire-tag">DANGER</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary-color)' }}>
                                Rust fire highlight
                            </span>
                        </div>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Three Hues</span>
                        <div className={styles.colorStack}>
                            <span style={{ color: '#C47818' }}>Arcade Amber</span>
                            <span style={{ color: '#5A9038' }}>Phosphor Olive</span>
                            <span style={{ color: '#C84018' }}>Rust Fire</span>
                        </div>
                    </div>
                </div>
            )

        case 'phosphor':
            return (
                <div className={styles.signatureGrid}>
                    <div className={`${styles.signatureCard} crt-screen`} style={{ position: 'relative' }}>
                        <span className={styles.signatureTitle}>CRT Screen</span>
                        <span
                            className="phosphor-glow"
                            style={{ fontSize: '1rem', letterSpacing: '0.1em' }}
                        >
                            SYSTEM ONLINE
                        </span>
                        <span className="terminal-muted">proc :: idle · mem: 2.4gb</span>
                        <span className="terminal-secondary">v2.04.11 runtime build</span>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Amber Cursor + Value</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Share Tech Mono', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                            <span>&gt;_</span>
                            <span className="cursor" />
                        </div>
                        <span className="amber-value" style={{ fontSize: '1.5rem' }}>9,247 pts</span>
                        <hr className="terminal-rule" />
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Multi-Green Layers</span>
                        <div className={styles.colorStack}>
                            <span style={{ color: '#02A953' }}>Bright Emerald — heading</span>
                            <span style={{ color: '#C5CEA5' }}>Sage Green — secondary</span>
                            <span style={{ color: '#818B71' }}>Army Khaki — muted</span>
                        </div>
                        <span style={{ color: '#C47818', fontFamily: 'Share Tech Mono', fontSize: '0.82rem' }}>
                            + Amber pop accent
                        </span>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Terminal Output</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontFamily: 'Share Tech Mono', fontSize: '0.78rem' }}>
                            <span style={{ color: '#02A953' }}>[ OK ] boot sequence complete</span>
                            <span style={{ color: '#C5CEA5' }}>[ -- ] awaiting input...</span>
                            <span style={{ color: '#818B71' }}>[ -- ] session: 00:04:12</span>
                            <span style={{ color: '#C47818' }}>[ !! ] 3 warnings queued</span>
                        </div>
                    </div>
                </div>
            )

        case 'sovereign':
            return (
                <div className={styles.signatureGrid}>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Power Slash + Gold Cap</span>
                        <div className="gold-cap" style={{ marginTop: '0.25rem' }}>
                            <div
                                className="power-slash"
                                style={{ paddingLeft: '1.25rem' }}
                            >
                                <span className="gold-text" style={{ fontSize: '0.9rem', letterSpacing: '0.12em' }}>
                                    IMPERIAL COMMAND
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Authority Badge + Imperial Rule</span>
                        <span className="authority-badge">CLASSIFIED</span>
                        <hr className="imperial-rule" />
                        <span className="crimson-glow" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                            SOVEREIGN ACCESS
                        </span>
                    </div>
                    <div className={`${styles.signatureCard} ${styles.wide}`}>
                        <span className={styles.signatureTitle}>Decree Block</span>
                        <div className="decree">
                            By imperial mandate, all records shall be archived within the Aetherscribe
                            and sealed under sovereign authority. This document bears the mark of the
                            Crimson Council — year 2087.
                        </div>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Three Hues</span>
                        <div className={styles.colorStack}>
                            <span style={{ color: '#C41420' }}>Imperial Crimson</span>
                            <span style={{ color: '#C4A018' }}>Pale Gold</span>
                            <span style={{ color: '#F0D8C8' }}>Ivory Text</span>
                        </div>
                    </div>
                </div>
            )

        case 'void':
            return (
                <div className={styles.signatureGrid}>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>HUD + Signal</span>
                        <span className="hud-label">SECTOR: 7G — ACTIVE</span>
                        <div className="signal-bar" />
                        <span
                            className="signal-text"
                            style={{ fontSize: '0.88rem', letterSpacing: '0.08em' }}
                        >
                            SIGNAL ACQUIRED
                        </span>
                        <span className="data-readout">03.21.2087 — 14:32:09</span>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Radar Ping</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span
                                className="radar-ping"
                                style={{
                                    color: 'var(--accent-color)',
                                    fontSize: '1.4rem',
                                    display: 'inline-flex',
                                }}
                            >
                                ◉
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span className="steel-glow" style={{ fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                                    TARGET LOCKED
                                </span>
                                <span className="data-readout">unit-001-alpha</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Data Readout</span>
                        <div className={styles.colorStack}>
                            <span className="data-readout">UNIT: 001-ALPHA</span>
                            <span className="data-readout">STATUS: ONLINE</span>
                            <span className="data-readout">UPTIME: 99.7%</span>
                            <span className="data-readout">THREATS: 0</span>
                        </div>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Three Hues</span>
                        <div className={styles.colorStack}>
                            <span style={{ color: '#4A90B8' }}>Steel Blue — primary</span>
                            <span style={{ color: '#E84A0A' }}>Space Orange — accent</span>
                            <span style={{ color: '#7A8088' }}>Cool Gray — highlight</span>
                        </div>
                    </div>
                </div>
            )

        case 'dusk':
            return (
                <div className={styles.signatureGrid}>
                    <div className={`${styles.signatureCard} neon-border`}>
                        <span className={styles.signatureTitle}>Neon Border + Arcane Pulse</span>
                        <h3
                            className="arcane-pulse"
                            style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.1em' }}
                        >
                            ARCANE PULSE
                        </h3>
                        <hr className="dusk-rule" style={{ border: 'none' }} />
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Portal Shimmer</span>
                        <span
                            className="portal-shimmer"
                            style={{
                                fontSize: '1.1rem',
                                letterSpacing: '0.1em',
                                fontFamily: 'Cinzel',
                                fontWeight: 700,
                            }}
                        >
                            REALMS &amp; BEYOND
                        </span>
                        <span className="sky-text" style={{ fontSize: '0.82rem', letterSpacing: '0.06em' }}>
                            Steel sky blue — third hue
                        </span>
                    </div>
                    <div className={`${styles.signatureCard} emerald-border`}>
                        <span className={styles.signatureTitle}>Emerald Border</span>
                        <span
                            className="emerald-glow"
                            style={{ fontSize: '0.9rem', letterSpacing: '0.08em' }}
                        >
                            EMERALD ACCENT
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-color)' }}>
                            Tron / Galaga complementary contrast
                        </span>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Three Hues</span>
                        <div className={styles.colorStack}>
                            <span style={{ color: '#C83070' }}>Hot Magenta</span>
                            <span style={{ color: '#30B878' }}>Emerald Green</span>
                            <span style={{ color: '#78A8C8' }}>Steel Sky Blue</span>
                        </div>
                    </div>
                </div>
            )

        case 'parchment':
        default:
            return (
                <div className={styles.signatureGrid}>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Ink Gradient + Map Rule</span>
                        <span
                            className="ink-gradient"
                            style={{
                                fontSize: '1.1rem',
                                letterSpacing: '0.1em',
                                fontFamily: 'Cinzel',
                                fontWeight: 700,
                            }}
                        >
                            ANCIENT MAP
                        </span>
                        <hr className="map-rule" style={{ marginTop: '0.25rem' }} />
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Tags &amp; Stamps</span>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="rose-tag">ARCHIVE</span>
                            <span className="rose-tag">SEALED</span>
                        </div>
                        <span className="ink-stamp">OFFICIAL SEAL</span>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Aged Text</span>
                        <p
                            className="aged-text"
                            style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.65 }}
                        >
                            Herein lies the record of great deeds, inscribed upon parchment for all ages hence to witness and remember.
                        </p>
                    </div>
                    <div className={styles.signatureCard}>
                        <span className={styles.signatureTitle}>Three Hues</span>
                        <div className={styles.colorStack}>
                            <span style={{ color: '#874537' }}>Terracotta Earth</span>
                            <span style={{ color: '#105446' }}>Deep Teal</span>
                            <span style={{ color: '#D37F7F' }}>Dusty Rose</span>
                        </div>
                    </div>
                </div>
            )
    }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const THEME_DESCRIPTIONS: Record<string, string> = {
    arcade:    'Warm amber glow with phosphor green accent',
    phosphor:  'CRT terminal green with amber accent',
    sovereign: 'Crimson authority with pale gold accent',
    void:      'Space navy with steel blue and orange pop',
    dusk:      'Hot magenta, emerald, and steel sky — 80s arcade',
    parchment: 'Ancient map cream with terracotta and deep teal',
}

export default function Settings() {
    const { theme } = useTheme()

    return (
        <div className={styles.page}>

            {/* ── Appearance ───────────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Appearance</h2>
                    <p className="text-muted">{THEME_DESCRIPTIONS[theme]}</p>
                </div>
                <ThemeSwitcher showThemePicker showModePicker />
            </section>

            <hr className="rule" />

            {/* ── Colour Palette ───────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Colour Palette</h2>
                    <p className="text-muted">Live token values — change with each theme and mode</p>
                </div>

                <div className={styles.swatchGroup}>
                    <p className={styles.swatchGroupLabel}>Brand</p>
                    <div className={styles.swatchGrid}>
                        <Swatch label="primary"   cssVar="--primary-color" />
                        <Swatch label="p.hover"   cssVar="--primary-hover-color" />
                        <Swatch label="p.deep"    cssVar="--primary-deep-color" />
                        <Swatch label="accent"    cssVar="--accent-color" />
                        <Swatch label="acc.dim"   cssVar="--accent-dim-color" />
                        <Swatch label="highlight" cssVar="--highlight-color" />
                    </div>
                </div>

                <div className={styles.swatchGroup}>
                    <p className={styles.swatchGroupLabel}>Backgrounds</p>
                    <div className={styles.swatchGrid}>
                        <Swatch label="bg"      cssVar="--bg-color" />
                        <Swatch label="bg.sec"  cssVar="--bg-secondary-color" />
                        <Swatch label="surface" cssVar="--bg-surface-color" />
                        <Swatch label="inset"   cssVar="--bg-inset-color" />
                    </div>
                </div>

                <div className={styles.swatchGroup}>
                    <p className={styles.swatchGroupLabel}>Text</p>
                    <div className={styles.swatchGrid}>
                        <Swatch label="heading"   cssVar="--text-heading-color" />
                        <Swatch label="body"      cssVar="--text-color" />
                        <Swatch label="secondary" cssVar="--text-secondary-color" />
                        <Swatch label="muted"     cssVar="--text-muted-color" />
                    </div>
                </div>

                <div className={styles.swatchGroup}>
                    <p className={styles.swatchGroupLabel}>Semantic</p>
                    <div className={styles.swatchGrid}>
                        <Swatch label="danger"   cssVar="--danger-color" />
                        <Swatch label="warning"  cssVar="--warning-color" />
                        <Swatch label="success"  cssVar="--success-color" />
                        <Swatch label="submit"   cssVar="--submit-color" />
                        <Swatch label="disabled" cssVar="--disabled-color" />
                    </div>
                </div>
            </section>

            <hr className="rule" />

            {/* ── Typography ───────────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Typography</h2>
                    <p className="text-muted">Cinzel · Share Tech Mono · Barlow Condensed</p>
                </div>
                <div className={styles.typeStack}>
                    <h1>The Arcane Compendium</h1>
                    <h2>Adventure Hub</h2>
                    <h3>World Builder</h3>
                    <h4>Character Sheet</h4>
                    <p>
                        The arcane compendium of worlds, characters, and lore. Aetherscribe is your
                        terminal into the infinite — where every campaign, creature, and chronicle
                        finds its permanent record.
                    </p>
                    <p>
                        <code>SYS_BOOT :: AETHERSCRIBE v2.4.11 — all systems nominal</code>
                    </p>
                    <div className={styles.indicatorRow}>
                        <span className="tag tag--primary">Campaign</span>
                        <span className="tag tag--accent">World</span>
                        <span className="tag tag--danger">Danger</span>
                        <span className="tag tag--success">Active</span>
                        <span className="tag">Default</span>
                    </div>
                </div>
            </section>

            <hr className="rule" />

            {/* ── Buttons ──────────────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Buttons</h2>
                </div>
                <div className={styles.btnRow}>
                    <button className="btn">Primary</button>
                    <button className="btn accent">Accent</button>
                    <button className="btn danger">Danger</button>
                    <button className="btn warning">Warning</button>
                    <button className="btn success">Success</button>
                    <button className="btn submit">Submit</button>
                    <button className="btn ghost">Ghost</button>
                    <button className="btn outline">Outline</button>
                    <button className="btn" disabled>Disabled</button>
                </div>
                <div className={styles.btnRow}>
                    <button className="btn btn-sm">Small</button>
                    <button className="btn">Regular</button>
                    <button className="btn btn-lg">Large</button>
                </div>
            </section>

            <hr className="rule" />

            {/* ── Cards ────────────────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Cards</h2>
                </div>
                <div className={styles.cardRow}>
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Default</span>
                            <span className="tag">Surface</span>
                        </div>
                        <div className="card-body">
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.82rem' }}>
                                Standard surface panel with border and ambient scanline overlay.
                            </p>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-sm ghost">View</button>
                        </div>
                    </div>
                    <div className="card card--glow">
                        <div className="card-header">
                            <span className="card-title">Glow</span>
                            <span className="tag tag--primary">Active</span>
                        </div>
                        <div className="card-body">
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.82rem' }}>
                                Primary-colour border with glow shadow — for highlighted content.
                            </p>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-sm">Select</button>
                        </div>
                    </div>
                    <div className="card card--inset">
                        <div className="card-header">
                            <span className="card-title">Inset</span>
                            <span className="tag">Depth</span>
                        </div>
                        <div className="card-body">
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.82rem' }}>
                                Deepest background tier — for nested or recessed content.
                            </p>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-sm ghost">View</button>
                        </div>
                    </div>
                </div>

                <div className={styles.cardRow}>
                    <div className="stat-card">
                        <span className="stat-card__label">Total Worlds</span>
                        <span className="stat-card__value">12</span>
                        <span className="stat-card__delta">+2 this month</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__label">Characters</span>
                        <span className="stat-card__value">48</span>
                        <span className="stat-card__delta stat-card__delta--negative">−1 archived</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__label">Sessions</span>
                        <span className="stat-card__value">231</span>
                        <span className="stat-card__delta stat-card__delta--neutral">no change</span>
                    </div>
                </div>
            </section>

            <hr className="rule" />

            {/* ── Forms ────────────────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Form Elements</h2>
                </div>
                <div className={styles.formRow}>
                    <div>
                        <label
                            htmlFor="ex-input"
                            style={{
                                display: 'block',
                                fontSize: '0.65rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted-color)',
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontWeight: 700,
                                marginBottom: '0.35rem',
                            }}
                        >
                            Character Name
                        </label>
                        <input id="ex-input" className="input" placeholder="Enter name..." />
                    </div>
                    <div>
                        <label
                            htmlFor="ex-error"
                            style={{
                                display: 'block',
                                fontSize: '0.65rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: 'var(--danger-color)',
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontWeight: 700,
                                marginBottom: '0.35rem',
                            }}
                        >
                            Error State
                        </label>
                        <input id="ex-error" className="input input--error" placeholder="Invalid value..." />
                    </div>
                    <div>
                        <label
                            htmlFor="ex-select"
                            style={{
                                display: 'block',
                                fontSize: '0.65rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted-color)',
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontWeight: 700,
                                marginBottom: '0.35rem',
                            }}
                        >
                            Entity Type
                        </label>
                        <select id="ex-select" className="select">
                            <option>Select type...</option>
                            <option>Campaign</option>
                            <option>Character</option>
                            <option>World</option>
                            <option>Creature</option>
                        </select>
                    </div>
                </div>
            </section>

            <hr className="rule" />

            {/* ── Indicators ───────────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Indicators &amp; Feedback</h2>
                </div>

                <div className={styles.indicatorRow}>
                    <span className="status-dot status-dot--live" />
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Live</span>
                    <span className="status-dot status-dot--warning" />
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Warning</span>
                    <span className="status-dot status-dot--danger" />
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Danger</span>
                    <span className="status-dot" />
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Idle</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="progress-bar">
                        <div className="progress-bar__fill" style={{ width: '72%' }} />
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar__fill"
                            style={{ width: '45%', background: 'var(--accent-color)', boxShadow: '0 0 8px var(--accent-glow)' }}
                        />
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar__fill"
                            style={{ width: '90%', background: 'var(--success-color)' }}
                        />
                    </div>
                </div>

                <div className={styles.indicatorRow}>
                    <div className="spinner" />
                    <span className="glow-text" style={{ fontSize: '0.82rem', letterSpacing: '0.12em' }}>
                        LOADING...
                    </span>
                </div>
            </section>

            <hr className="rule" />

            {/* ── Shadows ──────────────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Shadows</h2>
                    <p className="text-muted">Glow-forward — shadow colour matches the primary hue</p>
                </div>
                <div className={styles.shadowRow}>
                    <div className={styles.shadowSwatch} style={{ boxShadow: 'var(--shadow-sm)' }}>
                        Shadow SM
                    </div>
                    <div className={styles.shadowSwatch} style={{ boxShadow: 'var(--shadow-md)' }}>
                        Shadow MD
                    </div>
                    <div className={styles.shadowSwatch} style={{ boxShadow: 'var(--shadow-lg)' }}>
                        Shadow LG
                    </div>
                </div>
            </section>

            <hr className="rule" />

            {/* ── Theme Signature ──────────────────────────────────────────── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Theme Signature</h2>
                    <p className="text-muted">
                        Unique design elements for the{' '}
                        <strong style={{ color: 'var(--primary-color)', textTransform: 'capitalize' }}>
                            {theme}
                        </strong>{' '}
                        theme
                    </p>
                </div>
                <ThemeSignature theme={theme} />
            </section>

        </div>
    )
}
