import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Copy } from 'lucide-react'

export const metadata: Metadata = {
    title: 'App Details — Developer Portal',
}

interface PageProps {
    params: Promise<{ clientId: string }>
    searchParams: Promise<{ secret?: string }>
}

export default async function AppDetailPage({ params, searchParams }: PageProps) {
    const { clientId } = await params
    const { secret } = await searchParams

    const isFirstView = Boolean(secret)

    return (
        <main className="account-page">
            <div className="account-page__header">
                <Link href="/developer" className="btn btn--ghost btn--sm" style={{ marginBottom: '1rem' }}>
                    <ArrowLeft size={14} strokeWidth={2} />
                    Back to Portal
                </Link>
                <h1>App Registered</h1>
                <p>Your OAuth application has been registered successfully.</p>
            </div>

            {isFirstView && (
                <div className="account-page__section" style={{ borderColor: 'var(--warning-color)' }}>
                    <h2>
                        <AlertTriangle size={14} strokeWidth={2} style={{ display: 'inline', marginRight: '6px', color: 'var(--warning-color)' }} />
                        Save Your Client Secret
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-color)', marginBottom: '0.75rem' }}>
                        This is the only time your client secret will be shown. Copy it now — it cannot be recovered later.
                    </p>
                    <div className="account-page__row" style={{ background: 'var(--bg-inset-color)', padding: '0.5rem', borderRadius: 'var(--border-radius)', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                        <span>{secret}</span>
                        <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            onClick={() => navigator.clipboard.writeText(secret ?? '')}
                            title="Copy to clipboard"
                        >
                            <Copy size={12} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            )}

            <div className="account-page__section">
                <h2>App Details</h2>
                <div className="account-page__row">
                    <span>Client ID</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{clientId}</span>
                </div>
                <div className="account-page__row">
                    <span>Client Secret</span>
                    <span style={{ color: 'var(--text-muted-color)', fontSize: '0.85rem' }}>
                        {isFirstView ? '(shown above — save it now)' : '(hidden — not recoverable)'}
                    </span>
                </div>
            </div>
        </main>
    )
}
