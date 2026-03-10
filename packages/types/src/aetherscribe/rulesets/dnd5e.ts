/**
 * @rnb/types - D&D 5e 2024 Ruleset
 * Complete type definitions for D&D 5e 2024 ruleset
 */

// ============================================================================
// ABILITY SCORES & MODIFIERS
// ============================================================================

export type E_Ability =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma'

export interface I_AbilityScore {
    score: number
    modifier: number
}

export interface I_AbilityScores {
    strength: I_AbilityScore
    dexterity: I_AbilityScore
    constitution: I_AbilityScore
    intelligence: I_AbilityScore
    wisdom: I_AbilityScore
    charisma: I_AbilityScore
}

// ============================================================================
// RACES (2024 UPDATE)
// ============================================================================

export type E_Race =
    | 'aasimar'
    | 'beastfolk'
    | 'changeling'
    | 'dragonborn'
    | 'dwarf'
    | 'elf'
    | 'gnome'
    | 'goliath'
    | 'half_elf'
    | 'half_orc'
    | 'halfling'
    | 'human'
    | 'orc'
    | 'tabaxi'
    | 'tiefling'
    | 'tortle'

export interface I_Race {
    id: E_Race
    name: string
    size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan'
    speed: number
    abilityScoreIncrease: Partial<Record<E_Ability, number>>
    languages: string[]
    traits: string[]
    subraces?: {
        name: string
        description?: string
        abilityScoreIncrease?: Partial<Record<E_Ability, number>>
        traits?: string[]
    }[]
}

// ============================================================================
// CLASSES (2024 UPDATE)
// ============================================================================

export type E_Class =
    | 'artificer'
    | 'barbarian'
    | 'bard'
    | 'blood_hunter'
    | 'cleric'
    | 'druid'
    | 'fighter'
    | 'monk'
    | 'paladin'
    | 'ranger'
    | 'rogue'
    | 'sorcerer'
    | 'warlock'
    | 'wizard'

export type HitDie = 'd6' | 'd8' | 'd10' | 'd12'

export interface I_ClassProficiencies {
    armor?: string[]
    weapons?: string[]
    tools?: string[]
    savingThrows?: E_Ability[]
    skills?: string[]
}

export interface I_ClassFeature {
    level: number
    name: string
    description: string
    mechanics?: {
        [key: string]: any
    }
}

export interface I_Subclass {
    name: string
    description?: string
    features: I_ClassFeature[]
}

export interface I_Spellcasting {
    spellcastingAbility: E_Ability
    spellsKnown?: number
    cantripsKnown?: number
    spellsPerDay?: Record<number, number>
    spellSaveDC?: number
    spellAttackBonus?: number
}

export interface I_Class {
    id: E_Class
    name: string
    hitDie: HitDie
    proficiencies: I_ClassProficiencies
    features: I_ClassFeature[]
    subclasses?: I_Subclass[]
    spellcasting?: I_Spellcasting
    primaryAbility: E_Ability
    savingThrowProficiency?: E_Ability
}

// ============================================================================
// BACKGROUNDS (2024 UPDATE)
// ============================================================================

export interface I_Background {
    id: string
    name: string
    skillProficiencies: string[]
    toolProficiencies?: string[]
    languages?: string[]
    equipment?: string[]
    feat?: string
    customFeature?: {
        name: string
        description: string
    }
}

// ============================================================================
// SPELLS (2024 UPDATE)
// ============================================================================

export type E_SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type E_SpellSchool =
    | 'abjuration'
    | 'conjuration'
    | 'divination'
    | 'enchantment'
    | 'evocation'
    | 'illusion'
    | 'necromancy'
    | 'transmutation'

export interface I_SpellComponent {
    verbal: boolean
    somatic: boolean
    material?: {
        required: boolean
        description: string
        consumed: boolean
    }
}

export interface I_Spell {
    id: string
    name: string
    level: E_SpellLevel
    school: E_SpellSchool
    castingTime: string
    range: string
    components: I_SpellComponent
    duration: string
    concentration: boolean
    ritual: boolean
    description: string
    higherLevelEffect?: string
    damage?: {
        diceExpression: string
        type: string
        scaling: {
            atLevel: number
            additionalDice: string
        }[]
    }
    save?: {
        ability: E_Ability
        effect: string
    }
    attack?: {
        type: 'melee' | 'ranged'
        bonus: number
    }
    classes: E_Class[]
    source?: string
}

// ============================================================================
// ITEMS & EQUIPMENT
// ============================================================================

export type E_ItemRarity =
    | 'common'
    | 'uncommon'
    | 'rare'
    | 'very_rare'
    | 'legendary'
    | 'artifact'

