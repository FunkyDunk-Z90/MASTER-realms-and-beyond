import { I_AetherScribeContent } from '@rnb/types'

// ─── Test data matching I_AetherScribeContent shape ───────────────────────────
// Replace with a real API call once the server is ready.

export const testAccountContent: I_AetherScribeContent = {
    playerCharacters: [
        { contentId: 'pc-001', contentName: 'Aldric Stonehammer' },
        { contentId: 'pc-002', contentName: 'Seraphina Ashveil' },
        { contentId: 'pc-003', contentName: 'Threx the Unbroken' },
        { contentId: 'pc-004', contentName: 'Mirela Dusk' },
    ],
    npcs: [
        { contentId: 'npc-001', contentName: 'Tarvon the Merchant' },
        { contentId: 'npc-002', contentName: 'Lady Sylvara' },
        { contentId: 'npc-003', contentName: 'Brother Eddan' },
        { contentId: 'npc-004', contentName: 'The Pale Watcher' },
        { contentId: 'npc-005', contentName: 'Grulk Ironjaw' },
    ],
    worlds: [
        { contentId: 'wld-001', contentName: 'Aelvorn — The Shattered Realm' },
        { contentId: 'wld-002', contentName: 'Cindervast' },
    ],
    campaigns: [
        { contentId: 'cmp-001', contentName: 'The Ember Crown' },
        { contentId: 'cmp-002', contentName: 'Shards of the Pale Gate' },
        { contentId: 'cmp-003', contentName: 'Beneath the Iron Sea' },
    ],
    items: [
        { contentId: 'itm-001', contentName: 'Shadowfang Dagger' },
        { contentId: 'itm-002', contentName: 'Cloak of the Ashen Wood' },
        { contentId: 'itm-003', contentName: 'Ring of Far Sight' },
        { contentId: 'itm-004', contentName: 'Thornwood Staff' },
    ],
    classes: [
        { contentId: 'cls-001', contentName: 'Runeblade' },
        { contentId: 'cls-002', contentName: 'Verdant Warden' },
        { contentId: 'cls-003', contentName: 'Soulweaver' },
    ],
    ancestries: [
        { contentId: 'anc-001', contentName: 'Ashborn' },
        { contentId: 'anc-002', contentName: 'Verdani' },
        { contentId: 'anc-003', contentName: 'Stonekith' },
    ],
    monsters: [
        { contentId: 'mon-001', contentName: 'Veilwraith' },
        { contentId: 'mon-002', contentName: 'Cinder Drake' },
        { contentId: 'mon-003', contentName: 'Thornback Basilisk' },
        { contentId: 'mon-004', contentName: 'The Hollow King' },
    ],
    spells: [
        { contentId: 'spl-001', contentName: 'Ember Lash' },
        { contentId: 'spl-002', contentName: 'Veilstep' },
        { contentId: 'spl-003', contentName: 'Thornwall' },
        { contentId: 'spl-004', contentName: 'Mind Fracture' },
        { contentId: 'spl-005', contentName: 'Glacial Tomb' },
    ],
    feats: [
        { contentId: 'fea-001', contentName: 'Arcane Resilience' },
        { contentId: 'fea-002', contentName: 'Shadow Step Mastery' },
        { contentId: 'fea-003', contentName: "Titan's Grip" },
    ],
    backgrounds: [
        { contentId: 'bg-001', contentName: 'Exiled Noble' },
        { contentId: 'bg-002', contentName: 'Runic Scholar' },
        { contentId: 'bg-003', contentName: 'Wandering Blade' },
    ],
}

// ─── Category metadata for display ────────────────────────────────────────────

export type T_ContentCategory = keyof I_AetherScribeContent

export interface I_CategoryMeta {
    label: string
    href: string
    emoji: string
}

export const categoryMeta: Record<T_ContentCategory, I_CategoryMeta> = {
    playerCharacters: {
        label: 'Player Character',
        href: '/hub/player-characters',
        emoji: '🧙',
    },
    npcs: { label: 'NPC', href: '/hub/npcs', emoji: '🗣️' },
    worlds: { label: 'World', href: '/hub/worlds', emoji: '🌍' },
    campaigns: { label: 'Campaign', href: '/hub/campaigns', emoji: '📖' },
    items: { label: 'Item', href: '/hub/items', emoji: '⚔️' },
    classes: { label: 'Class', href: '/hub/classes', emoji: '🛡️' },
    ancestries: { label: 'Ancestry', href: '/hub/ancestries', emoji: '🌿' },
    monsters: { label: 'Monster', href: '/hub/bestiary', emoji: '🐉' },
    spells: { label: 'Spell', href: '/hub/spells', emoji: '✨' },
    feats: { label: 'Feat', href: '/hub/feats', emoji: '🏆' },
    backgrounds: { label: 'Background', href: '/hub/backgrounds', emoji: '📜' },
}
