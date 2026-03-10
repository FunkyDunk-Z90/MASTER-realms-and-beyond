'use client'

// app/hub/layout.tsx
//
// Client component so the searchFn (a function) can be passed to <Sidebar>
// without crossing the RSC boundary. Page children are still server-rendered
// via Next.js's RSC protocol — making a layout 'use client' does not opt
// page children out of server rendering.

import { Sidebar, I_SearchResult } from '@rnb/ui'
import { sidebarData } from '@/data/sidebarSections'
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

// Built once at module level — stable reference across re-renders.
const searchFn = buildSearchFn()

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function HubLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Sidebar sections={sidebarData} searchFn={searchFn} />
            <section className="section-wrapper">{children}</section>
        </>
    )
}
