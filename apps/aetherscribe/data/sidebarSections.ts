import { I_SidebarSection } from '@rnb/ui'

import {
    svgHub,
    svgAncestries,
    svgBestiary,
    svgCampaigns,
    svgItems,
    svgLocations,
    svgNpcs,
    svgPlayerCharacters,
    svgSpells,
    svgWorlds,
} from '@rnb/assets'

// ─── getSidebarSections ───────────────────────────────────────────────────────
// Returns sidebar nav with links scoped to the active codex.
// When codexId is empty (loading / no codex) links fall back to '#' so
// the sidebar renders without broken hrefs — CodexGuard handles navigation.

export function getSidebarSections(codexId: string): I_SidebarSection[] {
    const base = codexId ? `/hub/${codexId}` : '#'

    return [
        // ─── Hub ──────────────────────────────────────────────────────────────
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

        // ─── Characters ───────────────────────────────────────────────────────
        {
            title: 'Characters',
            items: [
                {
                    id: 'player-characters',
                    label: 'Player Characters',
                    href: `${base}/player-characters`,
                    icon: svgPlayerCharacters,
                },
                {
                    id: 'npcs',
                    label: 'NPCs',
                    href: `${base}/npcs`,
                    icon: svgNpcs,
                },
            ],
        },

        // ─── Campaigns & Worlds ───────────────────────────────────────────────
        {
            title: 'Campaigns & Worlds',
            items: [
                {
                    id: 'campaigns',
                    label: 'Campaigns',
                    href: `${base}/campaigns`,
                    icon: svgCampaigns,
                },
                {
                    id: 'worlds',
                    label: 'Worlds',
                    href: `${base}/worlds`,
                    icon: svgWorlds,
                },
                {
                    id: 'bestiary',
                    label: 'Bestiary',
                    href: `${base}/bestiary`,
                    icon: svgBestiary,
                },
            ],
        },

        // ─── World Building ───────────────────────────────────────────────────
        {
            title: 'World Building',
            items: [
                {
                    id: 'ancestries',
                    label: 'Ancestries',
                    href: `${base}/ancestries`,
                    icon: svgAncestries,
                },
                {
                    id: 'lore',
                    label: 'Lore',
                    href: `${base}/lore`,
                    icon: svgWorlds,
                },
                {
                    id: 'nations',
                    label: 'Nations',
                    href: `${base}/nations`,
                    icon: svgLocations,
                },
                {
                    id: 'factions',
                    label: 'Factions',
                    href: `${base}/factions`,
                    icon: svgNpcs,
                },
                {
                    id: 'locations',
                    label: 'Locations',
                    href: `${base}/locations`,
                    icon: svgLocations,
                },
            ],
        },

        // ─── Magic & Items ────────────────────────────────────────────────────
        {
            title: 'Magic & Items',
            items: [
                {
                    id: 'arcana',
                    label: 'Arcana',
                    href: `${base}/arcana`,
                    icon: svgSpells,
                },
                {
                    id: 'items',
                    label: 'Items',
                    href: `${base}/items`,
                    icon: svgItems,
                },
            ],
        },
    ]
}
