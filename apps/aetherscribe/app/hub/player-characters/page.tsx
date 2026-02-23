import { CategoryCard } from '@/components/CategoryCard'
import { testAccountContent } from '@/data/aetherscribeData'

export default function PlayerCharacters() {
    const { playerCharacters } = testAccountContent

    return (
        <>
            <h1>Player Characters</h1>
            <ul className="card-wrapper">
                {playerCharacters.map((item) => (
                    <CategoryCard item={item} key={item.contentId as string} />
                ))}
            </ul>
        </>
    )
}
