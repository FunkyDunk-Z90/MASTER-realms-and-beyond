'use client'

import { useCallback } from 'react'
import { Navbar, Footer, AuthGuard } from '@rnb/ui'
import { aetherscribeLogo } from '@rnb/assets'
import { navLinks } from '@/data/navLinks'

export default function MyAccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const handleLogout = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        window.location.href = '/'
    }, [])

    return (
        <AuthGuard>
            <Navbar
                headerIcon={aetherscribeLogo}
                headerTitle="Aetherscribe"
                navItems={navLinks}
                onLogout={handleLogout}
            />
            <main className="page-wrapper">{children}</main>
            <Footer appName="Aetherscribe" />
        </AuthGuard>
    )
}
