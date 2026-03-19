import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Code, PlusCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Developer Portal — Realms & Beyond',
}

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_SERVER_URL ?? 'http://localhost:2611'

async function getVentures(authToken: string) {
    const res = await fetch(`${AUTH_API}/api/v1/user/me`, {
        headers: { Cookie: `auth_token=${authToken}` },
        cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json() as { user: { ventures?: Array<{ ventureName: string; clientId?: string; thirdParty?: boolean; status: string }> } }
    return data.user.ventures ?? []
}

export default async function DeveloperPage() {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
        redirect('/login')
    }

    const ventures = await getVentures(authToken)

    if (!ventures) {
        redirect('/login')
    }

    return (
        <main className="account-page">
            <div className="account-page__header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>
                            <Code size={20} strokeWidth={1.5} style={{ display: 'inline', marginRight: '8px' }} />
                            Developer Portal
                        </h1>
                        <p>Register and manage OAuth applications for the Realms &amp; Beyond platform.</p>
                    </div>
                    <Link href="/developer/register" className="btn btn--primary btn--sm">
                        <PlusCircle size={14} strokeWidth={2} />
                        Register App
                    </Link>
                </div>
            </div>

            <div className="account-page__section">
                <h2>Your Registered Apps</h2>
                {ventures.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-color)' }}>
                        No apps registered yet.{' '}
                        <Link href="/developer/register">Register your first app.</Link>
                    </p>
                ) : (
                    ventures.map((v) => (
                        <div key={v.clientId ?? v.ventureName} className="account-page__row">
                            <span>
                                {v.ventureName}
                                {v.thirdParty && (
                                    <span style={{ marginLeft: '6px', fontSize: '0.75rem', color: 'var(--text-muted-color)' }}>
                                        (third-party)
                                    </span>
                                )}
                            </span>
                            <span className="account-page__badge">{v.status}</span>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}
