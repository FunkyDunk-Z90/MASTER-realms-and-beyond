'use client'

import { Navbar, Footer, AuthGuard, useAuth } from '@rnb/ui'
import { aetherscribeLogo } from '@rnb/assets'
import { navLinks } from '@/data/navLinks'

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { logout } = useAuth()

    return (
        <AuthGuard>
            <Navbar
                headerIcon={aetherscribeLogo}
                headerTitle="Aetherscribe"
                navItems={navLinks}
                onLogout={logout}
            />
            <main className="page-wrapper">{children}</main>
            <Footer appName="Aetherscribe" />
        </AuthGuard>
    )
}
