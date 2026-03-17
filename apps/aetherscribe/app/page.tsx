'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, AuthForm } from '@rnb/ui'

// ─── Landing / Auth Gate ──────────────────────────────────────────────────────
// Unauthenticated → hero + auth form.
// Authenticated, no Aetherscribe account → /onboarding.
// Fully set up → /hub.

export default function Landing() {
    const { user, isLoading, hasAetherscribeAccount } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return
        if (!user) return // show the form
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
            {/* <div className="landing-mist"      aria-hidden="true" /> */}
            <div className="landing-particles" aria-hidden="true" />
            <div className="landing-hero">
                <h1 className="landing-title" data-text="Aetherscribe">
                    Aetherscribe
                </h1>
            </div>

            <AuthForm />
        </main>
    )
}
