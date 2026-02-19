'use client'

import { Sidebar } from '@rnb/ui'
import { docsSections } from './(data)/navLinks'
// import './_docs.scss'

// Sections
import IntroSection from './(sections)/IntroSection'
import DesignTokensSection from './(sections)/DesignTokenSection'
import CssVarsSection from './(sections)/CssVarsSection'
import LayoutSection from './(sections)/Layoutsection'
import ButtonSection from './(sections)/Buttonsection'
import DropdownSection from './(sections)/Dropdownsection'
import HeaderSection from './(sections)/Headersection'
import NavbarSection from './(sections)/Navbarsection'
import SidebarSection from './(sections)/Sidebarsection'
import FooterSection from './(sections)/Footersection'
import MonorepoSection from './(sections)/Monoreposection'
import ThemingSection from './(sections)/Themingsection'
import TypesSection from './(sections)/Typessection'

export default function DocsPage() {
    return (
        <div className="docs-shell">
            {/* ── Desktop sidebar nav (self-managed) ── */}
            <Sidebar
                sections={docsSections}
                footer={
                    <p className="docs-sidebar-footer-text">@rnb/ui · v1.0</p>
                }
            />

            {/* ── Main content ── */}
            <main className="docs-main">
                {/* Hero */}
                <div className="docs-hero">
                    <p className="docs-eyebrow">Component Library Reference</p>
                    <h1 className="docs-h1">
                        @rnb/<em>ui</em> Docs
                    </h1>
                    <p className="docs-hero-sub">
                        A production-ready component library for Next.js 14 App
                        Router, TypeScript and SCSS. Every component is
                        server-component-safe by default —{' '}
                        <code className="docs-code-inline">
                            &#39;use client&#39;
                        </code>{' '}
                        is added only where interactivity requires it.
                    </p>
                    <div className="docs-badges">
                        {[
                            'Next.js App Router',
                            'SCSS Design System',
                            'Dark Mode',
                            'Accessible (ARIA)',
                            'Monorepo-ready',
                        ].map((b) => (
                            <span key={b} className="docs-badge">
                                {b}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Overview */}
                <IntroSection />
                <DesignTokensSection />
                <CssVarsSection />
                <LayoutSection />

                <hr className="docs-divider" />

                {/* Components */}
                <ButtonSection />
                <DropdownSection />
                <HeaderSection />
                <NavbarSection />
                <SidebarSection />
                <FooterSection />

                <hr className="docs-divider" />

                {/* Usage */}
                <MonorepoSection />
                <ThemingSection />
                <TypesSection />
            </main>
        </div>
    )
}
