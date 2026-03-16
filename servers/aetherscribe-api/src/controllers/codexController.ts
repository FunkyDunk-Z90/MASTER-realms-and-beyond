import { Request, Response } from 'express'
import {
    Codex,
    AetherscribeProfile,
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
import { AppError } from '@rnb/errors'
import { catchAsync } from '@rnb/middleware'
import { Z_CreateCodexRequest, Z_UpdateCodexRequest } from '@rnb/validators'

// All content models — used for cascade delete when a codex is destroyed.
const ALL_CONTENT_MODELS = [
    World, Campaign, PlayerCharacter, Npc, BestiaryEntry,
    Ancestry, Lore, Item, Arcana, Location, Nation, Faction,
]

// ─── List Codices ─────────────────────────────────────────────────────────────
// GET /api/v1/codex

export const listCodex = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) throw new AppError('Aetherscribe account not found.', 404)

        const codices = await Codex.find({ accountId: profile._id }).sort({ createdAt: 1 })
        const maxCodices = profile.subscription?.limits?.maxCodices ?? null
        res.status(200).json({
            codices: codices.map((c) => c.toClient()),
            limits: { maxCodices },
        })
    }
)

// ─── Get Codex ────────────────────────────────────────────────────────────────
// GET /api/v1/codex/:codexId

export const getCodex = catchAsync(
    async (req: Request<{ codexId: string }>, res: Response): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) throw new AppError('Aetherscribe account not found.', 404)

        const codex = await Codex.findOne({
            _id: req.params.codexId,
            accountId: profile._id,
        })
        if (!codex) throw new AppError('Codex not found.', 404)

        res.status(200).json({ codex: codex.toClient() })
    }
)

// ─── Create Codex ─────────────────────────────────────────────────────────────
// POST /api/v1/codex

export const createCodex = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) throw new AppError('Aetherscribe account not found.', 404)

        const parsed = Z_CreateCodexRequest.safeParse(req.body)
        if (!parsed.success) {
            const issue = parsed.error.issues[0]
            throw new AppError(issue.message, 400, issue.path[0] as string)
        }

        // ── Subscription limit check ──────────────────────────────────────────
        const maxCodices = profile.subscription?.limits?.maxCodices
        if (maxCodices !== undefined && maxCodices !== null) {
            const codexCount = await Codex.countDocuments({ accountId: profile._id })
            if (codexCount >= maxCodices) {
                const planName = profile.subscription.plan.charAt(0).toUpperCase() + profile.subscription.plan.slice(1)
                throw new AppError(
                    `You've reached the limit of ${maxCodices} ${maxCodices === 1 ? 'codex' : 'codices'} on the ${planName} plan. Upgrade your plan to create more.`,
                    403
                )
            }
        }

        const codex = await Codex.create({
            accountId: profile._id,
            name: parsed.data.name,
            description: parsed.data.description,
            coverImageUrl: parsed.data.coverImageUrl,
            isDefault: false,
        })

        res.status(201).json({ codex: codex.toClient() })
    }
)

// ─── Update Codex ─────────────────────────────────────────────────────────────
// PATCH /api/v1/codex/:codexId

export const updateCodex = catchAsync(
    async (
        req: Request<{ codexId: string }>,
        res: Response
    ): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) throw new AppError('Aetherscribe account not found.', 404)

        const codex = await Codex.findOne({
            _id: req.params.codexId,
            accountId: profile._id,
        })
        if (!codex) throw new AppError('Codex not found.', 404)

        const parsed = Z_UpdateCodexRequest.safeParse(req.body)
        if (!parsed.success) {
            const issue = parsed.error.issues[0]
            throw new AppError(issue.message, 400, issue.path[0] as string)
        }

        if (parsed.data.name !== undefined) codex.name = parsed.data.name
        if (parsed.data.description !== undefined)
            codex.description = parsed.data.description
        if (parsed.data.coverImageUrl !== undefined)
            codex.coverImageUrl = parsed.data.coverImageUrl

        await codex.save()
        res.status(200).json({ codex: codex.toClient() })
    }
)

// ─── Delete Codex ─────────────────────────────────────────────────────────────
// DELETE /api/v1/codex/:codexId
// A user must always have at least one codex — deletion is blocked if only one remains.

export const deleteCodex = catchAsync(
    async (
        req: Request<{ codexId: string }>,
        res: Response
    ): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) throw new AppError('Aetherscribe account not found.', 404)

        const codexCount = await Codex.countDocuments({ accountId: profile._id })
        if (codexCount <= 1) {
            throw new AppError(
                'You must have at least one Codex. Create a new Codex before deleting this one.',
                400
            )
        }

        const codex = await Codex.findOneAndDelete({
            _id: req.params.codexId,
            accountId: profile._id,
        })
        if (!codex) throw new AppError('Codex not found.', 404)

        // Cascade: delete every content document that belongs to this codex
        await Promise.all(
            ALL_CONTENT_MODELS.map((Model) =>
                (Model as any).deleteMany({ codexId: codex._id })
            )
        )

        // If we deleted the default, promote the oldest remaining codex
        if (codex.isDefault) {
            await Codex.findOneAndUpdate(
                { accountId: profile._id },
                { isDefault: true },
                { sort: { createdAt: 1 } }
            )
        }

        res.status(200).json({ message: 'Codex deleted.' })
    }
)

// ─── Set Default Codex ────────────────────────────────────────────────────────
// PATCH /api/v1/codex/:codexId/set-default

export const setDefaultCodex = catchAsync(
    async (
        req: Request<{ codexId: string }>,
        res: Response
    ): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) throw new AppError('Aetherscribe account not found.', 404)

        const codex = await Codex.findOne({
            _id: req.params.codexId,
            accountId: profile._id,
        })
        if (!codex) throw new AppError('Codex not found.', 404)

        // Unset previous default
        await Codex.updateMany(
            { accountId: profile._id, isDefault: true },
            { isDefault: false }
        )

        codex.isDefault = true
        await codex.save()

        res.status(200).json({ codex: codex.toClient() })
    }
)
