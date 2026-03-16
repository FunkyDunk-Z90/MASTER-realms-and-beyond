/**
 * @rnb/types — AetherScribe Entity Types
 * Core category types re-exported from @rnb/validators.
 */

export type {
    T_Ruleset,
    T_BaseDocument,
    T_PlayerCharacter,
    T_CreatePlayerCharacterRequest,
    T_UpdatePlayerCharacterRequest,
    T_CharacterSubCategory,
    T_Alignment,
    T_AbilityScores,
    T_CharacterVitals,
    T_Npc,
    T_CreateNpcRequest,
    T_UpdateNpcRequest,
    T_NpcSubCategory,
    T_NpcDisposition,
    T_BestiaryEntry,
    T_CreateBestiaryEntryRequest,
    T_UpdateBestiaryEntryRequest,
    T_BestiarySubCategory,
    T_CreatureSize,
    T_Ancestry,
    T_CreateAncestryRequest,
    T_UpdateAncestryRequest,
    T_AncestrySubCategory,
    T_Lore,
    T_CreateLoreRequest,
    T_UpdateLoreRequest,
    T_LoreSubCategory,
    T_Item,
    T_CreateItemRequest,
    T_UpdateItemRequest,
    T_ItemSubCategory,
    T_ItemRarity,
    T_Arcana,
    T_CreateArcanaRequest,
    T_UpdateArcanaRequest,
    T_ArcanaSubCategory,
    T_SpellSchool,
    T_Location,
    T_CreateLocationRequest,
    T_UpdateLocationRequest,
    T_LocationSubCategory,
    T_Nation,
    T_CreateNationRequest,
    T_UpdateNationRequest,
    T_NationSubCategory,
    T_Faction,
    T_CreateFactionRequest,
    T_UpdateFactionRequest,
    T_FactionSubCategory,
} from '@rnb/validators'

import type {
    T_Ruleset,
    T_BaseDocument,
    T_PlayerCharacter,
    T_Npc,
    T_BestiaryEntry,
    T_Ancestry,
    T_Lore,
    T_Item,
    T_Arcana,
    T_Location,
    T_Nation,
    T_Faction,
} from '@rnb/validators'

// ─── Aliases ──────────────────────────────────────────────────────────────────

export type E_Ruleset = T_Ruleset
export type I_BaseDocument = T_BaseDocument

export type I_PlayerCharacter = T_PlayerCharacter
export type I_Npc = T_Npc
export type I_BestiaryEntry = T_BestiaryEntry
export type I_Ancestry = T_Ancestry
export type I_Lore = T_Lore
export type I_Item = T_Item
export type I_Arcana = T_Arcana
export type I_Location = T_Location
export type I_Nation = T_Nation
export type I_Faction = T_Faction

// ─── Union type for all content ───────────────────────────────────────────────

export type I_AnyContent =
    | T_PlayerCharacter
    | T_Npc
    | T_BestiaryEntry
    | T_Ancestry
    | T_Lore
    | T_Item
    | T_Arcana
    | T_Location
    | T_Nation
    | T_Faction
