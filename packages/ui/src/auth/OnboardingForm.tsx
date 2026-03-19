'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { useAuth } from './AuthContext'
import { Button } from '../utils/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface I_OnboardingFormProps {
    /** Called after the account is successfully created. Use this to redirect. */
    onSuccess?: () => void
    /** Base URL for the aetherscribe API (defaults to localhost:2612). */
    aetherscribeApiUrl?: string
}

type T_Plan = 'free' | 'starter' | 'pro' | 'enterprise'
type T_UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

// ─── Plan definitions ─────────────────────────────────────────────────────────

interface I_PlanOption {
    plan: T_Plan
    label: string
    price: string
    features: string[]
    highlight?: boolean
}

const PLAN_OPTIONS: I_PlanOption[] = [
    {
        plan: 'free',
        label: 'Free',
        price: 'Free forever',
        features: [
            '1 World',
            '10 Characters',
            '1 GB Storage',
            'Community support',
        ],
    },
    {
        plan: 'starter',
        label: 'Starter',
        price: '$4.99 / mo',
        features: [
            '5 Worlds',
            '50 Characters',
            '5 GB Storage',
            '3 Collaborators',
        ],
    },
    {
        plan: 'pro',
        label: 'Pro',
        price: '$12.99 / mo',
        features: [
            'Unlimited Worlds',
            'Unlimited Characters',
            '20 GB Storage',
            '10 Collaborators',
            'Advanced Features',
            'API Access',
        ],
        highlight: true,
    },
    {
        plan: 'enterprise',
        label: 'Enterprise',
        price: '$29.99 / mo',
        features: [
            'Everything in Pro',
            'Unlimited Collaborators',
            '100 GB Storage',
            'Custom Domain',
            'Priority Support',
        ],
    },
]

// ─── OnboardingForm ───────────────────────────────────────────────────────────

export const OnboardingForm: React.FC<I_OnboardingFormProps> = ({
    onSuccess,
    aetherscribeApiUrl,
}) => {
    const { createAetherscribeAccount } = useAuth()

    const [username, setUsername] = useState('')
    const [selectedPlan, setSelectedPlan] = useState<T_Plan>('free')
    const [usernameStatus, setUsernameStatus] =
        useState<T_UsernameStatus>('idle')
    const [usernameMessage, setUsernameMessage] = useState<string | undefined>()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const apiBase = 'http://localhost:8811'
    // const apiBase =
    //     aetherscribeApiUrl ??
    //     (typeof process !== 'undefined' &&
    //     process.env?.NEXT_PUBLIC_AETHERSCRIBE_API_URL
    //         ? process.env.NEXT_PUBLIC_AETHERSCRIBE_API_URL
    //         : 'http://localhost:8811')

    // ── Username availability check (debounced) ──────────────────────────────

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (!username) {
            setUsernameStatus('idle')
            setUsernameMessage(undefined)
            return
        }

        setUsernameStatus('checking')

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${apiBase}/api/v1/account/check-username/${encodeURIComponent(username)}`
                )
                const data: { available: boolean; message?: string } =
                    await res.json()

                if (!data.available && data.message) {
                    setUsernameStatus('invalid')
                    setUsernameMessage(data.message)
                } else if (data.available) {
                    setUsernameStatus('available')
                    setUsernameMessage(undefined)
                } else {
                    setUsernameStatus('taken')
                    setUsernameMessage('This username is already taken.')
                }
            } catch {
                setUsernameStatus('idle')
            }
        }, 500)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [username, apiBase])

    // ── Submit ───────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError(null)

        if (!username.trim()) {
            setSubmitError('Please choose a username.')
            return
        }
        if (usernameStatus === 'checking') {
            setSubmitError('Please wait while we check your username.')
            return
        }
        if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
            setSubmitError(
                usernameMessage ?? 'Please choose a different username.'
            )
            return
        }

        setIsSubmitting(true)
        try {
            await createAetherscribeAccount(username.trim(), selectedPlan)
            onSuccess?.()
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : 'Something went wrong.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Username status icon ─────────────────────────────────────────────────

    const renderUsernameIcon = () => {
        if (usernameStatus === 'checking')
            return (
                <Loader size={14} className="username-status-icon spinning" />
            )
        if (usernameStatus === 'available')
            return (
                <CheckCircle
                    size={14}
                    className="username-status-icon username-status-icon--ok"
                />
            )
        if (usernameStatus === 'taken' || usernameStatus === 'invalid')
            return (
                <XCircle
                    size={14}
                    className="username-status-icon username-status-icon--error"
                />
            )
        return null
    }

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <form className="onboarding-form" onSubmit={handleSubmit} noValidate>
            {/* ── Username ── */}
            <section className="onboarding-form__section">
                <h3 className="onboarding-form__section-title">
                    Choose your username
                </h3>
                <p className="onboarding-form__section-desc">
                    This is your unique handle in Aetherscribe. You can change
                    it later.
                </p>
                <div className="field">
                    <label className="field-label" htmlFor="as-username">
                        Username
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="as-username"
                            className={`input${
                                usernameStatus === 'taken' ||
                                usernameStatus === 'invalid'
                                    ? ' input--error'
                                    : usernameStatus === 'available'
                                      ? ' input--success'
                                      : ''
                            }`}
                            type="text"
                            placeholder="chronicler"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            maxLength={20}
                        />
                        <span className="input-visibility-toggle">
                            {renderUsernameIcon()}
                        </span>
                    </div>
                    {(usernameStatus === 'taken' ||
                        usernameStatus === 'invalid') &&
                        usernameMessage && (
                            <p className="field-error">{usernameMessage}</p>
                        )}
                    {usernameStatus === 'available' && (
                        <p className="field-hint">Username is available!</p>
                    )}
                </div>
            </section>

            {/* ── Plan picker ── */}
            <section className="onboarding-form__section">
                <h3 className="onboarding-form__section-title">
                    Choose your plan
                </h3>
                <p className="onboarding-form__section-desc">
                    Start free and upgrade anytime.
                </p>
                <div className="plan-grid">
                    {PLAN_OPTIONS.map(
                        ({ plan, label, price, features, highlight }) => (
                            <button
                                key={plan}
                                type="button"
                                className={`plan-card${
                                    selectedPlan === plan
                                        ? ' plan-card--selected'
                                        : ''
                                }${highlight ? ' plan-card--highlight' : ''}`}
                                onClick={() => setSelectedPlan(plan)}
                            >
                                {highlight && (
                                    <span className="plan-card__badge">
                                        Most Popular
                                    </span>
                                )}
                                <span className="plan-card__name">{label}</span>
                                <span className="plan-card__price">
                                    {price}
                                </span>
                                <ul className="plan-card__features">
                                    {features.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </button>
                        )
                    )}
                </div>
            </section>

            {/* ── Error ── */}
            {submitError && (
                <p className="field-error onboarding-form__error">
                    {submitError}
                </p>
            )}

            {/* ── Submit ── */}
            <Button
                btnType="submit"
                size="lg"
                isLoading={isSubmitting}
                isDisabled={isSubmitting || usernameStatus === 'checking'}
            >
                Begin Your Legend
            </Button>
        </form>
    )
}
