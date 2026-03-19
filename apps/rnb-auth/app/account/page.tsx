import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { LogOut, User, Shield, Bell, Layers } from 'lucide-react'

export const metadata: Metadata = {
    title: 'My Account — Realms & Beyond',
}

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_SERVER_URL ?? 'http://localhost:2611'

async function getUser(authToken: string) {
    const res = await fetch(`${AUTH_API}/api/v1/user/me`, {
        headers: { Cookie: `auth_token=${authToken}` },
        cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json() as { user: Record<string, unknown> }
    return data.user
}

export default async function AccountPage() {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
        redirect('/login')
    }

    const user = await getUser(authToken)

    if (!user) {
        redirect('/login')
    }

    const profile = user.profile as Record<string, string> | undefined
    const verification = user.verification as Record<string, boolean> | undefined
    const preferences = user.preferences as Record<string, string> | undefined
    const services = user.services as Array<{ serviceName: string; status: string; linkedAt: string }> | undefined

    const displayName = profile
        ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
        : 'Unknown'

    return (
        <main className="account-page">
            {/* Header */}
            <div className="account-page__header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Welcome, {displayName}</h1>
                        <p>Manage your Realms & Beyond identity and connected services.</p>
                    </div>
                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="btn btn--ghost btn--sm">
                            <LogOut size={14} strokeWidth={2} />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>

            <div className="account-page__grid">
                {/* Profile */}
                <div className="account-page__section">
                    <h2>
                        <User size={12} strokeWidth={2} style={{ display: 'inline', marginRight: '6px' }} />
                        Profile
                    </h2>
                    <div className="account-page__row">
                        <span>First name</span>
                        <span>{profile?.firstName ?? '—'}</span>
                    </div>
                    <div className="account-page__row">
                        <span>Last name</span>
                        <span>{profile?.lastName ?? '—'}</span>
                    </div>
                    <div className="account-page__row">
                        <span>Email</span>
                        <span>{profile?.email ?? '—'}</span>
                    </div>
                    <div className="account-page__row">
                        <span>Nationality</span>
                        <span>{profile?.nationality ?? '—'}</span>
                    </div>
                </div>

                {/* Security */}
                <div className="account-page__section">
                    <h2>
                        <Shield size={12} strokeWidth={2} style={{ display: 'inline', marginRight: '6px' }} />
                        Security
                    </h2>
                    <div className="account-page__row">
                        <span>Email verified</span>
                        <span>
                            {verification?.emailVerified
                                ? <span className="account-page__badge">Verified</span>
                                : '—'}
                        </span>
                    </div>
                    <div className="account-page__row">
                        <span>Two-factor auth</span>
                        <span>
                            {verification?.twoFactorEnabled
                                ? <span className="account-page__badge">Enabled</span>
                                : 'Disabled'}
                        </span>
                    </div>
                    <div className="account-page__row">
                        <span>Identity verified</span>
                        <span>
                            {verification?.identityVerified
                                ? <span className="account-page__badge">Verified</span>
                                : '—'}
                        </span>
                    </div>
                </div>

                {/* Preferences */}
                <div className="account-page__section">
                    <h2>
                        <Bell size={12} strokeWidth={2} style={{ display: 'inline', marginRight: '6px' }} />
                        Preferences
                    </h2>
                    <div className="account-page__row">
                        <span>Language</span>
                        <span>{preferences?.language ?? 'en'}</span>
                    </div>
                    <div className="account-page__row">
                        <span>Timezone</span>
                        <span>{preferences?.timezone ?? '—'}</span>
                    </div>
                    <div className="account-page__row">
                        <span>Theme</span>
                        <span>{preferences?.theme ?? 'system'}</span>
                    </div>
                    <div className="account-page__row">
                        <span>Currency</span>
                        <span>{preferences?.currency ?? '—'}</span>
                    </div>
                </div>

                {/* Connected services */}
                <div className="account-page__section">
                    <h2>
                        <Layers size={12} strokeWidth={2} style={{ display: 'inline', marginRight: '6px' }} />
                        Connected Services
                    </h2>
                    {services && services.length > 0 ? (
                        services.map((svc) => (
                            <div key={svc.serviceName} className="account-page__row">
                                <span>{svc.serviceName}</span>
                                <span className="account-page__badge">{svc.status}</span>
                            </div>
                        ))
                    ) : (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted-color)' }}>
                            No connected services yet.
                        </p>
                    )}
                </div>
            </div>
        </main>
    )
}
