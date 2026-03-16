'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCodex } from '@/src/context/CodexContext'
import { codexApi } from '@/src/api/aetherscribeApi'
import { Button, Spinner } from '@rnb/ui'

// ─── Manage Codex Page ────────────────────────────────────────────────────────
// Manages the codex identified by [codexId] in the URL.
// All operations (save, delete, set-default) act on that specific codex.

export default function ManageCodexPage({
    params,
}: {
    params: Promise<{ codexId: string }>
}) {
    const { codexId } = use(params)
    const { codices, setActiveCodex, deleteCodex, refreshCodex, isLoading } =
        useCodex()
    const router = useRouter()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [coverImageUrl, setCoverImageUrl] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    const codex = codices.find((c) => c.id === codexId) ?? null

    // Populate form when the target codex resolves
    useEffect(() => {
        if (codex) {
            setName(codex.name)
            setDescription(codex.description ?? '')
            setCoverImageUrl(codex.coverImageUrl ?? '')
        }
    }, [codex?.id])

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!codex || !name.trim()) return
        setSaving(true)
        setSaveError('')
        setSaveSuccess(false)
        try {
            await codexApi.update(codexId, {
                name: name.trim(),
                description: description.trim() || undefined,
                coverImageUrl: coverImageUrl.trim() || undefined,
            })
            await refreshCodex()
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (err: any) {
            setSaveError(err.message ?? 'Failed to save.')
        } finally {
            setSaving(false)
        }
    }

    async function handleSetDefault() {
        if (!codex || codex.isDefault) return
        try {
            await codexApi.setDefault(codexId)
            await refreshCodex()
        } catch (err: any) {
            setSaveError(err.message ?? 'Failed to set default.')
        }
    }

    async function handleDelete() {
        if (!codex) return
        setDeleting(true)
        setDeleteError('')
        try {
            await deleteCodex(codexId)
            // After deletion, go to the first remaining codex or hub
            const remaining = codices.filter((c) => c.id !== codexId)
            if (remaining.length > 0) {
                router.replace(`/hub/${remaining[0].id}/manage`)
            } else {
                router.replace('/hub')
            }
        } catch (err: any) {
            setDeleteError(err.message ?? 'Failed to delete codex.')
            setDeleting(false)
            setConfirmDelete(false)
        }
    }

    if (isLoading) return <Spinner size="lg" fullArea />

    if (!codex) return null

    return (
        <section className="manage-codex">
            <header className="manage-codex__header">
                <h1 className="manage-codex__title">Manage Codex</h1>
                <p className="manage-codex__subtitle">
                    Edit the details of this codex or switch to another.
                </p>
            </header>

            <div className="manage-codex__body">
                {/* ── Edit form ── */}
                <div className="manage-codex__card">
                    <h2 className="manage-codex__card-title">Codex Details</h2>

                    <form
                        className="manage-codex__form"
                        onSubmit={handleSave}
                        noValidate
                    >
                        <div className="field">
                            <label className="field-label" htmlFor="mc-name">
                                Name
                            </label>
                            <input
                                id="mc-name"
                                className="input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={80}
                                required
                            />
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="mc-desc">
                                Description{' '}
                                <span className="field-label--optional">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                id="mc-desc"
                                className="input"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="What is this codex about?"
                                maxLength={500}
                                rows={3}
                            />
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="mc-cover">
                                Cover Image URL{' '}
                                <span className="field-label--optional">
                                    (optional)
                                </span>
                            </label>
                            <input
                                id="mc-cover"
                                className="input"
                                type="url"
                                value={coverImageUrl}
                                onChange={(e) =>
                                    setCoverImageUrl(e.target.value)
                                }
                                placeholder="https://…"
                            />
                        </div>

                        {saveError && (
                            <p className="field-error">{saveError}</p>
                        )}
                        {saveSuccess && (
                            <p className="manage-codex__success">
                                The codex has been updated.
                            </p>
                        )}

                        <div className="manage-codex__form-actions">
                            <Button
                                btnType="submit"
                                isDisabled={saving}
                                isLoading={saving}
                            >
                                Save Changes
                            </Button>

                            {!codex.isDefault && (
                                <Button
                                    variant="outline"
                                    onClick={handleSetDefault}
                                >
                                    Set as Default
                                </Button>
                            )}
                            {codex.isDefault && (
                                <span className="manage-codex__default-tag">
                                    Default Codex
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* ── All codices ── */}
                <div className="manage-codex__card">
                    <h2 className="manage-codex__card-title">
                        Your Codices
                        <span className="manage-codex__count">
                            {codices.length}
                        </span>
                    </h2>

                    <ul className="manage-codex__list">
                        {codices.map((c) => (
                            <li
                                key={c.id}
                                className={`manage-codex__codex-item${c.id === codexId ? ' manage-codex__codex-item--active' : ''}`}
                            >
                                <div className="manage-codex__codex-meta">
                                    <span className="manage-codex__codex-name">
                                        {c.name}
                                    </span>
                                    {c.isDefault && (
                                        <span className="manage-codex__default-badge">
                                            default
                                        </span>
                                    )}
                                </div>
                                {c.id !== codexId && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setActiveCodex(c)
                                            router.push(`/hub/${c.id}/manage`)
                                        }}
                                    >
                                        Manage
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Danger zone ── */}
                <div className="manage-codex__card manage-codex__card--danger">
                    <h2 className="manage-codex__card-title manage-codex__card-title--danger">
                        Danger Zone
                    </h2>
                    <p className="manage-codex__danger-desc">
                        Deleting a codex is permanent. All worlds, characters,
                        lore, and other content within it will be lost to the
                        void. You must always keep at least one codex.
                    </p>

                    {deleteError && (
                        <p className="field-error">{deleteError}</p>
                    )}

                    {codices.length <= 1 && (
                        <p className="manage-codex__danger-blocked">
                            You cannot delete your only codex. Create another
                            one first.
                        </p>
                    )}

                    {codices.length > 1 && !confirmDelete && (
                        <Button
                            variant="danger"
                            onClick={() => setConfirmDelete(true)}
                        >
                            Delete This Codex
                        </Button>
                    )}

                    {confirmDelete && (
                        <div className="manage-codex__confirm">
                            <p className="manage-codex__confirm-text">
                                Are you certain? This cannot be undone.
                            </p>
                            <div className="manage-codex__confirm-actions">
                                <Button
                                    variant="danger"
                                    isDisabled={deleting}
                                    isLoading={deleting}
                                    onClick={handleDelete}
                                >
                                    Yes, destroy it
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmDelete(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
