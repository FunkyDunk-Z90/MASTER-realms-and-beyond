import { I_SidebarSection } from '@rnb/ui'

import Worlds from '@/public/map.png'
import Npc from '@/public/wizard.png'
import Ancestry from '@/public/knight.png'
import Icon from '@/public/dragon.jpg'
import Items from '@/public/magic-potion.png'
import Feat from '@/public/victory.png'
import Spells from '@/public/spell-book.png'
import Beast from '@/public/dragon.png'
import Background from '@/public/ice.png'
import Campaigns from '@/public/book.png'

export const sidebarData: I_SidebarSection[] = [
    // ─── Hub ──────────────────────────────────────────────────────────────────
    {
        title: 'Hub',
        items: [
            {
                href: '/hub',
                id: 'hub',
                label: 'Adventure Hub',
                icon: Icon,
            },
        ],
    },

    // ─── Categories ───────────────────────────────────────────────────────────
    // Each top-level item maps 1-to-1 with a key in I_AetherScribeContent so
    // categoryMeta in sidebarTestData.ts can resolve the correct base href.
    {
        title: 'Categories',
        items: [
            {
                href: '/hub/player-characters',
                id: 'player-characters',
                label: 'Player Characters',
                icon: Icon,
            },
            {
                href: '/hub/worlds',
                id: 'worlds',
                label: 'Worlds',
                icon: Worlds,
            },
            {
                href: '/hub/campaigns',
                id: 'campaigns',
                label: 'Campaigns',
                icon: Campaigns,
            },
            {
                href: '/hub/ancestries',
                id: 'ancestries',
                label: 'Ancestries',
                icon: Ancestry,
                children: [
                    {
                        href: '/hub/ancestries/common',
                        id: 'ancestries-common',
                        label: 'Common',
                        icon: Ancestry,
                        children: [
                            {
                                href: '/hub/ancestries/common/human',
                                id: 'ancestries-human',
                                label: 'Human',
                                icon: Ancestry,
                            },
                            {
                                href: '/hub/ancestries/common/elf',
                                id: 'ancestries-elf',
                                label: 'Elf',
                                icon: Ancestry,
                            },
                            {
                                href: '/hub/ancestries/common/dwarf',
                                id: 'ancestries-dwarf',
                                label: 'Dwarf',
                                icon: Ancestry,
                            },
                        ],
                    },
                    {
                        href: '/hub/ancestries/rare',
                        id: 'ancestries-rare',
                        label: 'Rare',
                        icon: Ancestry,
                        children: [
                            {
                                href: '/hub/ancestries/rare/tiefling',
                                id: 'ancestries-tiefling',
                                label: 'Tiefling',
                                icon: Ancestry,
                            },
                            {
                                href: '/hub/ancestries/rare/aasimar',
                                id: 'ancestries-aasimar',
                                label: 'Aasimar',
                                icon: Ancestry,
                            },
                        ],
                    },
                ],
            },
            {
                href: '/hub/classes',
                id: 'classes',
                label: 'Classes',
                icon: Ancestry,
            },
            {
                href: '/hub/backgrounds',
                id: 'backgrounds',
                label: 'Backgrounds',
                icon: Background,
            },
            {
                href: '/hub/feats',
                id: 'feats',
                label: 'Feats',
                icon: Feat,
            },
        ],
    },

    // ─── Characters & Creatures ───────────────────────────────────────────────
    {
        title: 'Characters & Creatures',
        items: [
            {
                href: '/hub/npcs',
                id: 'npcs',
                label: 'NPCs',
                icon: Npc,
                children: [
                    {
                        href: '/hub/npcs/merchants',
                        id: 'npcs-merchants',
                        label: 'Merchants',
                        icon: Npc,
                    },
                    {
                        href: '/hub/npcs/allies',
                        id: 'npcs-allies',
                        label: 'Allies',
                        icon: Npc,
                    },
                    {
                        href: '/hub/npcs/villains',
                        id: 'npcs-villains',
                        label: 'Villains',
                        icon: Npc,
                    },
                ],
            },
            {
                href: '/hub/bestiary',
                id: 'bestiary',
                label: 'Bestiary',
                icon: Beast,
                children: [
                    {
                        href: '/hub/bestiary/beasts',
                        id: 'bestiary-beasts',
                        label: 'Beasts',
                        icon: Beast,
                    },
                    {
                        href: '/hub/bestiary/undead',
                        id: 'bestiary-undead',
                        label: 'Undead',
                        icon: Beast,
                    },
                    {
                        href: '/hub/bestiary/dragons',
                        id: 'bestiary-dragons',
                        label: 'Dragons',
                        icon: Beast,
                    },
                    {
                        href: '/hub/bestiary/fey',
                        id: 'bestiary-fey',
                        label: 'Fey',
                        icon: Beast,
                    },
                    {
                        href: '/hub/bestiary/constructs',
                        id: 'bestiary-constructs',
                        label: 'Constructs',
                        icon: Beast,
                    },
                ],
            },
        ],
    },

    // ─── Magic ────────────────────────────────────────────────────────────────
    {
        title: 'Magic',
        items: [
            {
                href: '/hub/spells',
                id: 'spells',
                label: 'Spells',
                icon: Spells,
                children: [
                    {
                        href: '/hub/spells/cantrips',
                        id: 'spells-cantrips',
                        label: 'Cantrips',
                        icon: Spells,
                    },
                    {
                        href: '/hub/spells/level-1',
                        id: 'spells-level-1',
                        label: 'Level 1',
                        icon: Spells,
                    },
                    {
                        href: '/hub/spells/level-2',
                        id: 'spells-level-2',
                        label: 'Level 2',
                        icon: Spells,
                    },
                    {
                        href: '/hub/spells/level-3',
                        id: 'spells-level-3',
                        label: 'Level 3',
                        icon: Spells,
                    },
                    {
                        href: '/hub/spells/level-4-plus',
                        id: 'spells-level-4-plus',
                        label: 'Level 4+',
                        icon: Spells,
                    },
                ],
            },
            {
                href: '/hub/items',
                id: 'items',
                label: 'Items',
                icon: Items,
                children: [
                    {
                        href: '/hub/items/weapons',
                        id: 'items-weapons',
                        label: 'Weapons',
                        icon: Items,
                    },
                    {
                        href: '/hub/items/armour',
                        id: 'items-armour',
                        label: 'Armour',
                        icon: Items,
                    },
                    {
                        href: '/hub/items/consumables',
                        id: 'items-consumables',
                        label: 'Consumables',
                        icon: Items,
                    },
                    {
                        href: '/hub/items/magic',
                        id: 'items-magic',
                        label: 'Magic Items',
                        icon: Items,
                    },
                ],
            },
        ],
    },

    // ─── World Building ───────────────────────────────────────────────────────
    {
        title: 'World Building',
        items: [
            {
                href: '/hub/lore',
                id: 'lore',
                label: 'Lore',
                icon: Campaigns,
                children: [
                    {
                        href: '/hub/lore/history',
                        id: 'lore-history',
                        label: 'History',
                        icon: Campaigns,
                    },
                    {
                        href: '/hub/lore/factions',
                        id: 'lore-factions',
                        label: 'Factions',
                        icon: Campaigns,
                    },
                    {
                        href: '/hub/lore/religions',
                        id: 'lore-religions',
                        label: 'Religions & Gods',
                        icon: Campaigns,
                    },
                ],
            },
            {
                href: '/hub/locations',
                id: 'locations',
                label: 'Locations',
                icon: Worlds,
                children: [
                    {
                        href: '/hub/locations/cities',
                        id: 'locations-cities',
                        label: 'Cities & Towns',
                        icon: Worlds,
                    },
                    {
                        href: '/hub/locations/dungeons',
                        id: 'locations-dungeons',
                        label: 'Dungeons',
                        icon: Worlds,
                    },
                    {
                        href: '/hub/locations/wilderness',
                        id: 'locations-wilderness',
                        label: 'Wilderness',
                        icon: Worlds,
                    },
                    {
                        href: '/hub/locations/planes',
                        id: 'locations-planes',
                        label: 'Planes of Existence',
                        icon: Worlds,
                    },
                ],
            },
            {
                href: '/hub/calendars',
                id: 'calendars',
                label: 'Calendars',
                icon: Campaigns,
            },
        ],
    },

    // ─── Tools ────────────────────────────────────────────────────────────────
    {
        title: 'Tools',
        items: [
            {
                href: '/hub/generators',
                id: 'generators',
                label: 'Generators',
                icon: Icon,
                children: [
                    {
                        href: '/hub/generators/names',
                        id: 'generators-names',
                        label: 'Name Generator',
                        icon: Icon,
                    },
                    {
                        href: '/hub/generators/encounters',
                        id: 'generators-encounters',
                        label: 'Encounter Builder',
                        icon: Icon,
                    },
                    {
                        href: '/hub/generators/treasure',
                        id: 'generators-treasure',
                        label: 'Treasure Hoard',
                        icon: Icon,
                    },
                ],
            },
            {
                href: '/hub/tables',
                id: 'tables',
                label: 'Random Tables',
                icon: Campaigns,
            },
        ],
    },
]
