import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_ItemSubCategory = z.enum([
    'weapon',     // Swords, axes, bows, daggers, etc.
    'armor',      // Plate, leather, shields, helmets
    'tool',       // Tools, kits, instruments
    'consumable', // Potions, scrolls, ammunition, food
    'artifact',   // Legendary or unique magical items
    'currency',   // Coins, gems, trade goods
    'trinket',    // Miscellaneous small items, jewelry
    'vehicle',    // Mounts, ships, carts, airships
    'spellbook',  // Grimoires, tomes of magic
    'wondrous',   // Misc wondrous/magical items
])

export const Z_ItemRarity = z.enum([
    'common', 'uncommon', 'rare', 'very_rare', 'legendary', 'artifact', 'unique',
])

export const Z_WeaponCategory = z.enum([
    'simple_melee', 'simple_ranged', 'martial_melee', 'martial_ranged', 'exotic',
])

export const Z_DamageType = z.enum([
    'bludgeoning', 'piercing', 'slashing', 'acid', 'cold', 'fire',
    'force', 'lightning', 'necrotic', 'poison', 'psychic', 'radiant',
    'thunder', 'custom',
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_ItemEffect = z.object({
    name: z.string(),
    description: z.string(),
    requiresActivation: z.boolean().optional(),
    charges: z.number().int().positive().optional(),
    recharge: z.string().optional(),
})

// ─── Item Document ────────────────────────────────────────────────────────────

export const Z_Item = Z_BaseDocument.extend({
    subCategory: Z_ItemSubCategory,
    rarity: Z_ItemRarity.optional(),
    requiresAttunement: z.boolean().optional(),
    attunementRequirements: z.string().optional(),
    weight: z.number().nonnegative().optional(),
    value: z.string().optional(),
    valueInGold: z.number().nonnegative().optional(),
    // Weapon-specific
    weaponCategory: Z_WeaponCategory.optional(),
    damage: z.string().optional(),
    damageType: Z_DamageType.optional(),
    secondaryDamage: z.string().optional(),
    range: z.string().optional(),
    properties: z.array(z.string()).optional(),
    // Armor-specific
    armorCategory: z.enum(['light', 'medium', 'heavy', 'shield']).optional(),
    armorClass: z.number().int().nonnegative().optional(),
    strengthRequirement: z.number().int().nonnegative().optional(),
    stealthDisadvantage: z.boolean().optional(),
    // Consumable-specific
    uses: z.number().int().positive().optional(),
    // Magical
    isMagical: z.boolean().optional(),
    isArtifact: z.boolean().optional(),
    charges: z.number().int().nonnegative().optional(),
    maxCharges: z.number().int().positive().optional(),
    recharge: z.string().optional(),
    effects: z.array(Z_ItemEffect).optional(),
    // History & lore
    creator: z.string().optional(),
    history: z.string().optional(),
    curseDescription: z.string().optional(),
    isCursed: z.boolean().optional(),
    currentOwner: Z_ObjectId.optional(),
    imageUrl: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateItemRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_ItemSubCategory,
    rarity: Z_ItemRarity.optional(),
    requiresAttunement: z.boolean().optional(),
    attunementRequirements: z.string().optional(),
    weight: z.number().nonnegative().optional(),
    value: z.string().optional(),
    weaponCategory: Z_WeaponCategory.optional(),
    damage: z.string().optional(),
    damageType: Z_DamageType.optional(),
    range: z.string().optional(),
    properties: z.array(z.string()).optional(),
    armorCategory: z.enum(['light', 'medium', 'heavy', 'shield']).optional(),
    armorClass: z.number().int().nonnegative().optional(),
    uses: z.number().int().positive().optional(),
    isMagical: z.boolean().optional(),
    charges: z.number().int().nonnegative().optional(),
    maxCharges: z.number().int().positive().optional(),
    recharge: z.string().optional(),
    effects: z.array(Z_ItemEffect).optional(),
    creator: z.string().optional(),
    history: z.string().optional(),
    isCursed: z.boolean().optional(),
    curseDescription: z.string().optional(),
    imageUrl: z.string().optional(),
})

export const Z_UpdateItemRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_ItemSubCategory.optional(),
    rarity: Z_ItemRarity.optional(),
    requiresAttunement: z.boolean().optional(),
    attunementRequirements: z.string().optional(),
    weight: z.number().nonnegative().optional(),
    value: z.string().optional(),
    weaponCategory: Z_WeaponCategory.optional(),
    damage: z.string().optional(),
    damageType: Z_DamageType.optional(),
    range: z.string().optional(),
    properties: z.array(z.string()).optional(),
    armorCategory: z.enum(['light', 'medium', 'heavy', 'shield']).optional(),
    armorClass: z.number().int().nonnegative().optional(),
    uses: z.number().int().positive().optional(),
    isMagical: z.boolean().optional(),
    charges: z.number().int().nonnegative().optional(),
    maxCharges: z.number().int().positive().optional(),
    recharge: z.string().optional(),
    effects: z.array(Z_ItemEffect).optional(),
    creator: z.string().optional(),
    history: z.string().optional(),
    isCursed: z.boolean().optional(),
    curseDescription: z.string().optional(),
    currentOwner: Z_ObjectId.optional(),
    imageUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_ItemSubCategory = z.infer<typeof Z_ItemSubCategory>
export type T_ItemRarity = z.infer<typeof Z_ItemRarity>
export type T_DamageType = z.infer<typeof Z_DamageType>
export type T_ItemEffect = z.infer<typeof Z_ItemEffect>
export type T_Item = z.infer<typeof Z_Item>
export type T_CreateItemRequest = z.infer<typeof Z_CreateItemRequest>
export type T_UpdateItemRequest = z.infer<typeof Z_UpdateItemRequest>
