import { I_AetherScribeContent } from '@rnb/validators'

// ─── Category metadata for display ────────────────────────────────────────────

export type T_ContentCategory = keyof I_AetherScribeContent

export interface I_CategoryMeta {
    label: string
    href: string
}

export const categoryMeta: Record<T_ContentCategory, I_CategoryMeta> = {
    playerCharacters: { label: 'Player Character', href: '/hub/player-characters' },
    npcs:            { label: 'NPC',               href: '/hub/npcs' },
    worlds:          { label: 'World',             href: '/hub/worlds' },
    campaigns:       { label: 'Campaign',          href: '/hub/campaigns' },
    bestiary:        { label: 'Creature',          href: '/hub/bestiary' },
    ancestries:      { label: 'Ancestry',          href: '/hub/ancestries' },
    lore:            { label: 'Lore',              href: '/hub/lore' },
    items:           { label: 'Item',              href: '/hub/items' },
    arcana:          { label: 'Arcana',            href: '/hub/arcana' },
    locations:       { label: 'Location',          href: '/hub/locations' },
    nations:         { label: 'Nation',            href: '/hub/nations' },
    factions:        { label: 'Faction',           href: '/hub/factions' },
}
