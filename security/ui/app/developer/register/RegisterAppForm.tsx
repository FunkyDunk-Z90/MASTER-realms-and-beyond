'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Trash2 } from 'lucide-react'

interface FieldErrors {
    name?: string
    redirectUris?: string
    ownerName?: string
    ownerEmail?: string
    general?: string
}

export default function RegisterAppForm() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [redirectUris, setRedirectUris] = useState<string[]>([''])
    const [thirdParty, setThirdParty] = useState(false)
    const [ownerName, setOwnerName] = useState('')
    const [ownerEmail, setOwnerEmail] = useState('')
    const [scopes, setScopes] = useState<string[]>(['profile', 'email'])
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addUri = () => setRedirectUris((uris) => [...uris, ''])
    const removeUri = (idx: number) => setRedirectUris((uris) => uris.filter((_, i) => i !== idx))
    const updateUri = (idx: number, val: string) =>
        setRedirectUris((uris) => uris.map((u, i) => (i === idx ? val : u)))

    const toggleScope = (scope: string) =>
        setScopes((prev) =>
            prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
        )

    const validate = (): boolean => {
        const errors: FieldErrors = {}
        if (!name.trim()) errors.name = 'App name is required.'
        const filledUris = redirectUris.filter((u) => u.trim())
        if (filledUris.length === 0) errors.redirectUris = 'At least one redirect URI is required.'
        else {
            for (const uri of filledUris) {
                try { new URL(uri) } catch { errors.redirectUris = `Invalid URL: ${uri}`; break }
            }
        }
        if (thirdParty) {
            if (!ownerName.trim()) errors.ownerName = 'Contact name is required for third-party apps.'
            if (!ownerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
                errors.ownerEmail = 'A valid contact email is required for third-party apps.'
            }
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        setFieldErrors({})

        try {
            const res = await fetch('/api/developer/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    redirectUris: redirectUris.filter((u) => u.trim()),
                    thirdParty,
                    ownerName: ownerName.trim() || undefined,
                    ownerEmail: ownerEmail.trim() || undefined,
                    scopes,
                }),
            })

            const data = await res.json() as { clientId?: string; clientSecret?: string; message?: string }

            if (!res.ok) {
                setFieldErrors({ general: data.message ?? 'Registration failed.' })
                return
            }

            // Redirect to the app detail page, passing the clientSecret as a query param
            // (it's only shown once, here, right after creation)
            const params = new URLSearchParams()
            if (data.clientSecret) params.set('secret', data.clientSecret)
            router.push(`/developer/app/${data.clientId}?${params.toString()}`)
        } catch {
            setFieldErrors({ general: 'Network error. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="form-wrapper" onSubmit={handleSubmit} noValidate>
            <div className="form-contents">
                {fieldErrors.general && (
                    <div className="auth-error">{fieldErrors.general}</div>
                )}

                {/* App name */}
                <div className="field">
                    <label className="field-label" htmlFor="app-name">App Name *</label>
                    <input
                        id="app-name"
                        className={`input${fieldErrors.name ? ' input--error' : ''}`}
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined })) }}
                        placeholder="My Awesome App"
                        maxLength={100}
                    />
                    {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
                </div>

                {/* Description */}
                <div className="field">
                    <label className="field-label" htmlFor="app-desc">Description</label>
                    <textarea
                        id="app-desc"
                        className="input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What does your app do?"
                        maxLength={500}
                        rows={3}
                    />
                </div>

                {/* Redirect URIs */}
                <div className="field">
                    <label className="field-label">Redirect URIs *</label>
                    {redirectUris.map((uri, idx) => (
                        <div key={idx} className="input-wrapper" style={{ marginBottom: '0.4rem' }}>
                            <input
                                className={`input${fieldErrors.redirectUris ? ' input--error' : ''}`}
                                type="url"
                                value={uri}
                                onChange={(e) => { updateUri(idx, e.target.value); if (fieldErrors.redirectUris) setFieldErrors((p) => ({ ...p, redirectUris: undefined })) }}
                                placeholder="https://yourapp.com/callback"
                            />
                            {redirectUris.length > 1 && (
                                <button type="button" className="input-visibility-toggle" onClick={() => removeUri(idx)} aria-label="Remove URI">
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {fieldErrors.redirectUris && <p className="field-error">{fieldErrors.redirectUris}</p>}
                    <button type="button" className="btn btn--ghost btn--sm" onClick={addUri} style={{ marginTop: '0.4rem' }}>
                        <PlusCircle size={12} strokeWidth={2} />
                        Add URI
                    </button>
                </div>

                {/* App type */}
                <div className="field">
                    <label className="field-label">App Type *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="radio" name="appType" checked={!thirdParty} onChange={() => setThirdParty(false)} />
                            First-party / R&amp;B Venture
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="radio" name="appType" checked={thirdParty} onChange={() => setThirdParty(true)} />
                            Third-party / External
                        </label>
                    </div>
                </div>

                {/* Third-party contact fields */}
                {thirdParty && (
                    <>
                        <div className="field">
                            <label className="field-label" htmlFor="owner-name">Contact Name *</label>
                            <input
                                id="owner-name"
                                className={`input${fieldErrors.ownerName ? ' input--error' : ''}`}
                                type="text"
                                value={ownerName}
                                onChange={(e) => { setOwnerName(e.target.value); if (fieldErrors.ownerName) setFieldErrors((p) => ({ ...p, ownerName: undefined })) }}
                                placeholder="Jane Smith"
                            />
                            {fieldErrors.ownerName && <p className="field-error">{fieldErrors.ownerName}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label" htmlFor="owner-email">Contact Email *</label>
                            <input
                                id="owner-email"
                                className={`input${fieldErrors.ownerEmail ? ' input--error' : ''}`}
                                type="email"
                                value={ownerEmail}
                                onChange={(e) => { setOwnerEmail(e.target.value); if (fieldErrors.ownerEmail) setFieldErrors((p) => ({ ...p, ownerEmail: undefined })) }}
                                placeholder="dev@partner.com"
                            />
                            {fieldErrors.ownerEmail && <p className="field-error">{fieldErrors.ownerEmail}</p>}
                        </div>
                    </>
                )}

                {/* Scopes */}
                <div className="field">
                    <label className="field-label">Requested Scopes</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {(['profile', 'email'] as const).map((scope) => (
                            <label key={scope} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <input
                                    type="checkbox"
                                    checked={scopes.includes(scope)}
                                    onChange={() => toggleScope(scope)}
                                />
                                {scope}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn btn--primary btn--lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register App'}
                </button>
            </div>
        </form>
    )
}