export type E_ItemType =
    | 'weapon'
    | 'armor'
    | 'wondrous_item'
    | 'potion'
    | 'scroll'
    | 'ring'
    | 'rod'
    | 'staff'
    | 'wand'
    | 'adventuring_gear'

export interface I_Weapon {
    id: string
    name: string
    type: 'weapon'
    rarity: E_ItemRarity
    damageExpression: string
    damageType: string
    properties: string[]
    weight: number
    cost: {
        gp: number
        sp?: number
        cp?: number
    }
    magical: boolean
    enchantmentBonus?: number
    description?: string
}

export interface I_Armor {
    id: string
    name: string
    type: 'armor'
    rarity: E_ItemRarity
    armorClass: number | string // e.g., "10 + DEX"
    stealthDisadvantage: boolean
    weight: number
    cost: {
        gp: number
        sp?: number
        cp?: number
    }
    magical: boolean
    enchantmentBonus?: number
    description?: string
}

export interface I_MagicalItem {
    id: string
    name: string
    type: E_ItemType
    rarity: E_ItemRarity
    attunable: boolean
    attunementRequirements?: string
    weight?: number
    cost?: {
        gp: number
        sp?: number
        cp?: number
    }
    effect: string
    mechanics?: {
        [key: string]: any
    }
    description?: string
    source?: string
}

export type I_Item = I_Weapon | I_Armor | I_MagicalItem

// ============================================================================
// CHARACTER CREATION
// ============================================================================

export interface I_CharacterStats {
    proficiencyBonus: number
    hitPoints: number
    armorClass: number
    speed: number
    initiative: number
}

export interface I_CharacterCombat {
    hitPoints: {
        current: number
        maximum: number
        temporary: number
    }
    armor: I_Armor | null
    weapon: I_Weapon | null
    offhandWeapon?: I_Weapon
    shield?: I_Armor
    spellSaveDC?: number
    spellAttackBonus?: number
}

export interface I_CharacterKnowledge {
    ideals: string[]
    bonds: string[]
    flaws: string[]
    traits: string[]
    alignment: string
}

export interface I_CharacterProficiency {
    skills: Partial<
        Record<
            string,
            {
                proficient: boolean
                expertise: boolean
                modifier: number
            }
        >
    >
    savingThrows: Partial<
        Record<
            E_Ability,
            {
                proficient: boolean
                modifier: number
            }
        >
    >
    languages: string[]
    tools: string[]
    weaponTypes: string[]
    armorTypes: string[]
}

export interface I_DND5E_Character {
    ruleset: 'dnd_5e_24'
    race: E_Race
    class: E_Class
    subclass?: string
    background: string
    level: number
    experience: number
    abilityScores: I_AbilityScores
    stats: I_CharacterStats
    combat: I_CharacterCombat
    proficiencies: I_CharacterProficiency
    knowledge: I_CharacterKnowledge
    spells?: {
        spellId: string
        prepared: boolean
    }[]
    features: {
        featureName: string
        featureSource: string
        description: string
    }[]
    equipment: {
        itemId: string
        quantity: number
        equipped: boolean
    }[]
    currency: {
        platinum: number
        gold: number
        electrum: number
        silver: number
        copper: number
    }
}

// ============================================================================
// NPC/MONSTER
// ============================================================================

export interface I_DND5E_NPC {
    ruleset: 'dnd_5e_24'
    race: E_Race
    class: E_Class
    level: number
    abilityScores: I_AbilityScores
    hitPoints: number
    armorClass: number
    speed: number
    skills?: Partial<Record<string, number>>
    savingThrows?: Partial<Record<E_Ability, number>>
    damageResistances?: string[]
    damageImmunities?: string[]
    conditionImmunities?: string[]
    senses?: string[]
    languages?: string[]
    challenge?: number
    actions?: {
        name: string
        description: string
    }[]
    reactions?: {
        name: string
        description: string
    }[]
    legendaryActions?: {
        name: string
        description: string
        costType?: 'action' | 'movement'
    }[]
}

// ============================================================================
// UTILITIES
// ============================================================================

export function calculateModifier(abilityScore: number): number {
    return Math.floor((abilityScore - 10) / 2)
}

export function calculateProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1
}

export function calculateHitPointsPerLevel(
    hitDie: HitDie,
    constitutionModifier: number
): number {
    const dieMap: Record<HitDie, number> = {
        d6: 6,
        d8: 8,
        d10: 10,
        d12: 12,
    }
    return dieMap[hitDie] + constitutionModifier
}

export interface I_DND5E_RulesetConfig {
    version: '2024'
    races: I_Race[]
    classes: I_Class[]
    backgrounds: I_Background[]
    spells: I_Spell[]
    equipment: I_Item[]
}
