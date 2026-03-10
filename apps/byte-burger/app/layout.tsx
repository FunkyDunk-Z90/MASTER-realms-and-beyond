import type { Metadata } from 'next'
import Link from 'next/link'
import '@rnb/styles'
import './globals.css'
import './byte-burger.scss'

export const metadata: Metadata = {
    title: 'ByteBurger — Level Up Your Lunch',
    description: 'Retro arcade burgers. Choose your fighter. Eat your fill.',
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-theme="byte-burger" suppressHydrationWarning>
            <body>
                <header className="bb-nav">
                    <div className="bb-nav__inner">
                        <Link href="/" className="bb-nav__logo">
                            <span className="bb-nav__logo-icon">🍔</span>
                            <span className="bb-nav__logo-text">
                                BYTE<span className="bb-nav__logo-accent">BURGER</span>
                            </span>
                        </Link>

                        <nav className="bb-nav__links">
                            <Link href="/" className="bb-nav__link">Home</Link>
                            <Link href="/menu" className="bb-nav__link">Menu</Link>
                            <Link href="/menu#burgers" className="bb-nav__link">Burgers</Link>
                            <Link href="/menu#sides" className="bb-nav__link">Sides</Link>
                            <Link href="/menu#drinks" className="bb-nav__link">Drinks</Link>
                        </nav>

                        <div className="bb-nav__actions">
                            <div className="bb-hud-score">HI-SCORE: 99,999</div>
                            <button className="btn btn-order btn-sm">ORDER NOW</button>
                        </div>
                    </div>
                </header>

                <main>{children}</main>

                <footer className="bb-footer">
                    <div className="bb-footer__inner">
                        <div className="bb-footer__brand">
                            <span className="bb-gold-text" style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, letterSpacing: '0.1em' }}>
                                BYTEBURGER
                            </span>
                            <span className="bb-boot-line bb-boot-line--dim">© 2087 ByteBurger Corp. All rights reserved.</span>
                        </div>
                        <div className="bb-footer__links">
                            <Link href="/menu" className="bb-footer__link">Full Menu</Link>
                            <Link href="/" className="bb-footer__link">Home</Link>
                        </div>
                        <div className="bb-boot-line bb-boot-line--dim" style={{ fontSize: '0.62rem', letterSpacing: '0.14em' }}>
                            INSERT COIN TO CONTINUE
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    )
}
