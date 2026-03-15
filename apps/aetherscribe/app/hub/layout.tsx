'use client'

import { Navbar, Footer, Sidebar, AuthGuard, useAuth } from '@rnb/ui'
import type { I_SearchResult } from '@rnb/ui'
import { aetherscribeLogo } from '@rnb/assets'
import { sidebarData } from '@/data/sidebarSections'
import { navLinks } from '@/data/navLinks'
import {
    testAccountContent,
    categoryMeta,
    T_ContentCategory,
} from '@/data/aetherscribeData'

// ─── Search ───────────────────────────────────────────────────────────────────

const MAX_RESULTS = 8

function buildSearchFn() {
    return (query: string): I_SearchResult[] => {
        if (!query.trim()) return []
        const q = query.toLowerCase()
        const results: I_SearchResult[] = []

        for (const key in testAccountContent) {
            const category = key as T_ContentCategory
            const meta = categoryMeta[category]
            for (const item of testAccountContent[category]) {
                if (item.contentName.toLowerCase().includes(q)) {
                    results.push({
                        id: item.contentId,
                        label: item.contentName,
                        href: `${meta.href}/${item.contentId as string}`,
                    })
                    if (results.length >= MAX_RESULTS) return results
                }
            }
        }
        return results
    }
}

const searchFn = buildSearchFn()

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function HubLayout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth()

    return (
        <AuthGuard>
            <Navbar
                headerIcon={aetherscribeLogo}
                headerTitle="Aetherscribe"
                navItems={navLinks}
                onLogout={logout}
            />
            <main className="page-wrapper">
                <Sidebar
                    sections={sidebarData}
                    searchFn={searchFn}
                    defaultOpen={false}
                />
                <section className="section-wrapper">{children}</section>
            </main>
            <Footer appName="Aetherscribe" />
        </AuthGuard>
    )
}
