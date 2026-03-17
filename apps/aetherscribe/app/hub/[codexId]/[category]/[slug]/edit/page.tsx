'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Button, Spinner } from '@rnb/ui'
import { CATEGORY_REGISTRY } from '@/src/config/categoryRegistry'

export default function EditDocumentPage({
    params,
}: {
    params: Promise<{ codexId: string; category: string; slug: string }>
}) {
    const { codexId, category, slug } = use(params)
    const router = useRouter()
    const [item, setItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const config = CATEGORY_REGISTRY[category]
    const docId = slug.includes('--') ? slug.split('--').at(-1)! : slug

    const viewHref = `/hub/${codexId}/${category}/${slug}`
    const listHref = `/hub/${codexId}/${category}`

    useEffect(() => {
        if (!config) return
        async function load() {
            setLoading(true)
            try {
                const data = await config.api.get(docId)
                setItem(data.item ?? data)
            } catch (err: any) {
                setError(err.message ?? 'Failed to load.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [docId, config])

    const handleDelete = async () => {
        if (deleteConfirmText !== item.name) return
        setIsDeleting(true)
        setDeleteError(null)
        try {
            await config.api.delete(docId)
            router.replace(listHref)
        } catch (err: any) {
            setDeleteError(err.message ?? 'Failed to delete.')
            setIsDeleting(false)
        }
    }

    const openDeleteModal = () => {
        setDeleteConfirmText('')
        setDeleteError(null)
        setShowDeleteModal(true)
    }

    if (!config) notFound()

    if (loading) return <Spinner size="lg" fullArea />

    if (error || !item) {
        return (
            <section className="content-page">
                <p className="content-page__error">{error ?? 'Not found.'}</p>
                <Button variant="ghost" onClick={() => router.push(listHref)}>
                    ← Back to {config.title}
                </Button>
            </section>
        )
    }

    const FormComponent = config.FormComponent
    const singularTitle = config.title.replace(/s$/, '')

    return (
        <section className="content-page">
            <div className="content-page__header">
                <div className="content-page__title-row">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(viewHref)}
                    >
                        ← {item.name}
                    </Button>
                    <h1>Edit {singularTitle}</h1>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={openDeleteModal}
                        style={{ marginLeft: 'auto' }}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="content-page__form-panel">
                <FormComponent
                    key={docId}
                    codexId={codexId}
                    docId={docId}
                    initialValues={item}
                    onSuccess={(updated) => {
                        const newSlug = updated.slug
                            ? `${updated.slug}--${updated.id}`
                            : docId
                        router.replace(`/hub/${codexId}/${category}/${newSlug}`)
                    }}
                    onCancel={() => router.push(viewHref)}
                />
            </div>

            {showDeleteModal && (
                <div
                    className="delete-modal__overlay"
                    onClick={() => !isDeleting && setShowDeleteModal(false)}
                >
                    <div
                        className="delete-modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                    >
                        <h2 id="delete-modal-title" className="delete-modal__title">
                            Delete {singularTitle}
                        </h2>
                        <p className="delete-modal__warning">
                            This action is permanent and cannot be undone. The{' '}
                            <strong>{singularTitle.toLowerCase()}</strong> will be
                            removed from this codex entirely.
                        </p>

                        <div className="delete-modal__field">
                            <label
                                className="delete-modal__label"
                                htmlFor="delete-confirm"
                            >
                                Type <strong>{item.name}</strong> to confirm
                            </label>
                            <input
                                id="delete-confirm"
                                className="delete-modal__input"
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) =>
                                    setDeleteConfirmText(e.target.value)
                                }
                                placeholder={item.name}
                                autoComplete="off"
                                autoFocus
                            />
                        </div>

                        {deleteError && (
                            <p className="delete-modal__error">{deleteError}</p>
                        )}

                        <div className="delete-modal__actions">
                            <Button
                                variant="ghost"
                                onClick={() => setShowDeleteModal(false)}
                                isDisabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                isLoading={isDeleting}
                                isDisabled={
                                    isDeleting ||
                                    deleteConfirmText !== item.name
                                }
                            >
                                Delete permanently
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
