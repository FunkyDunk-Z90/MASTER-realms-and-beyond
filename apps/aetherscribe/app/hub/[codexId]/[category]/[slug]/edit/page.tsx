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
                    <h1>Edit {config.title.replace(/s$/, '')}</h1>
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
        </section>
    )
}
