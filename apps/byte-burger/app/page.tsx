'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './home.module.scss'
import { FEATURED_ITEMS, TICKER_ITEMS, BURGERS } from './data/menu'

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
    const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
    return (
        <div className={`bb-ticker-wrap ${styles.tickerSection}`}>
            <div className="bb-ticker">
                {items.map((item, i) => (
                    <span key={i} className="bb-ticker-item">{item}</span>
                ))}
            </div>
        </div>
    )
}

// ─── Boot terminal ────────────────────────────────────────────────────────────

const BOOT_LINES = [
    { text: 'BYTEBURGER OS v2.087 — INITIALISING...', dim: false },
    { text: 'LOADING MENU DATABASE...............OK',  dim: true  },
    { text: 'CHECKING KITCHEN STATUS.............OK',  dim: true  },
    { text: 'WARMING GRILLS......................OK',   dim: true  },
    { text: '5 FIGHTERS AVAILABLE. CHOOSE YOUR HERO.', dim: false },
]

function BootTerminal() {
    return (
        <div className={styles.bootTerminal}>
            {BOOT_LINES.map((line, i) => (
                <span
                    key={i}
                    className={`bb-boot-line${line.dim ? ' bb-boot-line--dim' : ''}`}
                >
                    {line.text}
                </span>
            ))}
        </div>
    )
}

// ─── Parallax hook ────────────────────────────────────────────────────────────

function useParallax(strength = 0.3) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const parent = el.parentElement

        function onScroll() {
            if (!el || !parent) return
            const rect = parent.getBoundingClientRect()
            const offset = -rect.top * strength
            el.style.transform = `translateY(${offset}px)`
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [strength])

    return ref
}

// ─── Featured section ─────────────────────────────────────────────────────────

