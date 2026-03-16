import { Router } from 'express'
import {
    World,
    Campaign,
    PlayerCharacter,
    Npc,
    BestiaryEntry,
    Ancestry,
    Lore,
    Item,
    Arcana,
    Location,
    Nation,
    Faction,
} from '@rnb/database'
import {
    Z_CreateWorldRequest,
    Z_UpdateWorldRequest,
    Z_CreateCampaignRequest,
    Z_UpdateCampaignRequest,
    Z_CreatePlayerCharacterRequest,
    Z_UpdatePlayerCharacterRequest,
    Z_CreateNpcRequest,
    Z_UpdateNpcRequest,
    Z_CreateBestiaryEntryRequest,
    Z_UpdateBestiaryEntryRequest,
    Z_CreateAncestryRequest,
    Z_UpdateAncestryRequest,
    Z_CreateLoreRequest,
    Z_UpdateLoreRequest,
    Z_CreateItemRequest,
    Z_UpdateItemRequest,
    Z_CreateArcanaRequest,
    Z_UpdateArcanaRequest,
    Z_CreateLocationRequest,
    Z_UpdateLocationRequest,
    Z_CreateNationRequest,
    Z_UpdateNationRequest,
    Z_CreateFactionRequest,
    Z_UpdateFactionRequest,
} from '@rnb/validators'
import { createContentControllers } from '../controllers/contentController'

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildRouter(controllers: ReturnType<typeof createContentControllers>) {
    const router = Router()
    router.get('/', controllers.list)
    router.post('/', controllers.create)
    router.delete('/bulk', controllers.bulkRemove)
    router.get('/:id', controllers.getOne)
    router.patch('/:id', controllers.update)
    router.delete('/:id', controllers.remove)
    return router
}

// ─── Content Routers ──────────────────────────────────────────────────────────

export const worldRouter = buildRouter(
    createContentControllers(World, Z_CreateWorldRequest, Z_UpdateWorldRequest, 'worlds')
)

export const campaignRouter = buildRouter(
    createContentControllers(Campaign, Z_CreateCampaignRequest, Z_UpdateCampaignRequest, 'campaigns')
)

export const characterRouter = buildRouter(
    createContentControllers(PlayerCharacter, Z_CreatePlayerCharacterRequest, Z_UpdatePlayerCharacterRequest, 'characters')
)

export const npcRouter = buildRouter(
    createContentControllers(Npc, Z_CreateNpcRequest, Z_UpdateNpcRequest, 'npcs')
)

export const bestiaryRouter = buildRouter(
    createContentControllers(BestiaryEntry, Z_CreateBestiaryEntryRequest, Z_UpdateBestiaryEntryRequest, 'bestiary')
)

export const ancestryRouter = buildRouter(
    createContentControllers(Ancestry, Z_CreateAncestryRequest, Z_UpdateAncestryRequest, 'ancestries')
)

export const loreRouter = buildRouter(
    createContentControllers(Lore, Z_CreateLoreRequest, Z_UpdateLoreRequest, 'lore')
)

export const itemRouter = buildRouter(
    createContentControllers(Item, Z_CreateItemRequest, Z_UpdateItemRequest, 'items')
)

export const arcanaRouter = buildRouter(
    createContentControllers(Arcana, Z_CreateArcanaRequest, Z_UpdateArcanaRequest, 'arcana')
)

export const locationRouter = buildRouter(
    createContentControllers(Location, Z_CreateLocationRequest, Z_UpdateLocationRequest, 'locations')
)

export const nationRouter = buildRouter(
    createContentControllers(Nation, Z_CreateNationRequest, Z_UpdateNationRequest, 'nations')
)

export const factionRouter = buildRouter(
    createContentControllers(Faction, Z_CreateFactionRequest, Z_UpdateFactionRequest, 'factions')
)
