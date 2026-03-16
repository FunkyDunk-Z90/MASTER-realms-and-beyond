'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Button, Spinner } from '@rnb/ui'
import { CATEGORY_REGISTRY } from '@/src/config/categoryRegistry'

export default function DocumentPage({
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
    }, [slug, config])

    if (!config) notFound()

    const listHref = `/hub/${codexId}/${category}`

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

    return (
        <section className="content-page">
            <div className="content-page__header">
                <div className="content-page__title-row">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(listHref)}
                    >
                        ← {config.title}
                    </Button>
                    <h1>{item.name}</h1>
                    {item.subCategory && (
                        <span className="content-card__badge">
                            {item.subCategory.replace(/_/g, ' ')}
                        </span>
                    )}
                </div>
            </div>

            {item.description && (
                <p className="content-card__desc">{item.description}</p>
            )}

            {item.tags && item.tags.length > 0 && (
                <ul className="content-card__tags">
                    {item.tags.map((t: string) => (
                        <li key={t} className="content-card__tag">{t}</li>
                    ))}
                </ul>
            )}

            <div className="content-page__controls" style={{ marginTop: 'var(--large)' }}>
                <Button
                    variant="outline"
                    onClick={() =>
                        router.push(`/hub/${codexId}/${category}/${slug}/edit`)
                    }
                >
                    Edit
                </Button>
            </div>
        </section>
    )
}
