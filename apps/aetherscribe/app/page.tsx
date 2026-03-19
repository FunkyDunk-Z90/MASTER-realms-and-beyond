'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@rnb/ui'

// ─── Landing / Auth Gate ──────────────────────────────────────────────────────
// Unauthenticated → hero + SSO sign-in link.
// Authenticated, no Aetherscribe account → /onboarding.
// Fully set up → /hub.
//
// Auth is handled via the R&B SSO system. Clicking "Enter the Codex" starts
// the OAuth flow at /api/auth/initiate → auth server → /api/auth/callback.

export default function Landing() {
    const { user, isLoading, hasAetherscribeAccount } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return
        if (!user) return // show sign-in
        if (hasAetherscribeAccount) {
            router.replace('/hub')
        } else {
            router.replace('/onboarding')
        }
    }, [user, isLoading, hasAetherscribeAccount, router])

    // Show nothing while session resolves or while redirecting
    if (isLoading || user) return null

    return (
        <main className="landing-page">
            <div className="landing-particles" aria-hidden="true" />
            <div className="landing-hero">
                <h1 className="landing-title" data-text="Aetherscribe">
                    Aetherscribe
                </h1>
                <p className="landing-subtitle">Inscribe your world. Command your lore.</p>
            </div>

            <div className="landing-auth">
                <a href="/api/auth/initiate?returnTo=/hub" className="btn btn--gold">
                    Enter the Codex
                </a>
            </div>
        </main>
    )
}
