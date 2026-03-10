import { CartridgeCard } from '@rnb/ui'

const CARTRIDGES = [
    {
        title: 'The Shattered Crown',
        subtitle: 'Epic Fantasy · Act I',
        description: 'An ancient crown shattered across five realms. Only the last heir can reunite the shards.',
        platform: 'AETHERSCRIBE',
        badge: '★ Campaign',
        tag: 'v2.1',
        accentColor: '#C47818',
        href: '/hub/campaigns/shattered-crown',
    },
    {
        title: 'Ironveil Dungeon',
        subtitle: 'Dungeon Crawl · Solo',
        description: 'Descend into the cursed fortress beneath Ironveil. 40 floors. No mercy.',
        platform: 'AETHERSCRIBE',
        badge: '⚔ Adventure',
        tag: 'v1.0',
        accentColor: '#4A8A52',
        href: '/hub/adventures/ironveil',
    },
    {
        title: 'Kael Dunmore',
        subtitle: 'Human Rogue · Level 7',
        description: 'Born in the gutters of Port Ashfen. Now hunted by three guilds and one angry dragon.',
        platform: 'AETHERSCRIBE',
        badge: '◈ Character',
        tag: 'Active',
        accentColor: '#7A4A9A',
        href: '/hub/player-characters/kael',
    },
    {
        title: 'Thornwood Codex',
        subtitle: 'Lore · World Bible',
        description: 'The complete history of the Thornwood Empire — its rise, fall, and the magic that cursed its soil.',
        platform: 'AETHERSCRIBE',
        badge: '📖 Lore',
        tag: 'Draft',
        accentColor: '#1A7280',
        href: '/hub/lore/thornwood-codex',
    },
    {
        title: 'Siege of Ashport',
        subtitle: 'Encounter · Mass Battle',
        description: 'Three thousand soldiers. One tidal gate. Defend Ashport before the fleet arrives at dawn.',
        platform: 'AETHERSCRIBE',
        badge: '⚡ Encounter',
        tag: 'v0.8',
        accentColor: '#8A2820',
        href: '/hub/encounters/siege-ashport',
    },
    {
        title: 'The Silver Road',
        subtitle: 'One-Shot · 4h Est.',
        description: 'A merchant caravan. A haunted pass. And something watching from the tree line.',
        platform: 'AETHERSCRIBE',
        badge: '◐ One-Shot',
        tag: 'Ready',
        accentColor: '#C4A018',
        href: '/hub/adventures/silver-road',
    },
]

export default function Hub() {
    return (
        <>
            <h1>Adventure Hub</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
                Your campaigns, characters, lore, and encounters — all in one place.
            </p>

            <div className="cartridge-grid">
                {CARTRIDGES.map((c) => (
                    <CartridgeCard key={c.href} {...c} />
                ))}
            </div>
        </>
    )
}
