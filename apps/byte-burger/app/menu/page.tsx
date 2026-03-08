'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './menu.module.scss'
import { BURGERS, SIDES, DRINKS, type Burger } from '../data/menu'

// ─── Parallax hook ────────────────────────────────────────────────────────────

function useParallax(strength = 0.2) {
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

// ─── Stat bar ─────────────────────────────────────────────────────────────────

function StatBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="bb-stat-bar">
            <span className="bb-stat-label">{label}</span>
            <div className="bb-stat-track">
                <div className="bb-stat-fill" style={{ width: `${value}%` }} />
            </div>
            <span style={{ width: 28, textAlign: 'right', color: 'var(--primary-color)', fontSize: '0.6rem' }}>
                {value}
            </span>
        </div>
    )
}

// ─── Character select ─────────────────────────────────────────────────────────

function CharacterSelect({
    selected,
    onSelect,
}: {
    selected: Burger | null
    onSelect: (b: Burger) => void
}) {
    return (
        <div className={styles.characterGrid}>
            {BURGERS.map((burger) => (
                <div
                    key={burger.id}
                    role="button"
                    tabIndex={0}
                    className={`bb-character-card${selected?.id === burger.id ? ' selected' : ''}`}
                    onClick={() => onSelect(burger)}
                    onKeyDown={(e) => e.key === 'Enter' && onSelect(burger)}
                >
                    <span className="bb-character-emoji">{burger.emoji}</span>
                    <span className="bb-character-class">{burger.class}</span>
                    <span className="bb-character-name">{burger.name}</span>
                    <p className="bb-character-desc">{burger.tagline}</p>
                    <div className="bb-character-stats">
                        {burger.stats.map((s) => (
                            <StatBar key={s.label} label={s.label} value={s.value} />
                        ))}
                    </div>
                    <span className="price" style={{ marginTop: '0.5rem' }}>{burger.price}</span>
                    {burger.isNew && (
                        <span className="bb-tag bb-tag--new" style={{ width: 'fit-content' }}>NEW</span>
                    )}
                </div>
            ))}
        </div>
    )
}

// ─── Burger detail panel ──────────────────────────────────────────────────────

function BurgerDetailPanel({ burger }: { burger: Burger }) {
    return (
        <div className={styles.burgerDetail}>
            <div className={styles.burgerDetailPanel}>
                <span className={styles.burgerDetailEmoji}>{burger.emoji}</span>
                <h2 className={styles.burgerDetailName}>{burger.name}</h2>
                <p className={styles.burgerDetailClass}>{burger.class}</p>
                <p className={styles.burgerDetailTagline}>&ldquo;{burger.tagline}&rdquo;</p>
                <p className={styles.burgerDetailDesc}>{burger.description}</p>
                <div className={styles.burgerDetailActions}>
                    <span className={styles.burgerDetailPrice}>{burger.price}</span>
                    <button className="btn btn-order">ADD TO ORDER</button>
                    <button className="btn ghost">BACK</button>
                </div>
            </div>

            <div className={styles.burgerDetailPanel}>
                <p className={styles.burgerDetailStatsTitle}>Combat Stats</p>
                <div className="bb-character-stats" style={{ gap: '0.6rem' }}>
                    {burger.stats.map((s) => (
                        <StatBar key={s.label} label={s.label} value={s.value} />
                    ))}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p className={styles.burgerDetailStatsTitle} style={{ margin: 0 }}>Tags</p>
                    <div className="bb-menu-tags">
                        {burger.tags.map((t) => (
                            <span key={t} className={`bb-tag bb-tag--${t}`}>{t.toUpperCase()}</span>
                        ))}
                        {burger.isNew && <span className="bb-tag bb-tag--new">NEW</span>}
                    </div>
                </div>

                <div
                    style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'var(--bg-inset-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '2px',
                    }}
                >
                    <p className={styles.burgerDetailStatsTitle} style={{ margin: '0 0 0.5rem' }}>
                        Lore
                    </p>
                    <p
                        style={{
                            fontFamily: 'Share Tech Mono, monospace',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted-color)',
                            lineHeight: 1.6,
                            margin: 0,
                        }}
                    >
                        Every great burger has a story. {burger.name} was forged in the kitchens
                        of ByteBurger by the Grill Masters of 2087 — a class of fighter that
                        exists only to satisfy. Approach with respect. Consume with conviction.
                    </p>
                </div>
            </div>
        </div>
    )
}

// ─── Sides section ────────────────────────────────────────────────────────────

