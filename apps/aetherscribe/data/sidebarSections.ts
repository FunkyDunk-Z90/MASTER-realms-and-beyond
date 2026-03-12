import { I_SidebarSection } from '@rnb/ui'

import {
    svgHub,
    svgAncestries,
    svgBestiary,
    svgCampaigns,
    svgFeats,
    svgItems,
    svgNpcs,
    svgOrigins,
    svgPlayerCharacters,
    svgSpells,
    svgWorlds,
} from '@rnb/assets'

// Only lists routes that have an actual page.tsx in the aetherscribe app.
// Add entries here as new pages are created.
export const sidebarData: I_SidebarSection[] = [
    // ─── Hub ──────────────────────────────────────────────────────────────────
    {
        title: 'Hub',
        items: [
            {
                id: 'hub',
                label: 'Adventure Hub',
                href: '/hub',
                icon: svgHub,
            },
        ],
    },

    // ─── Characters ───────────────────────────────────────────────────────────
    {
        title: 'Characters',
        items: [
            {
                id: 'player-characters',
                label: 'Player Characters',
                href: '/hub/player-characters',
                icon: svgPlayerCharacters,
            },
            {
                id: 'npcs',
                label: 'NPCs',
                href: '/hub/npcs',
                icon: svgNpcs,
            },
        ],
    },

    // ─── Campaigns & Worlds ───────────────────────────────────────────────────
    {
        title: 'Campaigns & Worlds',
        items: [
            {
                id: 'campaigns',
                label: 'Campaigns',
                href: '/hub/campaigns',
                icon: svgCampaigns,
            },
            {
                id: 'worlds',
                label: 'Worlds',
                href: '/hub/worlds',
                icon: svgWorlds,
            },
            {
                id: 'bestiary',
                label: 'Bestiary',
                href: '/hub/bestiary',
                icon: svgBestiary,
            },
        ],
    },

    // ─── Rules & Lore ─────────────────────────────────────────────────────────
    {
        title: 'Rules & Lore',
        items: [
            {
                id: 'ancestries',
                label: 'Ancestries',
                href: '/hub/ancestries',
                icon: svgAncestries,
            },
            {
                id: 'backgrounds',
                label: 'Backgrounds',
                href: '/hub/backgrounds',
                icon: svgOrigins,
            },
            {
                id: 'feats',
                label: 'Feats',
                href: '/hub/feats',
                icon: svgFeats,
            },
        ],
    },

    // ─── Magic & Items ────────────────────────────────────────────────────────
    {
        title: 'Magic & Items',
        items: [
            {
                id: 'spells',
                label: 'Spells',
                href: '/hub/spells',
                icon: svgSpells,
            },
            {
                id: 'items',
                label: 'Items',
                href: '/hub/items',
                icon: svgItems,
            },
        ],
    },
]
