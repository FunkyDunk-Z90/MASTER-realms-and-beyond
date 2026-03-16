'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCodex } from '@/src/context/CodexContext'
import { Button, Spinner } from '@rnb/ui'

// ─── Setup Codex Page ─────────────────────────────────────────────────────────
// Shown when the authenticated user has no codex.
// After creation they are redirected to /hub.

export default function SetupCodexPage() {
    const { createCodex, codices, isLoading } = useCodex()
    const router = useRouter()
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // If user already has a codex (navigated here directly), send them to hub
    useEffect(() => {
        if (!isLoading && codices.length > 0) {
            router.replace('/hub')
        }
    }, [isLoading, codices.length, router])

    if (isLoading) {
        return <Spinner size="lg" fullArea />
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) {
            setError('Please give your codex a name.')
            return
        }
        setSubmitting(true)
        setError('')
        try {
            await createCodex(name.trim(), desc.trim() || undefined)
            router.replace('/hub')
        } catch (err: any) {
            setError(err.message ?? 'Failed to create codex.')
            setSubmitting(false)
        }
    }

    return (
        <section className="setup-codex">
            <div className="setup-codex__card">
                <header className="setup-codex__header">
                    <h1 className="setup-codex__title">
                        Create Your First Codex
                    </h1>
                    <p className="setup-codex__subtitle">
                        A Codex is your worldbuilding workspace — a container
                        for all your worlds, characters, lore, and more. You can
                        create additional codices at any time.
                    </p>
                </header>

                <form
                    className="setup-codex__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="field">
                        <label className="field-label" htmlFor="codex-name">
                            Codex Name
                        </label>
                        <input
                            id="codex-name"
                            className="input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. The Shattered Realm, Age of Iron"
                            maxLength={80}
                            autoFocus
                            spellCheck="false"
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="codex-desc">
                            Description{' '}
                            <span className="field-label--optional">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            id="codex-desc"
                            className="input input--textarea"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="What world or campaign does this codex cover?"
                            maxLength={500}
                            rows={3}
                        />
                    </div>

                    {error && <p className="field-error">{error}</p>}

                    <Button
                        btnType="submit"
                        size="lg"
                        isDisabled={submitting}
                        isLoading={submitting}
                    >
                        Create Codex
                    </Button>
                </form>
            </div>
        </section>
    )
}
