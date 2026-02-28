'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { I_ContentObj } from '@rnb/types'
import { Button } from '@rnb/ui'

export const CategoryCard = ({
    item,
    key,
}: {
    item: I_ContentObj
    key: string
}) => {
    const pathname = usePathname()

    return (
        <li key={key} className="category-card-wrapper">
            <p>{item.contentName}</p>
            <Link
                className="card-link"
                href={`${pathname}/${item.contentId as string}`}
            >
                view
            </Link>
        </li>
    )
}
