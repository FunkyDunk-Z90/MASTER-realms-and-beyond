import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_LocationSubCategory = z.enum([
    'city',        // Large city or metropolis
    'town',        // Medium-sized town
    'village',     // Small village or hamlet
    'dungeon',     // Underground complex, labyrinth, or lair
    'ruin',        // Ruined structure or lost city
    'wilderness',  // Open natural area (forest, swamp, tundra)
    'building',    // Specific building or structure
    'landmark',    // Notable natural or artificial landmark
    'plane',       // Other plane of existence
    'region',      // Large geographic region (e.g., "The Northlands")
    'underwater',  // Underwater location or settlement
    'sky',         // Floating islands, sky cities, aeries
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_PointOfInterest = z.object({
    name: z.string(),
    type: z.string().optional(),
    description: z.string().optional(),
    isSecret: z.boolean().optional(),
})

export const Z_LocationFloor = z.object({
    level: z.number().int(),
    name: z.string().optional(),
    description: z.string().optional(),
    rooms: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        encounters: z.array(z.string()).optional(),
        loot: z.array(z.string()).optional(),
        traps: z.array(z.string()).optional(),
    })).optional(),
})

// ─── Location Document ────────────────────────────────────────────────────────

export const Z_Location = Z_BaseDocument.extend({
    subCategory: Z_LocationSubCategory,
    parentLocationId: Z_ObjectId.optional(),
    nationId: Z_ObjectId.optional(),
    population: z.number().int().nonnegative().optional(),
    populationDescription: z.string().optional(),
    climate: z.string().optional(),
    terrain: z.string().optional(),
    biome: z.string().optional(),
    government: z.string().optional(),
    ruler: z.string().optional(),
    economy: z.string().optional(),
    religions: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    factions: z.array(z.string()).optional(),
    notableFeatures: z.array(z.string()).optional(),
    pointsOfInterest: z.array(Z_PointOfInterest).optional(),
    floors: z.array(Z_LocationFloor).optional(),
    history: z.string().optional(),
    atmosphere: z.string().optional(),
    sights: z.string().optional(),
    sounds: z.string().optional(),
    smells: z.string().optional(),
    dangers: z.string().optional(),
    secrets: z.string().optional(),
    mapImageUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    coordinates: z.object({
        x: z.number().optional(),
        y: z.number().optional(),
        system: z.enum(['cartesian', 'hexagonal', 'custom']).optional(),
    }).optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateLocationRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_LocationSubCategory,
    parentLocationId: Z_ObjectId.optional(),
    nationId: Z_ObjectId.optional(),
    population: z.number().int().nonnegative().optional(),
    populationDescription: z.string().optional(),
    climate: z.string().max(100).optional(),
    terrain: z.string().max(100).optional(),
    biome: z.string().max(100).optional(),
    government: z.string().optional(),
    ruler: z.string().max(150).optional(),
    economy: z.string().optional(),
    religions: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    notableFeatures: z.array(z.string()).optional(),
    pointsOfInterest: z.array(Z_PointOfInterest).optional(),
    floors: z.array(Z_LocationFloor).optional(),
    history: z.string().optional(),
    atmosphere: z.string().optional(),
    dangers: z.string().optional(),
    secrets: z.string().optional(),
    mapImageUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    coordinates: z.object({
        x: z.number().optional(),
        y: z.number().optional(),
        system: z.enum(['cartesian', 'hexagonal', 'custom']).optional(),
    }).optional(),
})

export const Z_UpdateLocationRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_LocationSubCategory.optional(),
    parentLocationId: Z_ObjectId.optional(),
    nationId: Z_ObjectId.optional(),
    population: z.number().int().nonnegative().optional(),
    populationDescription: z.string().optional(),
    climate: z.string().max(100).optional(),
    terrain: z.string().max(100).optional(),
    biome: z.string().max(100).optional(),
    government: z.string().optional(),
    ruler: z.string().max(150).optional(),
    economy: z.string().optional(),
    religions: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    notableFeatures: z.array(z.string()).optional(),
    pointsOfInterest: z.array(Z_PointOfInterest).optional(),
    floors: z.array(Z_LocationFloor).optional(),
    history: z.string().optional(),
    atmosphere: z.string().optional(),
    sights: z.string().optional(),
    sounds: z.string().optional(),
    smells: z.string().optional(),
    dangers: z.string().optional(),
    secrets: z.string().optional(),
    mapImageUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    coordinates: z.object({
        x: z.number().optional(),
        y: z.number().optional(),
        system: z.enum(['cartesian', 'hexagonal', 'custom']).optional(),
    }).optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_LocationSubCategory = z.infer<typeof Z_LocationSubCategory>
export type T_PointOfInterest = z.infer<typeof Z_PointOfInterest>
export type T_Location = z.infer<typeof Z_Location>
export type T_CreateLocationRequest = z.infer<typeof Z_CreateLocationRequest>
export type T_UpdateLocationRequest = z.infer<typeof Z_UpdateLocationRequest>
