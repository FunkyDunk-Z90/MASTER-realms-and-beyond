'use client'

import { useCodex } from '@/src/context/CodexContext'

// ─── CodexNameBadge ───────────────────────────────────────────────────────────
// Rendered in the sidebar headerSlot — shows the active codex name as plain
// text. Updates live as the active codex changes. Hidden when collapsed.

export default function CodexNameBadge() {
    const { activeCodex, isLoading } = useCodex()

    if (isLoading || !activeCodex) return null

    return (
        <span className="sidebar-header-name">{activeCodex.name}</span>
    )
}
