import { Request, Response } from 'express'
import { Identity, AetherscribeProfile, Codex } from '@rnb/database'
import { AppError } from '@rnb/errors'
import { catchAsync } from '@rnb/middleware'
import {
    Z_CreateAetherscribeAccount,
    Z_UpdateAetherscribeAccount,
    SUBSCRIPTION_LIMITS,
} from '@rnb/validators'

// ─── Shared response types ────────────────────────────────────────────────────

interface I_AccountResponse {
    account: Record<string, unknown>
    codex: Record<string, unknown>
    user: Record<string, unknown>
}

interface I_MessageResponse {
    message: string
}

// ─── Create Account ───────────────────────────────────────────────────────────
// POST /api/v1/account
// Protected — requires a valid R&B auth cookie.
// Creates an AetherscribeProfile, a default Codex, and links to identity.services.

export const createAccount = catchAsync(
    async (
        req: Request<{}, I_AccountResponse, { username: string; plan: string; firstCodexName?: string }>,
        res: Response<I_AccountResponse>
    ): Promise<void> => {
        const identity = req.identity!

        // ── Already has an account ────────────────────────────────────────────
        const existing = await AetherscribeProfile.findOne({
            identityId: identity._id,
        })
        if (existing) {
            throw new AppError('You already have an Aetherscribe account.', 409)
        }

        // ── Validate input ────────────────────────────────────────────────────
        const parsed = Z_CreateAetherscribeAccount.safeParse({
            username: req.body.username,
            plan: req.body.plan,
            firstCodexName: req.body.firstCodexName,
        })
        if (!parsed.success) {
            const issue = parsed.error.issues[0]
            throw new AppError(issue.message, 400, issue.path[0] as string)
        }

        const { username, plan, firstCodexName } = parsed.data

        // ── Username uniqueness ───────────────────────────────────────────────
        const taken = await AetherscribeProfile.findOne({
            username: username.toLowerCase(),
        })
        if (taken) {
            throw new AppError('This username is already taken.', 409, 'username')
        }

        // ── Create profile ────────────────────────────────────────────────────
        const profile = await AetherscribeProfile.create({
            identityId: identity._id,
            username: username.toLowerCase(),
            subscription: {
                plan,
                status: 'active',
                startDate: new Date().toISOString(),
                limits: SUBSCRIPTION_LIMITS[plan],
            },
            status: 'active',
        })

        // ── Create default Codex ──────────────────────────────────────────────
        const codexName = firstCodexName ?? `${username}'s Codex`
        const codex = await Codex.create({
            accountId: profile._id,
            name: codexName,
            description: 'My first worldbuilding codex.',
            isDefault: true,
        })

        // ── Link to identity ──────────────────────────────────────────────────
        identity.services.push({
            serviceName: 'aetherscribe',
            serviceId: profile._id,
            linkedAt: new Date().toISOString(),
            scopes: ['read', 'write'],
            status: 'active',
        })
        await identity.save({ validateModifiedOnly: true })

        res.status(201).json({
            account: profile.toClient(),
            codex: codex.toClient(),
            user: identity.toClient(),
        })
    }
)

// ─── Get My Account ───────────────────────────────────────────────────────────
// GET /api/v1/account/me

export const getMyAccount = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) {
            throw new AppError('Aetherscribe account not found.', 404)
        }
        res.status(200).json({ account: profile.toClient() })
    }
)

// ─── Check Username Availability ─────────────────────────────────────────────
// GET /api/v1/account/check-username/:username  (public)

export const checkUsername = catchAsync(
    async (
        req: Request<{ username: string }>,
        res: Response<{ available: boolean; message?: string }>
    ): Promise<void> => {
        const { username } = req.params

        const parsed = Z_CreateAetherscribeAccount.shape.username.safeParse(username)
        if (!parsed.success) {
            res.status(200).json({
                available: false,
                message: parsed.error.issues[0]?.message,
            })
            return
        }

        const taken = await AetherscribeProfile.findOne({
            username: username.toLowerCase(),
        })
        res.status(200).json({ available: !taken })
    }
)

// ─── Update My Account ────────────────────────────────────────────────────────
// PATCH /api/v1/account/me

export const updateMyAccount = catchAsync(
    async (
        req: Request<{}, {}, { plan?: string }>,
        res: Response
    ): Promise<void> => {
        const profile = await AetherscribeProfile.findOne({
            identityId: req.identity!._id,
        })
        if (!profile) {
            throw new AppError('Aetherscribe account not found.', 404)
        }

        const parsed = Z_UpdateAetherscribeAccount.safeParse(req.body)
        if (!parsed.success) {
            const issue = parsed.error.issues[0]
            throw new AppError(issue.message, 400, issue.path[0] as string)
        }

        if (parsed.data.plan) {
            profile.subscription.plan = parsed.data.plan
            profile.subscription.limits = SUBSCRIPTION_LIMITS[parsed.data.plan]
        }

        await profile.save()
        res.status(200).json({ account: profile.toClient() })
    }
)

// ─── Delete My Account ────────────────────────────────────────────────────────
// DELETE /api/v1/account/me

export const deleteMyAccount = catchAsync(
    async (req: Request, res: Response<I_MessageResponse>): Promise<void> => {
        const identity = req.identity!

        const profile = await AetherscribeProfile.findOne({ identityId: identity._id })

        if (profile) {
            await AetherscribeProfile.findOneAndUpdate(
                { identityId: identity._id },
                { status: 'banned' }
            )
        }

        identity.services = identity.services.filter(
            (s) => s.serviceName !== 'aetherscribe'
        ) as typeof identity.services
        await identity.save({ validateModifiedOnly: true })

        res.status(200).json({ message: 'Aetherscribe account deleted.' })
    }
)
