'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Spinner, Card, CardHeader, CardBody, CardText, CardFooter } from '@rnb/ui'

// ─── Types ────────────────────────────────────────────────────────────────────

interface I_ContentItem {
    id: string
    name: string
    slug: string
    description?: string
    subCategory?: string
    tags?: string[]
    isPrivate?: boolean
    [key: string]: unknown
}

interface I_ContentListPageProps {
    codexId: string
    title: string
    apiFn: (params: {
        codexId: string
        subCategory?: string
        search?: string
        limit?: number
        offset?: number
    }) => Promise<{ items: any[]; pagination: any }>
    subCategories?: { value: string; label: string }[]
    newHref: string
    itemHref: (id: string, slug?: string) => string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContentListPage({
    codexId,
    title,
    apiFn,
    subCategories,
    newHref,
    itemHref,
}: I_ContentListPageProps) {
    const router = useRouter()
    const [items, setItems] = useState<I_ContentItem[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [subCategory, setSubCategory] = useState('')

    const fetchItems = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const { items: data, pagination } = await apiFn({
                codexId,
                subCategory: subCategory || undefined,
                search: search || undefined,
                limit: 50,
            })
            setItems(data)
            setTotal(pagination.total)
        } catch (err: any) {
            setError(err.message ?? 'Failed to load.')
        } finally {
            setLoading(false)
        }
    }, [codexId, apiFn, subCategory, search])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    return (
        <section className="content-page">
            <div className="content-page__header">
                <div className="content-page__title-row">
                    <h1>{title}</h1>
                    <span className="content-page__count">{total}</span>
                </div>

                <div className="content-page__controls">
                    <input
                        className="content-page__search"
                        type="search"
                        placeholder={`Search ${title.toLowerCase()}…`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {subCategories && subCategories.length > 0 && (
                        <select
                            className="content-page__filter"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                        >
                            <option value="">All types</option>
                            {subCategories.map((sc) => (
                                <option key={sc.value} value={sc.value}>
                                    {sc.label}
                                </option>
                            ))}
                        </select>
                    )}
                    <Button onClick={() => router.push(newHref)}>
                        + Add New
                    </Button>
                </div>
            </div>

            {loading && <Spinner size="lg" fullArea />}

            {!loading && error && (
                <p className="content-page__error">{error}</p>
            )}

            {!loading && !error && items.length === 0 && (
                <div className="content-page__empty">
                    <p>No {title.toLowerCase()} yet.</p>
                    <Button variant="outline" onClick={() => router.push(newHref)}>
                        Create your first one
                    </Button>
                </div>
            )}

            {!loading && items.length > 0 && (
                <div className="card-wrapper">
                    {items.map((item) => (
                        <Card
                            key={item.id}
                            variant="dark"
                            onClick={() => router.push(itemHref(item.id, item.slug))}
                        >
                            <CardHeader
                                title={item.name}
                                badge={item.subCategory?.replace(/_/g, ' ')}
                                eyebrow={item.isPrivate ? 'PRIVATE' : undefined}
                            />
                            {item.description && (
                                <CardBody>
                                    <CardText>{item.description}</CardText>
                                </CardBody>
                            )}
                            {item.tags && item.tags.length > 0 && (
                                <CardFooter>
                                    <ul className="content-card__tags">
                                        {item.tags.slice(0, 4).map((t) => (
                                            <li key={t} className="content-card__tag">{t}</li>
                                        ))}
                                    </ul>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </section>
    )
}
