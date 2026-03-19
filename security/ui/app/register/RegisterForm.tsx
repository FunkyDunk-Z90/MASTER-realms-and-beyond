'use client'

import { useState } from 'react'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

interface RegisterFormProps {
    authServerUrl: string
    isOAuthFlow: boolean
}

interface FieldErrors {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    passwordConfirm?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterForm({ authServerUrl, isOAuthFlow }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [password, setPassword] = useState('')

    const validate = (data: {
        firstName: string
        lastName: string
        email: string
        password: string
        passwordConfirm: string
    }): boolean => {
        const errors: FieldErrors = {}
        if (!data.firstName.trim()) errors.firstName = 'First name is required.'
        if (!data.lastName.trim()) errors.lastName = 'Last name is required.'
        if (!data.email.trim() || !EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address.'
        if (!data.password) errors.password = 'Password is required.'
        else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters.'
        else if (!/[A-Z]/.test(data.password)) errors.password = 'Must contain an uppercase letter.'
        else if (!/[0-9]/.test(data.password)) errors.password = 'Must contain a number.'
        else if (!/[^A-Za-z0-9]/.test(data.password)) errors.password = 'Must contain a special character.'
        if (data.password !== data.passwordConfirm) errors.passwordConfirm = 'Passwords do not match.'
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        const get = (name: string) =>
            (form.elements.namedItem(name) as HTMLInputElement)?.value ?? ''

        const ok = validate({
            firstName: get('firstName'),
            lastName: get('lastName'),
            email: get('email'),
            password: get('password'),
            passwordConfirm: get('passwordConfirm'),
        })

        if (!ok) e.preventDefault()
    }

    // OAuth flow: POST directly to the auth server's /register endpoint.
    // The auth server reads the OAuth intent (client_id, redirect_uri, PKCE params)
    // from its session — no need to pass them through the form.
    const formAction = isOAuthFlow ? `${authServerUrl}/register` : '/api/auth/register'

    return (
        <form
            action={formAction}
            method="POST"
            className="form-wrapper"
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="form-contents">
                {/* Name row */}
                <div className="auth-form__row">
                    <div className="field">
                        <label className="field-label" htmlFor="reg-firstName">First Name</label>
                        <input
                            id="reg-firstName"
                            className={`input${fieldErrors.firstName ? ' input--error' : ''}`}
                            type="text"
                            name="firstName"
                            placeholder="Kolgart"
                            autoComplete="given-name"
                            onChange={() => {
                                if (fieldErrors.firstName) setFieldErrors((p) => ({ ...p, firstName: undefined }))
                            }}
                        />
                        {fieldErrors.firstName && <p className="field-error">{fieldErrors.firstName}</p>}
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="reg-lastName">Last Name</label>
                        <input
                            id="reg-lastName"
                            className={`input${fieldErrors.lastName ? ' input--error' : ''}`}
                            type="text"
                            name="lastName"
                            placeholder="Valenthi"
                            autoComplete="family-name"
                            onChange={() => {
                                if (fieldErrors.lastName) setFieldErrors((p) => ({ ...p, lastName: undefined }))
                            }}
                        />
                        {fieldErrors.lastName && <p className="field-error">{fieldErrors.lastName}</p>}
                    </div>
                </div>

                {/* Email */}
                <div className="field">
                    <label className="field-label" htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
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
                    <label className="field-label" htmlFor="reg-password">Password</label>
                    <div className="input-wrapper">
                        <input
                            id="reg-password"
                            className={`input${fieldErrors.password ? ' input--error' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
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

                {/* Confirm password */}
                <div className="field">
                    <label className="field-label" htmlFor="reg-passwordConfirm">Confirm Password</label>
                    <div className="input-wrapper">
                        <input
                            id="reg-passwordConfirm"
                            className={`input${fieldErrors.passwordConfirm ? ' input--error' : ''}`}
                            type={showConfirm ? 'text' : 'password'}
                            name="passwordConfirm"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            onChange={() => {
                                if (fieldErrors.passwordConfirm) setFieldErrors((p) => ({ ...p, passwordConfirm: undefined }))
                            }}
                        />
                        <button
                            type="button"
                            className="input-visibility-toggle"
                            onClick={() => setShowConfirm((v) => !v)}
                            aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                            {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                    {fieldErrors.passwordConfirm && <p className="field-error">{fieldErrors.passwordConfirm}</p>}
                </div>

                <button type="submit" className="btn btn--primary btn--lg">
                    <UserPlus size={16} strokeWidth={2} />
                    Create Account
                </button>
            </div>
        </form>
    )
}
