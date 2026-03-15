import { Request, Response } from 'express'
import { Identity, AetherscribeProfile } from '@rnb/database'
import { AppError } from '@rnb/errors'
import { catchAsync } from '@rnb/middleware'
import { Z_CreateAetherscribeAccount, SUBSCRIPTION_LIMITS } from '@rnb/validators'

// ─── Shared response types ────────────────────────────────────────────────────

interface I_AccountResponse {
    account: Record<string, unknown>
    user: Record<string, unknown>
}

interface I_MessageResponse {
    message: string
}

// ─── Create Account ───────────────────────────────────────────────────────────
// POST /api/v1/account
// Protected — requires a valid R&B auth cookie.
// Creates an AetherscribeProfile and links it into the identity's services array.

export const createAccount = catchAsync(
    async (
        req: Request<{}, I_AccountResponse, { username: string; plan: string }>,
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
        })
        if (!parsed.success) {
            const issue = parsed.error.issues[0]
            throw new AppError(issue.message, 400, issue.path[0] as string)
        }

        const { username, plan } = parsed.data

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

        // Run the username validation rules
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

        if (req.body.plan) {
            const planParsed = Z_CreateAetherscribeAccount.shape.plan.safeParse(
                req.body.plan
            )
            if (!planParsed.success) {
                throw new AppError(planParsed.error.issues[0].message, 400, 'plan')
            }
            profile.subscription.plan = planParsed.data
            profile.subscription.limits = SUBSCRIPTION_LIMITS[planParsed.data]
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

        await AetherscribeProfile.findOneAndUpdate(
            { identityId: identity._id },
            { status: 'banned' }
        )

        // Remove the linked service from identity
        identity.services = identity.services.filter(
            (s) => s.serviceName !== 'aetherscribe'
        ) as typeof identity.services
        await identity.save({ validateModifiedOnly: true })

        res.status(200).json({ message: 'Aetherscribe account deleted.' })
    }
)
