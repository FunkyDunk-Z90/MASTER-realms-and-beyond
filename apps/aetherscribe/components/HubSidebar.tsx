'use client'

// components/HubSidebar.tsx
//
// Client component wrapper that owns the AetherScribe search logic.
// The layout (a Server Component) renders this instead of <Sidebar> directly,
// which means no function ever crosses the RSC → Client boundary.
//
// When the server is ready, replace `testAccountContent` with data fetched
// via a hook (SWR, React Query, etc.) — the rest stays identical.

import { Sidebar, I_SearchResult, I_SidebarSection } from '@rnb/ui'
import {
    testAccountContent,
    categoryMeta,
    T_ContentCategory,
} from '@/data/aetherscribeData'
import { I_AetherScribeContent, I_ContentObj } from '@rnb/types'
import { useCallback } from 'react'

// ─── Search helpers ───────────────────────────────────────────────────────────

const MAX_RESULTS = 8

function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][]
}

function buildSearchFn(
    content: I_AetherScribeContent
): (query: string) => I_SearchResult[] {
    return (query: string): I_SearchResult[] => {
        if (!query.trim()) return []
        const q = query.toLowerCase()
        const results: I_SearchResult[] = []

        for (const [key, items] of typedEntries(content)) {
            const meta = categoryMeta[key as T_ContentCategory]
            for (const item of items as I_ContentObj[]) {
                if (item.contentName.toLowerCase().includes(q)) {
                    results.push({
                        id: item.contentId,
                        label: item.contentName,
                        href: `${meta.href}/${item.contentId}`,
                    })
                    if (results.length >= MAX_RESULTS) return results
                }
            }
        }
        return results
    }
}

// Built once at module level — stable reference, no recreation on re-renders.
const searchFn = buildSearchFn(testAccountContent)

// ─── Component ────────────────────────────────────────────────────────────────

interface I_HubSidebarProps {
    sections: I_SidebarSection[]
}

export const HubSidebar = ({ sections }: I_HubSidebarProps) => {
    // Wrap in useCallback so the reference stays stable if this component
    // ever re-renders (e.g. after swapping in live data).
    const stableSearchFn = useCallback(searchFn, [])

    return <Sidebar sections={sections} searchFn={stableSearchFn} />
}
