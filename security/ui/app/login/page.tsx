import type { Metadata } from 'next'
import { AlertCircle, Shield } from 'lucide-react'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
    title: 'Sign In — Realms & Beyond',
}

// Error messages mapped from the error query param returned by the auth server.
const ERROR_MESSAGES: Record<string, string> = {
    invalid_credentials: 'Incorrect email or password.',
    session_expired: 'Your session expired. Please try again.',
}

interface PageProps {
    searchParams: Promise<{
        app_name?: string   // name of the app requesting access (display only)
        client_id?: string  // requesting client (passed for UX context)
        error?: string
    }>
}

export default async function LoginPage({ searchParams }: PageProps) {
    const params = await searchParams
    const { app_name, error } = params

    // OAuth flow when the auth server redirected here via GET /authorize
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

                <h1 className="auth-page__heading">Sign In</h1>
                <p className="auth-page__sub">
                    {isOAuthFlow
                        ? `Sign in to access ${app_name}.`
                        : 'Sign in to manage your account.'}
                </p>

                {/* Error banner */}
                {errorMessage && (
                    <div className="auth-error">
                        <AlertCircle size={14} strokeWidth={2} />
                        {errorMessage}
                    </div>
                )}

                <LoginForm
                    authServerUrl={authServerUrl}
                    isOAuthFlow={isOAuthFlow}
                />

                <hr className="auth-page__divider" />

                <p className="auth-page__footer">
                    No account?{' '}
                    {/* In OAuth flow: /register on rnb-auth — auth server session
                        already has the intent set by GET /authorize */}
                    <a href="/register">Create one</a>
                </p>
            </div>
        </main>
    )
}