function SidesSection() {
    const bgRef = useParallax(0.12)
    const headerBgRef = useParallax(0.08)

    return (
        <section className={styles.menuSection} id="sides">
            <div ref={bgRef} className={styles.menuSectionBg} style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212, 168, 24, 0.06) 0%, transparent 70%)',
                inset: '-20%',
                position: 'absolute',
            }} />

            <div className={styles.levelHeader}>
                <div ref={headerBgRef} style={{ position: 'absolute', inset: '-20%', background: 'radial-gradient(ellipse at 50% 100%, rgba(212, 168, 24, 0.12) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
                <div className={styles.levelHeaderContent}>
                    <div className="bb-level-banner">
                        <span className="bb-level-num">03</span>
                        <span>SIDES &amp; COMPANIONS</span>
                    </div>
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-heading-color)', margin: 0 }}>
                        Choose Your Companion
                    </h2>
                    <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.76rem', color: 'var(--text-muted-color)', margin: 0 }}>
                        Every hero needs backup. Select your battle companion.
                    </p>
                </div>
            </div>

            <div className={styles.menuSectionInner}>
                <div className={styles.sidesGrid}>
                    {SIDES.map((item) => (
                        <div key={item.id} className="bb-menu-card">
                            <span className="bb-menu-icon">{item.emoji}</span>
                            <div className="bb-menu-info">
                                <span className="bb-menu-name">{item.name}</span>
                                <p className="bb-menu-desc">{item.description}</p>
                                {item.variants ? (
                                    <div className="bb-menu-tags">
                                        {item.variants.map((v) => (
                                            <span key={v.name} className="bb-tag bb-tag--gold">
                                                {v.name} {v.price}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bb-menu-tags">
                                        {item.tags.map((t) => (
                                            <span key={t} className={`bb-tag bb-tag--${t}`}>{t.toUpperCase()}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="bb-menu-price">{item.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── Drinks section ───────────────────────────────────────────────────────────

function DrinksSection() {
    const bgRef = useParallax(0.1)

    return (
        <section className={styles.menuSection} id="drinks" style={{ backgroundColor: 'var(--bg-secondary-color)' }}>
            <div ref={bgRef} style={{
                position: 'absolute',
                inset: '-20%',
                background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(212, 96, 16, 0.08) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 0,
            }} />

            <div className={styles.levelHeader} style={{ backgroundColor: 'var(--bg-inset-color)' }}>
                <div className={styles.levelHeaderContent}>
                    <div className="bb-level-banner">
                        <span className="bb-level-num">04</span>
                        <span>DRINKS &amp; POTIONS</span>
                    </div>
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-heading-color)', margin: 0 }}>
                        Power-Ups &amp; Potions
                    </h2>
                    <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.76rem', color: 'var(--text-muted-color)', margin: 0 }}>
                        Restore HP. Boost stamina. Survive the next level.
                    </p>
                </div>
            </div>

            <div className={styles.menuSectionInner}>
                <div className={styles.drinksGrid}>
                    {DRINKS.map((item) => (
                        <div key={item.id} className="bb-menu-card">
                            <span className="bb-menu-icon">{item.emoji}</span>
                            <div className="bb-menu-info">
                                <span className="bb-menu-name">{item.name}</span>
                                <p className="bb-menu-desc">{item.description}</p>
                                {item.sizes ? (
                                    <div className="bb-menu-tags">
                                        {item.sizes.map((s) => (
                                            <span key={s.name} className="bb-tag bb-tag--gold">
                                                {s.name} {s.price}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bb-menu-tags">
                                        {item.tags.map((t) => (
                                            <span key={t} className={`bb-tag bb-tag--${t}`}>{t.toUpperCase()}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="bb-menu-price">{item.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenuPage() {
    const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null)
    const heroBgRef = useParallax(0.15)

    function handleSelect(burger: Burger) {
        setSelectedBurger((prev) => (prev?.id === burger.id ? null : burger))
    }

    return (
        <div className={styles.menuPage}>

            {/* ── Menu Hero ────────────────────────────────────────────────── */}
            <div className={styles.menuHero}>
                <div ref={heroBgRef} style={{ position: 'absolute', inset: '-20%', pointerEvents: 'none', zIndex: 0 }} />
                <div className={styles.menuHeroContent}>
                    <span className={styles.menuHeroEmoji}>🎮</span>
                    <h1 className={styles.menuHeroTitle}>THE MENU</h1>
                    <p className={styles.menuHeroSub}>SELECT YOUR STAGE · CHOOSE YOUR FIGHTER · EAT</p>
                </div>
            </div>

            {/* ── HUD Bar ──────────────────────────────────────────────────── */}
            <div className="bb-hud-bar">
                <span>MENU v2.087 — ALL ITEMS AVAILABLE</span>
                <span className="bb-hud-score">5 FIGHTERS · 6 SIDES · 8 DRINKS</span>
                <span className="bb-hud-lives">♥ ♥ ♥</span>
            </div>

            {/* ── STAGE 02 — CHARACTER SELECT ───────────────────────────── */}
            <section className={styles.menuSection} id="burgers">
                <div className={styles.levelHeader}>
                    <div className={styles.levelHeaderContent}>
                        <div className="bb-level-banner">
                            <span className="bb-level-num">02</span>
                            <span>CHOOSE YOUR FIGHTER</span>
                        </div>
                        <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-heading-color)', margin: 0 }}>
                            The Burger Roster
                        </h2>
                        <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.76rem', color: 'var(--text-muted-color)', margin: 0 }}>
                            Select a fighter to reveal their full stats and lore. Choose wisely.
                        </p>
                    </div>
                </div>

                <div className={styles.menuSectionInner}>
                    <CharacterSelect selected={selectedBurger} onSelect={handleSelect} />

                    <p className={styles.characterSelectLabel}>
                        {selectedBurger
                            ? `▲ ${selectedBurger.name.toUpperCase()} SELECTED — STATS LOADING BELOW`
                            : 'SELECT A BURGER TO SEE FULL STATS AND LORE'}
                    </p>

                    {selectedBurger ? (
                        <BurgerDetailPanel burger={selectedBurger} />
                    ) : (
                        <div className={styles.noSelection}>
                            &gt;_ NO FIGHTER SELECTED · CLICK A CARD TO ENTER THE ARENA
                        </div>
                    )}
                </div>
            </section>

            <div className={styles.sectionDivider} />

            {/* ── STAGE 03 — SIDES ─────────────────────────────────────────── */}
            <SidesSection />

            <div className={styles.sectionDivider} />

            {/* ── STAGE 04 — DRINKS ────────────────────────────────────────── */}
            <DrinksSection />

        </div>
    )
}
