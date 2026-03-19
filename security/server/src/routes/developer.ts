import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import { authenticate } from '@security/middleware'
import { Identity } from '@rnb/database'

const router = Router()

// Require authentication for all developer portal routes
router.use(authenticate)

const RegisterAppSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    redirectUris: z.array(z.url()).min(1),
    thirdParty: z.boolean(),
    ownerName: z.string().optional(),
    ownerEmail: z.email().optional(),
    scopes: z.array(z.string()).default(['profile', 'email']),
})

// POST /developer/apps — register a new OAuth app
router.post(
    '/apps',
    async (req: Request, res: Response): Promise<void> => {
        const parsed = RegisterAppSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({ message: 'Invalid request', errors: parsed.error.issues })
            return
        }
        const body = parsed.data

        const prefix = body.thirdParty ? 'ext' : 'rnb'
        const clientId = `${prefix}-${crypto.randomBytes(8).toString('hex')}`
        const clientSecret = body.thirdParty ? null : crypto.randomBytes(32).toString('hex')

        // Store venture entry on the authenticated identity
        const identity = req.identity!
        const venture = {
            ventureName: body.name,
            ventureId: identity._id,
            linkedAt: new Date().toISOString(),
            scopes: body.scopes,
            status: 'active' as const,
            thirdParty: body.thirdParty,
        }
        identity.ventures.push(venture)
        await identity.save({ validateModifiedOnly: true })

        res.status(201).json({
            name: body.name,
            clientId,
            // Return clientSecret ONCE only — not stored in plaintext after this
            clientSecret,
            clientType: body.thirdParty ? 'public' : 'confidential',
            redirectUris: body.redirectUris,
            scopes: body.scopes,
        })
    }
)

// GET /developer/apps — list ventures for the authenticated user
router.get('/apps', async (req: Request, res: Response): Promise<void> => {
    const identity = req.identity!
    res.json({ ventures: identity.ventures ?? [] })
})

export default router
