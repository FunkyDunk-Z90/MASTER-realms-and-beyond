'use client'

import { useCallback } from 'react'
import { Navbar, Footer, Sidebar, AuthGuard } from '@rnb/ui'
import { aetherscribeLogo } from '@rnb/assets'
import { navLinks } from '@/data/navLinks'
import { CodexProvider, useCodex } from '@/src/context/CodexContext'
import { getSidebarSections } from '@/data/sidebarSections'
import CodexSelector from '@/src/components/CodexSelector'
import CodexNameBadge from '@/src/components/CodexNameBadge'
import CodexGuard from '@/src/components/CodexGuard'

// ─── HubInner ─────────────────────────────────────────────────────────────────
// Rendered inside <CodexProvider> so it can call useCodex().
// Passes a stable factory function to <Sidebar> so sections update whenever
// the active codex changes without recreating the Sidebar from scratch.

function HubInner({
    children,
    logout,
}: {
    children: React.ReactNode
    logout: () => void
}) {
    const { activeCodex } = useCodex()

    const sections = useCallback(
        () => getSidebarSections(activeCodex?.id ?? ''),
        [activeCodex?.id]
    )

    return (
        <>
            <Navbar
                headerIcon={aetherscribeLogo}
                headerTitle="Aetherscribe"
                navItems={navLinks}
                onLogout={logout}
            />
            <main className="page-wrapper">
                <Sidebar
                    sections={sections}
                    footer={<CodexSelector />}
                    headerSlot={<CodexNameBadge />}
                    defaultOpen={false}
                />
                <section className="section-wrapper">
                    <CodexGuard>{children}</CodexGuard>
                </section>
            </main>
            <Footer appName="Aetherscribe" />
        </>
    )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function HubLayout({ children }: { children: React.ReactNode }) {
    // Full SSO logout: clears auth_token cookie + destroys SSO session on auth server.
    // Uses window.location for a hard redirect so AuthProvider re-mounts fresh
    // and session state is guaranteed clean on the landing page.
    const handleLogout = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        window.location.href = '/'
    }, [])

    return (
        <AuthGuard>
            <CodexProvider>
                <HubInner logout={handleLogout}>{children}</HubInner>
            </CodexProvider>
        </AuthGuard>
    )
}
