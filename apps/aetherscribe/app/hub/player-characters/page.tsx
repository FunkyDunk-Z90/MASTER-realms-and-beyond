'use client'

import { usePathname } from 'next/navigation'
import { EntityCard } from '@rnb/ui'
import { testAccountContent } from '@/data/aetherscribeData'

export default function PlayerCharacters() {
    const { playerCharacters } = testAccountContent
    const pathname = usePathname()

    return (
        <>
            <h1>Player Characters</h1>
            <ul className="card-wrapper">
                {playerCharacters.map((item) => (
                    <EntityCard
                        key={item.contentId as string}
                        name={item.contentName}
                        href={`${pathname}/${item.contentId as string}`}
                    />
                ))}
            </ul>
        </>
    )
}
