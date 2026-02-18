export enum Gender {
    // Binary
    Male = 'male',
    Female = 'female',

    // Non-binary identities
    NonBinary = 'non_binary',
    Genderqueer = 'genderqueer',
    Genderfluid = 'genderfluid',
    Agender = 'agender',
    Bigender = 'bigender',
    Pangender = 'pangender',
    Demigender = 'demigender',
    Demiboy = 'demiboy',
    Demigirl = 'demigirl',
    Neutrois = 'neutrois',
    Androgyne = 'androgyne',
    Intergender = 'intergender',
    Maverique = 'maverique',
    Trigender = 'trigender',

    // Other
    NotListed = 'not_listed',
    PreferNotToSay = 'prefer_not_to_say',
}

export interface I_GenderOption {
    value: Gender | string
    label: string
    description?: string
}

export interface I_GenderIdentity {
    primary: Gender | string
    additional?: (Gender | string)[]
    pronouns?: I_Pronouns
    selfDescribed?: string
}

// Common pronoun sets
export interface I_Pronouns {
    subject: string // he / she / they / ze / etc.
    object: string // him / her / them / zir / etc.
    possessive: string // his / her / their / zis / etc.
    reflexive: string // himself / herself / themself / zirself / etc.
}
