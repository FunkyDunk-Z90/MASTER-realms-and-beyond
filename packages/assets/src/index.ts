// ─── Logos ────────────────────────────────────────────────────────────────────

export { default as aetherscribeLogo } from './images/logos/aetherscribe-logo.png'

// ─── Icons ────────────────────────────────────────────────────────────────────

export { default as aetherscribeInvertedLogo } from './images/icons/aetherscribe-inverted-square-logo.png'
export { default as aetherscribeInvertedSymbol } from './images/icons/aetherscribe-inverted-symbol.png'
export { default as aetherscribeMainSquareLogo } from './images/icons/aetherscribe-main-square-logo.png'
export { default as aetherscribeMainSymbol } from './images/icons/aetherscribe-main-symbol.png'
export { default as aetherscribeMonoSquareLogo } from './images/icons/aetherscribe-mono-square-logo.png'
export { default as aetherscribeMonoSymbol } from './images/icons/aetherscribe-mono-symbol.png'
export { default as aetherscribeTransparentLogo } from './images/icons/aetherscribe-transparent-logo.png'

// ─── Images ────────────────────────────────────────────────────────────────────

export { default as rnbCoverImage } from './images/backgrounds/rnb-cover.jpg'
export { default as tapestry } from './images/backgrounds/tapestry-of-time.jpg'

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
