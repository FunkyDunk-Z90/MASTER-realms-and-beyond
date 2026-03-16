'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import ContentListPage from '@/src/components/ContentListPage'
import { CATEGORY_REGISTRY } from '@/src/config/categoryRegistry'

export default function CategoryPage({
    params,
}: {
    params: Promise<{ codexId: string; category: string }>
}) {
    const { codexId, category } = use(params)
    const config = CATEGORY_REGISTRY[category]

    if (!config) notFound()

    return (
        <ContentListPage
            codexId={codexId}
            title={config.title}
            apiFn={config.api.list}
            subCategories={config.subCategories}
            newHref={`/hub/${codexId}/${category}/new`}
            itemHref={(id, slug) =>
                `/hub/${codexId}/${category}/${slug ? `${slug}--${id}` : id}`
            }
        />
    )
}
