'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, OnboardingForm } from '@rnb/ui'

// ─── Onboarding ───────────────────────────────────────────────────────────────
// Shown to authenticated users who don't yet have an Aetherscribe account.
// Unauthenticated → /
// Already has account → /hub

export default function Onboarding() {
    const { user, isLoading, hasAetherscribeAccount } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return
        if (!user) {
            router.replace('/')
            return
        }
        if (hasAetherscribeAccount) {
            router.replace('/hub')
        }
    }, [user, isLoading, hasAetherscribeAccount, router])

    if (isLoading || !user || hasAetherscribeAccount) return null

    return (
        <main className="onboarding-page">
            <div className="onboarding-hero">
                <h1 className="landing-title">Set Up Your Account</h1>
                <p className="landing-subtitle">
                    Welcome, {user.profile.firstName}. Let&apos;s get you
                    started.
                </p>
            </div>

            <OnboardingForm onSuccess={() => router.replace('/hub')} />
        </main>
    )
}
