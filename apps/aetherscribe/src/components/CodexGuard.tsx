'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCodex } from '@/src/context/CodexContext'
import { Spinner } from '@rnb/ui'

// ─── CodexGuard ───────────────────────────────────────────────────────────────
// Redirects to /hub/setup-codex if the user has no codices after loading.
// Must be rendered inside <CodexProvider>.

export default function CodexGuard({ children }: { children: React.ReactNode }) {
    const { codices, isLoading } = useCodex()
    const router = useRouter()
    const pathname = usePathname()

    const isSetupPage = pathname === '/hub/setup-codex'

    useEffect(() => {
        if (!isLoading && codices.length === 0 && !isSetupPage) {
            router.replace('/hub/setup-codex')
        }
    }, [isLoading, codices.length, isSetupPage, router])

    if (isLoading) {
        return isSetupPage ? <Spinner size="lg" fullArea /> : null
    }

    return <>{children}</>
}