function FeaturedSection() {
    const parallaxRef = useParallax(0.15)

    return (
        <section className={styles.featuredSection}>
            <div ref={parallaxRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <div className={styles.sectionInner}>
                <div className={styles.sectionHeader}>
                    <div className="bb-level-banner">
                        <span className="bb-level-num">01</span>
                        <span>TODAY&apos;S SPECIALS</span>
                    </div>
                    <h2 className={styles.sectionTitle}>Featured Items</h2>
                    <p className={styles.sectionSub}>
                        Limited time — level up before they&apos;re gone
                    </p>
                </div>

                <div className={styles.promoGrid}>
                    {FEATURED_ITEMS.map((item) => (
                        <div key={item.id} className="bb-promo-card">
                            <span className="bb-promo-badge">{item.badge}</span>
                            <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{item.emoji}</div>
                            <h3 className="bb-promo-title">{item.title}</h3>
                            <p className="bb-promo-desc">{item.desc}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <span className="bb-promo-price">{item.price}</span>
                                <Link href="/menu" className="btn btn-sm">VIEW MENU</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── Burger preview strip ──────────────────────────────────────────────────────

function BurgerPreviewStrip() {
    const parallaxRef = useParallax(0.1)

    return (
        <section className={styles.levelsSection}>
            <div ref={parallaxRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <div className={styles.sectionInner}>
                <div className={styles.sectionHeader}>
                    <div className="bb-level-banner">
                        <span className="bb-level-num">02</span>
                        <span>CHOOSE YOUR FIGHTER</span>
                    </div>
                    <h2 className={styles.sectionTitle}>The Roster</h2>
                    <p className={styles.sectionSub}>Five legendary fighters. One legendary hunger.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                    {BURGERS.map((burger) => (
                        <Link key={burger.id} href="/menu#burgers" style={{ textDecoration: 'none' }}>
                            <div className="bb-character-card" style={{ padding: '1rem' }}>
                                <span className="bb-character-emoji" style={{ fontSize: '2.2rem' }}>
                                    {burger.emoji}
                                </span>
                                <span className="bb-character-class">{burger.class}</span>
                                <span className="bb-character-name" style={{ fontSize: '0.78rem' }}>
                                    {burger.name}
                                </span>
                                <span className="price" style={{ fontSize: '0.85rem' }}>{burger.price}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <Link href="/menu#burgers" className="btn btn-order">
                        ENTER THE ARENA
                    </Link>
                </div>
            </div>
        </section>
    )
}

// ─── Level previews ───────────────────────────────────────────────────────────

const LEVEL_PREVIEWS = [
    {
        level: '03',
        emoji: '🍟',
        title: 'Sides',
        desc: 'Classic fries, curly fries, sweet potato, slaw, and the legendary Bytes. Your battle companions.',
        href: '/menu#sides',
        cta: 'SEE SIDES →',
    },
    {
        level: '04',
        emoji: '🥤',
        title: 'Drinks',
        desc: 'Cold cola, arcade lemonade, mango blast, vanilla shake. Fuel for every level.',
        href: '/menu#drinks',
        cta: 'SEE DRINKS →',
    },
    {
        level: '05',
        emoji: '🎮',
        title: 'Full Menu',
        desc: 'Every item, every variant, every price. The complete compendium.',
        href: '/menu',
        cta: 'OPEN MENU →',
    },
]

function LevelPreviews() {
    return (
        <section className={styles.featuredSection} style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className={styles.sectionInner}>
                <div className={styles.sectionHeader}>
                    <div className="bb-level-banner">
                        <span className="bb-level-num">03–05</span>
                        <span>EXPLORE THE LEVELS</span>
                    </div>
                    <h2 className={styles.sectionTitle}>What Awaits</h2>
                </div>

                <div className={styles.levelsGrid}>
                    {LEVEL_PREVIEWS.map((level) => (
                        <Link key={level.level} href={level.href} className={styles.levelPreviewCard}>
                            <span className={styles.levelNum}>LEVEL {level.level}</span>
                            <span className={styles.levelEmoji}>{level.emoji}</span>
                            <h3 className={styles.levelTitle}>{level.title}</h3>
                            <p className={styles.levelDesc}>{level.desc}</p>
                            <span className={styles.levelCta}>{level.cta}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
    const heroBgRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onScroll() {
            if (!heroBgRef.current) return
            const y = window.scrollY
            heroBgRef.current.style.transform = `rotateX(20deg) scale(1.3) translateY(${y * 0.2}px)`
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            {/* ── STAGE 00 — BOOT SCREEN ───────────────────────────────────── */}
            <section className={styles.bootHero}>
                <div className="bb-hud-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <span>BYTEBURGER OS v2.087</span>
                    <span className="bb-hud-score">HI-SCORE: 999,999</span>
                    <span className="bb-hud-lives">♥ ♥ ♥</span>
                </div>

                <div ref={heroBgRef} className={styles.bootParallaxBg} />

                <div className={styles.bootContent}>
                    <div className={styles.bootLogoMark}>🍔</div>

                    <h1 className={styles.bootTitle}>
                        BYTE<span className={styles.bootTitleAccent}>BURGER</span>
                    </h1>

                    <p className={styles.bootSubtitle}>
                        RETRO ARCADE BURGERS · LEVEL UP YOUR LUNCH · EST. 2087
                    </p>

                    <BootTerminal />

                    <div className={styles.bootActions}>
                        <Link href="/menu" className="btn btn-order">PRESS START</Link>
                        <Link href="/menu#burgers" className="btn outline">CHOOSE FIGHTER</Link>
                    </div>

                    <p className={styles.bootPressStart}>▼ SCROLL TO PLAY ▼</p>
                </div>

                <div className={styles.bootScrollHint}>
                    <span>SCROLL</span>
                    <div className={styles.bootScrollArrow} />
                </div>
            </section>

            {/* ── TICKER ─────────────────────────────────────────────────────── */}
            <Ticker />

            {/* ── STAGE 01 — FEATURED ──────────────────────────────────────── */}
            <FeaturedSection />

            {/* ── STAGE 02 — ROSTER PREVIEW ────────────────────────────────── */}
            <BurgerPreviewStrip />

            {/* ── STAGE 03–05 — LEVEL PREVIEWS ─────────────────────────────── */}
            <LevelPreviews />
        </>
    )
}
