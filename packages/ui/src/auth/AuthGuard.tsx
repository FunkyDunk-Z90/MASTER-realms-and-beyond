'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

// ─── AuthGuard ────────────────────────────────────────────────────────────────
// Wrap any protected layout or page with this component.
// While the session check is in-flight → spinner.
// Not authenticated → redirect to /
// Authenticated but no Aetherscribe account → redirect to /onboarding
// Fully set up → render children.

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user, isLoading, hasAetherscribeAccount } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return
        if (!user) {
            router.replace('/')
            return
        }
        if (!hasAetherscribeAccount) {
            router.replace('/onboarding')
        }
    }, [user, isLoading, hasAetherscribeAccount, router])

    if (isLoading) {
        return (
            <div className="auth-loading">
                <div className="auth-loading__spinner" />
            </div>
        )
    }

    if (!user || !hasAetherscribeAccount) return null

    return <>{children}</>
}
