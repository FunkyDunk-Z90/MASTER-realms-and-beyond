// ─── Logos ────────────────────────────────────────────────────────────────────

export { default as aetherscribeLogo } from './images/logos/aetherscribe-logo.png'

// ─── Icons ────────────────────────────────────────────────────────────────────

export { default as iconBook } from './images/icons/book.png'
export { default as iconCastle } from './images/icons/castle.png'
export { default as iconDragon } from './images/icons/dragon.png'
export { default as iconIce } from './images/icons/ice.png'
export { default as iconKnight } from './images/icons/knight.png'
export { default as iconMagicPotion } from './images/icons/magic-potion.png'
export { default as iconMap } from './images/icons/map.png'
export { default as iconSpellBook } from './images/icons/spell-book.png'
export { default as iconVictory } from './images/icons/victory.png'
export { default as iconWizard } from './images/icons/wizard.png'

// ─── Images ────────────────────────────────────────────────────────────────────

export { default as rnbCoverImage } from './images/backgrounds/rnb-cover.jpg'

// ─── SVG Icon Components ──────────────────────────────────────────────────────
// Inline TSX components — always React functions, always use currentColor.
// The .svg source files in images/icons/svg/ are kept as design references
// but NOT imported here (Next.js without SVGR config returns them as static
// asset URLs, which cannot inherit CSS color/theme values).

export {
    svgHub,
    svgAncestries,
    svgBestiary,
    svgCampaigns,
    svgFeats,
    svgItems,
    svgLocations,
    svgNpcs,
    svgOrigins,
    svgPlayerCharacters,
    svgSpells,
    svgWorlds,
} from './icons'
