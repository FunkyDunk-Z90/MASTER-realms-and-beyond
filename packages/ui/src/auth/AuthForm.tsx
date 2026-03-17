'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from './AuthContext'
import { Button } from '../utils/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

type T_Mode = 'login' | 'signup'

export interface I_AuthFormProps {
    /** Called after a successful login or signup. Use this to redirect. */
    onSuccess?: () => void
}

interface I_FieldErrors {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    passwordConfirm?: string
}

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(value: string): string | undefined {
    if (!value.trim()) return 'Email is required.'
    if (!EMAIL_RE.test(value)) return 'Enter a valid email address.'
}

function validatePassword(value: string): string | undefined {
    if (!value) return 'Password is required.'
    if (value.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(value))
        return 'Password must contain an uppercase letter.'
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter.'
    if (!/[0-9]/.test(value)) return 'Password must contain a number.'
    if (!/[^A-Za-z0-9]/.test(value))
        return 'Password must contain a special character.'
}

function validateConfirm(value: string, password: string): string | undefined {
    if (!value) return 'Please confirm your password.'
    if (value !== password) return 'Passwords do not match.'
}

function validateRequired(value: string, label: string): string | undefined {
    if (!value.trim()) return `${label} is required.`
}

// ─── AuthForm ─────────────────────────────────────────────────────────────────

