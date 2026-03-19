import type { Metadata } from 'next'
import { AlertCircle, Shield } from 'lucide-react'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
    title: 'Create Account — Realms & Beyond',
}

const ERROR_MESSAGES: Record<string, string> = {
    password_weak: 'Password must be at least 8 characters with uppercase, lowercase, number, and symbol.',
    email_taken: 'An account with that email already exists.',
    session_expired: 'Your session expired. Please start again from the app you were trying to access.',
}

interface PageProps {
    searchParams: Promise<{
        app_name?: string   // name of the app requesting access (display only)
        client_id?: string  // requesting client (passed for UX context)
        error?: string
    }>
}

export default async function RegisterPage({ searchParams }: PageProps) {
    const params = await searchParams
    const { app_name, error } = params

    const isOAuthFlow = Boolean(app_name)
    const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Something went wrong. Please try again.') : null

    const authServerUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL ?? 'http://localhost:2611'

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                {/* Brand */}
                <div className="auth-page__brand">
                    <Shield size={22} strokeWidth={1.5} />
                    <div>
                        <div className="auth-page__brand-title">Realms & Beyond</div>
                        <div className="auth-page__brand-sub">Identity & Access</div>
                    </div>
                </div>

                <h1 className="auth-page__heading">Create Account</h1>
                <p className="auth-page__sub">
                    {isOAuthFlow
                        ? `Create a Realms & Beyond account to access ${app_name}.`
                        : 'One account. Every Realms & Beyond experience.'}
                </p>

                {errorMessage && (
                    <div className="auth-error">
                        <AlertCircle size={14} strokeWidth={2} />
                        {errorMessage}
                    </div>
                )}

                <RegisterForm
                    authServerUrl={authServerUrl}
                    isOAuthFlow={isOAuthFlow}
                />

                <hr className="auth-page__divider" />

                <p className="auth-page__footer">
                    Already have an account?{' '}
                    <a href="/login">Sign in</a>
                </p>
            </div>
        </main>
    )
}
