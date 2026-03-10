import { I_SidebarSection } from '@rnb/ui'

import { LucideEarth } from 'lucide-react'

import Worlds from '@/public/map.png'
import Npc from '@/public/wizard.png'
import Ancestry from '@/public/knight.png'
import Hub from '@/public/castle.png'
import Items from '@/public/magic-potion.png'
import Feat from '@/public/victory.png'
import Spells from '@/public/spell-book.png'
import Beast from '@/public/dragon.png'
import Background from '@/public/ice.png'
import Campaigns from '@/public/book.png'

// Only lists routes that have an actual page.tsx in the aetherscribe app.
// Add entries here as new pages are created.
export const sidebarData: I_SidebarSection[] = [
    // ─── Hub ──────────────────────────────────────────────────────────────────
    {
        title: 'Hub',
        items: [{ id: 'hub', label: 'Adventure Hub', href: '/hub', icon: Hub }],
    },

    // ─── Characters ───────────────────────────────────────────────────────────
    {
        title: 'Characters',
        items: [
            {
                id: 'player-characters',
                label: 'Player Characters',
                href: '/hub/player-characters',
                icon: Hub,
            },
            {
                id: 'npcs',
                label: 'NPCs',
                href: '/hub/npcs',
                icon: Npc,
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
                icon: Campaigns,
            },
            {
                id: 'worlds',
                label: 'Worlds',
                href: '/hub/worlds',
                icon: Worlds,
            },
            {
                id: 'bestiary',
                label: 'Bestiary',
                href: '/hub/bestiary',
                icon: Beast,
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
                icon: Ancestry,
            },
            {
                id: 'backgrounds',
                label: 'Backgrounds',
                href: '/hub/backgrounds',
                icon: Background,
            },
            {
                id: 'feats',
                label: 'Feats',
                href: '/hub/feats',
                icon: Feat,
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
                icon: Spells,
            },
            {
                id: 'items',
                label: 'Items',
                href: '/hub/items',
                icon: Items,
            },
        ],
    },
]