export const AuthForm: React.FC<I_AuthFormProps> = ({ onSuccess }) => {
    const { login, signup } = useAuth()

    const [mode, setMode] = useState<T_Mode>('login')
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<I_FieldErrors>({})

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const switchMode = (next: T_Mode) => {
        setMode(next)
        setSubmitError(null)
        setFieldErrors({})
    }

    const setFieldError = (field: keyof I_FieldErrors, msg?: string) =>
        setFieldErrors((prev) => ({ ...prev, [field]: msg }))

    // ── Per-field blur validation ────────────────────────────────────────────

    const onBlurFirstName = () =>
        setFieldError('firstName', validateRequired(firstName, 'First name'))

    const onBlurLastName = () =>
        setFieldError('lastName', validateRequired(lastName, 'Last name'))

    const onBlurEmail = () => setFieldError('email', validateEmail(email))

    const onBlurPassword = () => {
        setFieldError('password', validatePassword(password))
        // Re-validate confirm if already touched
        if (passwordConfirm)
            setFieldError(
                'passwordConfirm',
                validateConfirm(passwordConfirm, password)
            )
    }

    const onBlurConfirm = () =>
        setFieldError(
            'passwordConfirm',
            validateConfirm(passwordConfirm, password)
        )

    // ── Full form validation before submit ───────────────────────────────────

    const validateAll = (): boolean => {
        const errs: I_FieldErrors = {}

        if (mode === 'signup') {
            errs.firstName = validateRequired(firstName, 'First name')
            errs.lastName = validateRequired(lastName, 'Last name')
        }

        errs.email = validateEmail(email)
        errs.password = validatePassword(password)

        if (mode === 'signup') {
            errs.passwordConfirm = validateConfirm(passwordConfirm, password)
        }

        // Strip undefined keys
        const cleaned = Object.fromEntries(
            Object.entries(errs).filter(([, v]) => v !== undefined)
        ) as I_FieldErrors

        setFieldErrors(cleaned)
        return Object.keys(cleaned).length === 0
    }

    // ── Submit ───────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError(null)

        if (!validateAll()) return

        setIsSubmitting(true)
        try {
            if (mode === 'login') {
                await login(email, password)
            } else {
                await signup({
                    firstName,
                    lastName,
                    email,
                    password,
                    passwordConfirm,
                })
            }
            onSuccess?.()
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : 'Something went wrong.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <form
            className="form-wrapper auth-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="form-contents">
                <div>
                    <h2 className="form-title">
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </h2>
                    {mode === 'login' ? (
                        <p className="landing-subtitle">
                            with your Realms & Beyond account
                        </p>
                    ) : (
                        <p className="landing-subtitle">with Realms & Beyond</p>
                    )}
                </div>

                {/* ── Name fields (signup only) ── */}
                {mode === 'signup' && (
                    <div className="auth-form__row">
                        <div className="field">
                            <label
                                className="field-label"
                                htmlFor="auth-firstName"
                            >
                                First Name
                            </label>
                            <input
                                id="auth-firstName"
                                className={`input${fieldErrors.firstName ? ' input--error' : ''}`}
                                type="text"
                                placeholder="Kolgart"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                    if (fieldErrors.firstName)
                                        setFieldError('firstName', undefined)
                                }}
                                onBlur={onBlurFirstName}
                                autoComplete="given-name"
                            />
                            {fieldErrors.firstName && (
                                <p className="field-error">
                                    {fieldErrors.firstName}
                                </p>
                            )}
                        </div>

                        <div className="field">
                            <label
                                className="field-label"
                                htmlFor="auth-lastName"
                            >
                                Last Name
                            </label>
                            <input
                                id="auth-lastName"
                                className={`input${fieldErrors.lastName ? ' input--error' : ''}`}
                                type="text"
                                placeholder="Broadmaster Valenthi"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                    if (fieldErrors.lastName)
                                        setFieldError('lastName', undefined)
                                }}
                                onBlur={onBlurLastName}
                                autoComplete="family-name"
                            />
                            {fieldErrors.lastName && (
                                <p className="field-error">
                                    {fieldErrors.lastName}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Email ── */}
                <div className="field">
                    <label className="field-label" htmlFor="auth-email">
                        Email
                    </label>
                    <input
                        id="auth-email"
                        className={`input${fieldErrors.email ? ' input--error' : ''}`}
                        type="email"
                        placeholder="explorer@realms.beyond"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            if (fieldErrors.email)
                                setFieldError('email', undefined)
                        }}
                        onBlur={onBlurEmail}
                        autoComplete="email"
                    />
                    {fieldErrors.email && (
                        <p className="field-error">{fieldErrors.email}</p>
                    )}
                </div>

                {/* ── Password ── */}
                <div className="field">
                    <label className="field-label" htmlFor="auth-password">
                        Password
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="auth-password"
                            className={`input${fieldErrors.password ? ' input--error' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (fieldErrors.password)
                                    setFieldError('password', undefined)
                            }}
                            onBlur={onBlurPassword}
                            autoComplete={
                                mode === 'login'
                                    ? 'current-password'
                                    : 'new-password'
                            }
                        />
                        <button
                            type="button"
                            className="input-visibility-toggle"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                        >
                            {showPassword ? (
                                <Eye size={16} />
                            ) : (
                                <EyeOff size={16} />
                            )}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <p className="field-error">{fieldErrors.password}</p>
                    )}
                </div>

                {/* ── Confirm password (signup only) ── */}
                {mode === 'signup' && (
                    <div className="field">
                        <label
                            className="field-label"
                            htmlFor="auth-passwordConfirm"
                        >
                            Confirm Password
                        </label>
                        <div className="input-wrapper">
                            <input
                                id="auth-passwordConfirm"
                                className={`input${fieldErrors.passwordConfirm ? ' input--error' : ''}`}
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={passwordConfirm}
                                onChange={(e) => {
                                    setPasswordConfirm(e.target.value)
                                    if (fieldErrors.passwordConfirm)
                                        setFieldError(
                                            'passwordConfirm',
                                            undefined
                                        )
                                }}
                                onBlur={onBlurConfirm}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="input-visibility-toggle"
                                onClick={() => setShowConfirm((v) => !v)}
                                aria-label={
                                    showConfirm
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showConfirm ? (
                                    <Eye size={16} />
                                ) : (
                                    <EyeOff size={16} />
                                )}
                            </button>
                        </div>
                        {fieldErrors.passwordConfirm && (
                            <p className="field-error">
                                {fieldErrors.passwordConfirm}
                            </p>
                        )}
                    </div>
                )}

                {/* ── Submit error ── */}
                {submitError && (
                    <p className="field-error auth-form__error">
                        {submitError}
                    </p>
                )}

                {/* ── Submit ── */}
                <Button
                    btnType="submit"
                    // variant="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                >
                    {mode === 'login' ? 'Log In' : 'Create Account'}
                </Button>

                {/* ── Mode switch ── */}
                <div className="form-link-wrapper">
                    <p>
                        {mode === 'login'
                            ? "Don't have an account?"
                            : 'Already have an account?'}
                    </p>
                    <button
                        type="button"
                        className="form-link"
                        onClick={() =>
                            switchMode(mode === 'login' ? 'signup' : 'login')
                        }
                    >
                        {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </form>
    )
}
