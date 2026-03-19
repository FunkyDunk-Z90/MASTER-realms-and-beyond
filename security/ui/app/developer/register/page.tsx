import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import RegisterAppForm from './RegisterAppForm'

export const metadata: Metadata = {
    title: 'Register App — Developer Portal',
}

export default function RegisterAppPage() {
    return (
        <main className="account-page">
            <div className="account-page__header">
                <Link href="/developer" className="btn btn--ghost btn--sm" style={{ marginBottom: '1rem' }}>
                    <ArrowLeft size={14} strokeWidth={2} />
                    Back to Portal
                </Link>
                <h1>Register an App</h1>
                <p>Fill in the details below to register a new OAuth application.</p>
            </div>

            <div className="account-page__section">
                <RegisterAppForm />
            </div>
        </main>
    )
}
