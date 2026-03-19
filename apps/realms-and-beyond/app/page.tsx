import {
    BookOpen,
    UtensilsCrossed,
    Monitor,
    Compass,
    Zap,
    Users,
    Shield,
    Globe,
    ArrowRight,
} from 'lucide-react'

// ─── Static data — replace with CMS/API calls when content exists ─────────────

const APPS = [
    {
        name: 'Aetherscribe',
        icon: BookOpen,
        desc: 'A worldbuilding and campaign management platform for tabletop roleplayers and storytellers. Inscribe your worlds, characters, and lore.',
        status: 'beta' as const,
        href: '#',
    },
    {
        name: 'Byte Burger',
        icon: UtensilsCrossed,
        desc: 'A modern food ordering experience with a retro aesthetic. Fresh technology, classic flavours.',
        status: 'coming-soon' as const,
        href: '#',
    },
    {
        name: 'Nexus Serve',
        icon: Monitor,
        desc: 'Point-of-sale and employee management for hospitality operations. Precision tools for front-of-house teams.',
        status: 'coming-soon' as const,
        href: '#',
    },
]

const NEWS = [
    {
        tag: 'Announcement',
        date: 'March 2026',
        title: 'Aetherscribe Enters Private Beta',
        excerpt:
            'Our worldbuilding platform is now in private beta. If you signed up for early access, watch your inbox — invites are rolling out this week.',
        href: '#',
    },
    {
        tag: 'Dev Update',
        date: 'February 2026',
        title: 'SSO Identity System Now Live Across All R&B Apps',
        excerpt:
            "We've shipped a centralised OAuth identity layer. One account, every product. Sign in once, stay signed in everywhere.",
        href: '#',
    },
    {
        tag: 'Company',
        date: 'January 2026',
        title: 'Welcome to Realms & Beyond',
        excerpt:
            "We're a small team building tools at the intersection of storytelling, hospitality, and craftsmanship. This is where it starts.",
        href: '#',
    },
]

const VALUES = [
    {
        icon: Compass,
        name: 'Craft',
        desc: 'Every detail is considered. We build things that feel good to use.',
    },
    {
        icon: Zap,
        name: 'Precision',
        desc: 'Clean systems, tight scope, no bloat. Quality over quantity.',
    },
    {
        icon: Users,
        name: 'Community',
        desc: 'Built for the people who use it, shaped by their feedback.',
    },
    {
        icon: Shield,
        name: 'Trust',
        desc: "Your data is yours. We don't sell it, we protect it.",
    },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
    return (
        <div className="landing">
            {/* ── Header ── */}
            <header className="site-header">
                <a href="/" className="site-header__brand">
                    Realms & Beyond
                </a>
                <nav className="site-header__nav">
                    <a href="#apps">Products</a>
                    <a href="#news">Updates</a>
                    <a href="#about">About</a>
                </nav>
                <a
                    href={`${process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3001'}/login`}
                    className="btn btn--ghost btn--sm site-header__cta"
                >
                    Sign In
                </a>
            </header>

            {/* ── Hero ── */}
            <section className="hero">
                <p className="hero__eyebrow">Realms & Beyond</p>
                <h1 className="hero__title">
                    Tools for Adventure, Craft, and Creation
                </h1>
                <p className="hero__sub">
                    We build purposeful software for storytellers, hospitality
                    teams, and everyday creators — united under a single
                    identity.
                </p>
                <div className="hero__actions">
                    <a href="#apps" className="btn btn--primary">
                        Explore Products
                        <ArrowRight size={15} strokeWidth={2} />
                    </a>
                    <a href="#about" className="btn btn--ghost">
                        Our Story
                    </a>
                </div>
            </section>

            {/* ── Apps ── */}
            <section id="apps" className="section section--alt">
                <div className="section__inner">
                    <p className="section__label">Products</p>
                    <h2 className="section__title">The R&B Suite</h2>
                    <p className="section__body">
                        Each product is purpose-built for its domain, sharing
                        one identity system so you only ever need one account.
                    </p>
                    <div className="app-grid">
                        {APPS.map((app) => {
                            const Icon = app.icon
                            return (
                                <a
                                    key={app.name}
                                    href={app.href}
                                    className="app-card"
                                >
                                    <div className="app-card__icon">
                                        <Icon size={18} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="app-card__name">
                                        {app.name}
                                    </h3>
                                    <p className="app-card__desc">{app.desc}</p>
                                    <span
                                        className={`app-card__status app-card__status--${app.status}`}
                                    >
                                        {app.status === 'coming-soon'
                                            ? 'Coming Soon'
                                            : app.status}
                                    </span>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── Manifesto ── */}
            <section className="manifesto">
                <blockquote className="manifesto__quote">
                    "We believe great software should feel like it was made by
                    someone who cared."
                </blockquote>
                <p className="manifesto__attr">— Realms & Beyond</p>
            </section>

            {/* ── News ── */}
            <section id="news" className="section section--alt">
                <div className="section__inner">
                    <p className="section__label">Updates</p>
                    <h2 className="section__title">Latest News</h2>
                    <div className="news-grid">
                        {NEWS.map((item) => (
                            <article key={item.title} className="news-card">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span className="news-card__tag">
                                        {item.tag}
                                    </span>
                                    <span className="news-card__date">
                                        {item.date}
                                    </span>
                                </div>
                                <h3 className="news-card__title">
                                    {item.title}
                                </h3>
                                <p className="news-card__excerpt">
                                    {item.excerpt}
                                </p>
                                <a
                                    href={item.href}
                                    className="news-card__read-more"
                                >
                                    Read more →
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── About / Values ── */}
            <section id="about" className="section">
                <div className="section__inner">
                    <p className="section__label">About</p>
                    <h2 className="section__title">What We Stand For</h2>
                    <p className="section__body">
                        Realms & Beyond is a small, independent holding company.
                        We make software that we'd want to use ourselves —
                        thoughtful, durable, and free of dark patterns.
                    </p>
                    <div className="values-grid">
                        {VALUES.map((v) => {
                            const Icon = v.icon
                            return (
                                <div key={v.name} className="value-item">
                                    <div className="value-item__icon">
                                        <Icon size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="value-item__name">
                                        {v.name}
                                    </span>
                                    <p className="value-item__desc">{v.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── Global SSO notice ── */}
            <section
                className="section section--alt"
                style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
            >
                <div
                    className="section__inner"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <Globe
                        size={28}
                        strokeWidth={1.5}
                        style={{ color: 'var(--primary-color)' }}
                    />
                    <h2 className="section__title" style={{ marginBottom: 0 }}>
                        One Account. Every Experience.
                    </h2>
                    <p
                        style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted-color)',
                            maxWidth: '480px',
                            lineHeight: '1.7',
                        }}
                    >
                        Create a single Realms & Beyond account and use it
                        across every app in our suite — no duplicate
                        registrations, no forgotten passwords per product.
                    </p>
                    <a
                        href={`${process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3001'}/register`}
                        className="btn btn--primary"
                    >
                        Create Free Account
                        <ArrowRight size={15} strokeWidth={2} />
                    </a>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="site-footer">
                <span className="site-footer__brand">Realms & Beyond</span>
                <div className="site-footer__links">
                    <a href="#apps">Products</a>
                    <a href="#news">Updates</a>
                    <a href="#about">About</a>
                    <a
                        href={`${process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3001'}/account`}
                    >
                        My Account
                    </a>
                </div>
                <span>
                    © {new Date().getFullYear()} Realms & Beyond. All rights
                    reserved.
                </span>
            </footer>
        </div>
    )
}
