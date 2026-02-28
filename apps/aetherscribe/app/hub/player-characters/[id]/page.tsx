import { testAccountContent } from '@/data/aetherscribeData'

export default async function PlayerCharacterDetails({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const character = testAccountContent.playerCharacters.find(
        (pc) => pc.contentId === id
    )

    if (!character) return <div>Character not found</div>

    return (
        <div>
            <h1>{character.contentName}</h1>
            <p>ID: {character.contentId as string}</p>
        </div>
    )
}
