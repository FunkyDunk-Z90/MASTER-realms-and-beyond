'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Button } from '@rnb/ui'
import { CATEGORY_REGISTRY } from '@/src/config/categoryRegistry'

export default function NewDocumentPage({
    params,
}: {
    params: Promise<{ codexId: string; category: string }>
}) {
    const { codexId, category } = use(params)
    const router = useRouter()

    const config = CATEGORY_REGISTRY[category]
    if (!config) notFound()

    const listHref = `/hub/${codexId}/${category}`
    const FormComponent = config.FormComponent

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
                    <h1>New {config.title.replace(/s$/, '')}</h1>
                </div>
            </div>

            <div className="content-page__form-panel">
                <FormComponent
                    codexId={codexId}
                    onSuccess={(item) =>
                        router.push(
                            `/hub/${codexId}/${category}/${item.slug ? `${item.slug}--${item.id}` : item.id}`
                        )
                    }
                    onCancel={() => router.push(listHref)}
                />
            </div>
        </section>
    )
}
