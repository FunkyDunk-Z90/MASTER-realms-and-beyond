import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import { validate } from '../middleware/validate'
import { RegisterBodySchema, type RegisterBody } from '../schemas/auth'
import { Identity, App, AuthCode } from '@rnb/database'
import { formatEmail } from '@rnb/security'
import { Z_SetPassword } from '@rnb/validators'
import { env } from '../config/validateEnv'
import { buildIdentityDefaults } from '../utils/buildIdentityDefaults'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// GET /register
// Validate client, store auth intent, redirect to rnb-auth register UI.
// Same PKCE params as GET /authorize.
// ─────────────────────────────────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const {
        client_id,
        redirect_uri,
        state,
        code_challenge,
        code_challenge_method,
        scope,
    } = req.query as Record<string, string>

    if (!client_id || !redirect_uri || !state || !code_challenge || code_challenge_method !== 'S256') {
        res.status(400).send('Missing or invalid required parameters.')
        return
    }

    const client = await App.findOne({ clientId: client_id, active: true })
    if (!client) {
        res.status(400).send('Unknown client_id.')
        return
    }

    if (!client.redirectUris.includes(redirect_uri)) {
        res.status(400).send('redirect_uri not registered for this client.')
        return
    }

    const requestedScopes = (scope ?? 'profile email').split(' ')
    const allowedScopes = requestedScopes.filter((s) => client.allowedScopes.includes(s))

    req.session.authIntent = {
        client_id,
        redirect_uri,
        state,
        code_challenge,
        scopes: allowedScopes,
    }

    await new Promise<void>((resolve, reject) =>
        req.session.save((err) => (err ? reject(err) : resolve()))
    )

    const registerUrl = new URL(`${env.AUTH_UI_URL}/register`)
    registerUrl.searchParams.set('app_name', client.name)
    registerUrl.searchParams.set('client_id', client_id)
    res.redirect(registerUrl.toString())
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /register
// Create new Identity, establish SSO session, issue auth code.
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/',
    validate(RegisterBodySchema, 'body'),
    async (req: Request, res: Response): Promise<void> => {
        const body = res.locals.validated.body as RegisterBody
        const intent = req.session.authIntent

        if (!intent) {
            res.redirect(`${env.AUTH_UI_URL}/register?error=session_expired`)
            return
        }

        const buildErrorUrl = (error: string) => {
            const url = new URL(`${env.AUTH_UI_URL}/register`)
            url.searchParams.set('client_id', intent.client_id)
            url.searchParams.set('error', error)
            return url.toString()
        }

        const passwordCheck = Z_SetPassword.safeParse({ plaintext: body.password })
        if (!passwordCheck.success) {
            res.redirect(buildErrorUrl('password_weak'))
            return
        }

        const normalizedEmail = formatEmail(body.email)
        const existing = await Identity.findByEmail(normalizedEmail)
        if (existing) {
            res.redirect(buildErrorUrl('email_taken'))
            return
        }

        const identity = new Identity(
            buildIdentityDefaults({
                profile: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: normalizedEmail,
                },
                req,
            })
        )

        await identity.setPassword({ plaintext: body.password })
        await identity.save()

        const code = crypto.randomBytes(32).toString('hex')
        await AuthCode.create({
            code,
            userId: identity._id,
            clientId: intent.client_id,
            redirectUri: intent.redirect_uri,
            codeChallenge: intent.code_challenge,
            codeChallengeMethod: 'S256',
            scopes: intent.scopes,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        })

        req.session.userId = identity._id.toString()
        delete req.session.authIntent

        await new Promise<void>((resolve, reject) =>
            req.session.save((err) => (err ? reject(err) : resolve()))
        )

        const callbackUrl = new URL(intent.redirect_uri)
        callbackUrl.searchParams.set('code', code)
        callbackUrl.searchParams.set('state', intent.state)
        res.redirect(callbackUrl.toString())
    }
)

export default router
