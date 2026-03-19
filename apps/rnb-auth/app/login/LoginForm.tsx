'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'

interface LoginFormProps {
    authServerUrl: string
    isOAuthFlow: boolean
}

export default function LoginForm({ authServerUrl, isOAuthFlow }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

    const validate = (email: string, password: string): boolean => {
        const errors: typeof fieldErrors = {}
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address.'
        }
        if (!password) {
            errors.password = 'Password is required.'
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        const email = (form.elements.namedItem('email') as HTMLInputElement)?.value ?? ''
        const password = (form.elements.namedItem('password') as HTMLInputElement)?.value ?? ''
        if (!validate(email, password)) e.preventDefault()
    }

    // OAuth flow: POST email+password directly to the auth server's /authorize endpoint.
    // The auth server reads the OAuth intent (client_id, redirect_uri, PKCE params)
    // from its session — no need to pass them through the form.
    //
    // Direct portal login: POST to a local Next.js API route.
    const formAction = isOAuthFlow ? `${authServerUrl}/authorize` : '/api/auth/login'

    return (
        <form
            action={formAction}
            method="POST"
            className="form-wrapper"
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="form-contents">
                {/* Email */}
                <div className="field">
                    <label className="field-label" htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        className={`input${fieldErrors.email ? ' input--error' : ''}`}
                        type="email"
                        name="email"
                        placeholder="explorer@realms.beyond"
                        autoComplete="email"
                        onChange={() => {
                            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
                        }}
                    />
                    {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
                </div>

                {/* Password */}
                <div className="field">
                    <label className="field-label" htmlFor="login-password">Password</label>
                    <div className="input-wrapper">
                        <input
                            id="login-password"
                            className={`input${fieldErrors.password ? ' input--error' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={() => {
                                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
                            }}
                        />
                        <button
                            type="button"
                            className="input-visibility-toggle"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                    {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
                </div>

                <button type="submit" className="btn btn--primary btn--lg">
                    <LogIn size={16} strokeWidth={2} />
                    Sign In
                </button>
            </div>
        </form>
    )
}
