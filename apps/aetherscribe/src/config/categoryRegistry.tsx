import {
    worldsApi,
    campaignsApi,
    charactersApi,
    npcsApi,
    bestiaryApi,
    ancestriesApi,
    itemsApi,
    loreApi,
    arcanaApi,
    locationsApi,
    nationsApi,
    factionsApi,
} from '@/src/api/aetherscribeApi'
import WorldForm from '@/src/components/forms/WorldForm'
import CampaignForm from '@/src/components/forms/CampaignForm'
import CharacterForm from '@/src/components/forms/CharacterForm'
import NpcForm from '@/src/components/forms/NpcForm'
import BestiaryForm from '@/src/components/forms/BestiaryForm'
import AncestryForm from '@/src/components/forms/AncestryForm'
import ItemForm from '@/src/components/forms/ItemForm'
import LoreForm from '@/src/components/forms/LoreForm'
import ArcanaForm from '@/src/components/forms/ArcanaForm'
import LocationForm from '@/src/components/forms/LocationForm'
import NationForm from '@/src/components/forms/NationForm'
import FactionForm from '@/src/components/forms/FactionForm'

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_CategoryFormProps = {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

export interface I_CategoryConfig {
    title: string
    api: {
        list: (params: {
            codexId: string
            subCategory?: string
            search?: string
            limit?: number
            offset?: number
        }) => Promise<{ items: any[]; pagination: any }>
        get: (id: string) => Promise<any>
    }
    FormComponent: React.ComponentType<T_CategoryFormProps>
    subCategories?: { value: string; label: string }[]
}

// ─── Registry ─────────────────────────────────────────────────────────────────
// Keys are URL slugs — e.g. /hub/[codexId]/player-characters

export const CATEGORY_REGISTRY: Record<string, I_CategoryConfig> = {
    worlds: {
        title: 'Worlds',
        api: worldsApi,
        FormComponent: WorldForm,
        subCategories: [
            { value: 'high_fantasy', label: 'High Fantasy' },
            { value: 'low_fantasy', label: 'Low Fantasy' },
            { value: 'dark_fantasy', label: 'Dark Fantasy' },
            { value: 'sci_fantasy', label: 'Sci-Fantasy' },
            { value: 'mythic', label: 'Mythic' },
            { value: 'post_apocalyptic', label: 'Post-Apocalyptic' },
            { value: 'planar', label: 'Planar / Multiverse' },
            { value: 'historical_fantasy', label: 'Historical Fantasy' },
            { value: 'custom', label: 'Custom' },
        ],
    },

    campaigns: {
        title: 'Campaigns',
        api: campaignsApi,
        FormComponent: CampaignForm,
        subCategories: [
            { value: 'main_arc', label: 'Main Arc' },
            { value: 'side_arc', label: 'Side Arc' },
            { value: 'session_log', label: 'Session Log' },
            { value: 'quest', label: 'Quest' },
            { value: 'encounter', label: 'Encounter' },
        ],
    },

    'player-characters': {
        title: 'Player Characters',
        api: charactersApi,
        FormComponent: CharacterForm,
        subCategories: [
            { value: 'hero', label: 'Hero' },
            { value: 'antihero', label: 'Antihero' },
            { value: 'retired', label: 'Retired' },
            { value: 'deceased', label: 'Deceased' },
        ],
    },

    npcs: {
        title: 'NPCs',
        api: npcsApi,
        FormComponent: NpcForm,
        subCategories: [
            { value: 'general', label: 'General' },
            { value: 'villain', label: 'Villain' },
            { value: 'ally', label: 'Ally' },
            { value: 'merchant', label: 'Merchant' },
            { value: 'quest_giver', label: 'Quest Giver' },
            { value: 'neutral', label: 'Neutral' },
        ],
    },

    bestiary: {
        title: 'Bestiary',
        api: bestiaryApi,
        FormComponent: BestiaryForm,
        subCategories: [
            { value: 'beast', label: 'Beast' },
            { value: 'undead', label: 'Undead' },
            { value: 'construct', label: 'Construct' },
            { value: 'aberration', label: 'Aberration' },
            { value: 'celestial', label: 'Celestial' },
            { value: 'fiend', label: 'Fiend' },
            { value: 'elemental', label: 'Elemental' },
            { value: 'humanoid', label: 'Humanoid' },
            { value: 'dragon', label: 'Dragon' },
            { value: 'fey', label: 'Fey' },
            { value: 'monstrosity', label: 'Monstrosity' },
            { value: 'plant', label: 'Plant' },
            { value: 'ooze', label: 'Ooze' },
            { value: 'giant', label: 'Giant' },
            { value: 'custom', label: 'Custom' },
        ],
    },

    ancestries: {
        title: 'Ancestries',
        api: ancestriesApi,
        FormComponent: AncestryForm,
        subCategories: [
            { value: 'ancestry', label: 'Ancestry' },
            { value: 'heritage', label: 'Heritage' },
        ],
    },

    items: {
        title: 'Items',
        api: itemsApi,
        FormComponent: ItemForm,
        subCategories: [
            { value: 'weapon', label: 'Weapon' },
            { value: 'armor', label: 'Armor' },
            { value: 'tool', label: 'Tool / Equipment' },
            { value: 'consumable', label: 'Consumable' },
            { value: 'artifact', label: 'Artifact' },
            { value: 'currency', label: 'Currency / Gem' },
            { value: 'trinket', label: 'Trinket / Jewellery' },
            { value: 'vehicle', label: 'Vehicle / Mount' },
            { value: 'spellbook', label: 'Spellbook / Grimoire' },
            { value: 'wondrous', label: 'Wondrous Item' },
        ],
    },

    lore: {
        title: 'Lore',
        api: loreApi,
        FormComponent: LoreForm,
        subCategories: [
            { value: 'history', label: 'History' },
            { value: 'myth', label: 'Myth & Legend' },
            { value: 'culture', label: 'Culture' },
            { value: 'religion_overview', label: 'Religion Overview' },
            { value: 'event', label: 'Historical Event' },
            { value: 'prophecy', label: 'Prophecy' },
            { value: 'legend', label: 'Legend' },
        ],
    },

    arcana: {
        title: 'Arcana',
        api: arcanaApi,
        FormComponent: ArcanaForm,
        subCategories: [
            { value: 'spell', label: 'Spell / Cantrip' },
            { value: 'magic_system', label: 'Magic System' },
            { value: 'belief', label: 'Belief / Religion / Deity' },
            { value: 'ritual', label: 'Ritual / Ceremony' },
            { value: 'school', label: 'School / Tradition' },
        ],
    },

    locations: {
        title: 'Locations',
        api: locationsApi,
        FormComponent: LocationForm,
        subCategories: [
            { value: 'city', label: 'City' },
            { value: 'town', label: 'Town' },
            { value: 'village', label: 'Village' },
            { value: 'dungeon', label: 'Dungeon / Lair' },
            { value: 'ruin', label: 'Ruin' },
            { value: 'wilderness', label: 'Wilderness / Region' },
            { value: 'building', label: 'Building / Structure' },
            { value: 'landmark', label: 'Landmark' },
            { value: 'plane', label: 'Plane of Existence' },
            { value: 'region', label: 'Region' },
            { value: 'underwater', label: 'Underwater' },
            { value: 'sky', label: 'Sky / Floating' },
        ],
    },

    nations: {
        title: 'Nations',
        api: nationsApi,
        FormComponent: NationForm,
        subCategories: [
            { value: 'kingdom', label: 'Kingdom (Monarchy)' },
            { value: 'empire', label: 'Empire' },
            { value: 'republic', label: 'Republic' },
            { value: 'city_state', label: 'City-State' },
            { value: 'tribal_confederation', label: 'Tribal Confederation' },
            { value: 'theocracy', label: 'Theocracy' },
            { value: 'oligarchy', label: 'Oligarchy' },
            { value: 'duchy', label: 'Duchy' },
            { value: 'federation', label: 'Federation' },
            { value: 'corporate_state', label: 'Corporate / Merchant State' },
        ],
    },

    factions: {
        title: 'Factions',
        api: factionsApi,
        FormComponent: FactionForm,
        subCategories: [
            { value: 'guild', label: 'Guild' },
            { value: 'secret_society', label: 'Secret Society' },
            { value: 'military_force', label: 'Military Force / Order' },
            { value: 'religious_order', label: 'Religious Order / Cult' },
            { value: 'criminal', label: 'Criminal Organisation' },
            { value: 'political', label: 'Political Party / Noble House' },
            { value: 'mercantile', label: 'Mercantile / Trading Company' },
            { value: 'scholarly', label: 'Scholarly / Arcane Order' },
            { value: 'tribal', label: 'Tribal / Clan' },
            { value: 'revolutionary', label: 'Revolutionary / Resistance' },
        ],
    },
}
