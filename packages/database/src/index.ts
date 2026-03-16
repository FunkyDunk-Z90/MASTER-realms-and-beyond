// ─── Identity ─────────────────────────────────────────────────────────────────

export { default as Identity } from './user/identityModel'
export type {
    T_IdentityMethods,
    T_IdentityStatics,
    T_IdentityModel,
} from './user/_types'

// ─── Aetherscribe Account ─────────────────────────────────────────────────────

export { default as AetherscribeProfile } from './aetherscribe/aetherscribeModel'
export type {
    I_AetherscribeDoc,
    I_AetherscribeMethods,
} from './aetherscribe/aetherscribeModel'

// ─── Aetherscribe Content ─────────────────────────────────────────────────────

export { default as Codex } from './aetherscribe/codexModel'
export type { I_CodexDoc, I_CodexMethods } from './aetherscribe/codexModel'

export { default as World } from './aetherscribe/worldModel'
export type { I_WorldDoc } from './aetherscribe/worldModel'

export { default as Campaign } from './aetherscribe/campaignModel'
export type { I_CampaignDoc } from './aetherscribe/campaignModel'

export { default as PlayerCharacter } from './aetherscribe/characterModel'
export type { I_CharacterDoc } from './aetherscribe/characterModel'

export { default as Npc } from './aetherscribe/npcModel'
export type { I_NpcDoc } from './aetherscribe/npcModel'

export { default as BestiaryEntry } from './aetherscribe/bestiaryModel'
export type { I_BestiaryDoc } from './aetherscribe/bestiaryModel'

export { default as Ancestry } from './aetherscribe/ancestryModel'
export type { I_AncestryDoc } from './aetherscribe/ancestryModel'

export { default as Lore } from './aetherscribe/loreModel'
export type { I_LoreDoc } from './aetherscribe/loreModel'

export { default as Item } from './aetherscribe/itemModel'
export type { I_ItemDoc } from './aetherscribe/itemModel'

export { default as Arcana } from './aetherscribe/arcanaModel'
export type { I_ArcanaDoc } from './aetherscribe/arcanaModel'

export { default as Location } from './aetherscribe/locationModel'
export type { I_LocationDoc } from './aetherscribe/locationModel'

export { default as Nation } from './aetherscribe/nationModel'
export type { I_NationDoc } from './aetherscribe/nationModel'

export { default as Faction } from './aetherscribe/factionModel'
export type { I_FactionDoc } from './aetherscribe/factionModel'
