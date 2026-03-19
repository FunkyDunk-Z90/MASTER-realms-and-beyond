import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import { validate } from '../middleware/validate'
import {
    AuthorizeQuerySchema,
    LoginBodySchema,
    type AuthorizeQuery,
    type LoginBody,
} from '../schemas/auth'
import { Identity, App, AuthCode } from '@rnb/database'
import { formatEmail } from '@rnb/security'
import { env } from '../config/validateEnv'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// GET /authorize
// Entry point for the OAuth flow.
//   1. Validate client_id, redirect_uri, PKCE params
//   2. Store auth intent (+ PKCE challenge) in SSO session
//   3. SSO fast-path: if user already authenticated globally, issue code immediately
//   4. Otherwise redirect to rnb-auth login UI
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/',
    validate(AuthorizeQuerySchema, 'query'),
    async (req: Request, res: Response): Promise<void> => {
        const query = res.locals.validated.query as AuthorizeQuery

        const client = await App.findOne({ clientId: query.client_id, active: true })
        if (!client) {
            res.status(400).send('Unknown client_id.')
            return
        }

        if (!client.redirectUris.includes(query.redirect_uri)) {
            res.status(400).send('redirect_uri not registered for this client.')
            return
        }

        const requestedScopes = query.scope.split(' ')
        const allowedScopes = requestedScopes.filter((s) => client.allowedScopes.includes(s))

        req.session.authIntent = {
            client_id: query.client_id,
            redirect_uri: query.redirect_uri,
            state: query.state,
            code_challenge: query.code_challenge,
            scopes: allowedScopes,
        }

        // SSO fast-path — user already authenticated globally, skip login UI
        if (req.session.userId) {
            await issueCodeAndRedirect(req, res)
            return
        }

        await new Promise<void>((resolve, reject) =>
            req.session.save((err) => (err ? reject(err) : resolve()))
        )

        const loginUrl = new URL(`${env.AUTH_UI_URL}/login`)
        loginUrl.searchParams.set('app_name', client.name)
        loginUrl.searchParams.set('client_id', query.client_id)
        res.redirect(loginUrl.toString())
    }
)

// ─────────────────────────────────────────────────────────────────────────────
// POST /authorize
// Processes the login form submission from rnb-auth.
//   1. Verify credentials against Identity model
//   2. Establish global R&B SSO session (userId)
//   3. Issue PKCE auth code and redirect to member app callback
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/',
    validate(LoginBodySchema, 'body'),
    async (req: Request, res: Response): Promise<void> => {
        const body = res.locals.validated.body as LoginBody
        const intent = req.session.authIntent

        if (!intent) {
            res.redirect(`${env.AUTH_UI_URL}/login?error=session_expired`)
            return
        }

        const identity = await Identity.findByEmail(formatEmail(body.email))
        const isValid = identity
            ? await identity.verifyPassword({ plaintext: body.password })
            : false

        if (!identity || !isValid) {
            const client = await App.findOne({ clientId: intent.client_id })
            const loginUrl = new URL(`${env.AUTH_UI_URL}/login`)
            loginUrl.searchParams.set('app_name', client?.name ?? '')
            loginUrl.searchParams.set('client_id', intent.client_id)
            loginUrl.searchParams.set('error', 'invalid_credentials')
            res.redirect(loginUrl.toString())
            return
        }

        req.session.userId = identity._id.toString()
        await issueCodeAndRedirect(req, res)
    }
)

// ─── Helper ───────────────────────────────────────────────────────────────────

async function issueCodeAndRedirect(req: Request, res: Response): Promise<void> {
    const intent = req.session.authIntent

    if (!intent || !req.session.userId) {
        res.status(400).send('Session error.')
        return
    }

    const code = crypto.randomBytes(32).toString('hex')

    await AuthCode.create({
        code,
        userId: req.session.userId,
        clientId: intent.client_id,
        redirectUri: intent.redirect_uri,
        codeChallenge: intent.code_challenge,
        codeChallengeMethod: 'S256',
        scopes: intent.scopes,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })

    delete req.session.authIntent
    await new Promise<void>((resolve, reject) =>
        req.session.save((err) => (err ? reject(err) : resolve()))
    )

    const callbackUrl = new URL(intent.redirect_uri)
    callbackUrl.searchParams.set('code', code)
    callbackUrl.searchParams.set('state', intent.state)
    res.redirect(callbackUrl.toString())
}

export default router
