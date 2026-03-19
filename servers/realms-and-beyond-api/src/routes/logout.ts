import { Router, type Request, type Response } from 'express'
import { validate } from '../middleware/validate'
import { LogoutBodySchema, type LogoutBody } from '../schemas/auth'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// POST /logout
// Destroys the global R&B SSO session.
//
// Member apps should destroy their own app-level sessions separately.
// For full logout: call this endpoint AND destroy the member app session.
// For silent re-auth (SSO still active): destroy only the member app session.
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/',
    validate(LogoutBodySchema, 'body'),
    (req: Request, res: Response): void => {
        const body = res.locals.validated.body as LogoutBody
        req.session.destroy(() => {
            if (body.post_logout_redirect_uri) {
                res.redirect(body.post_logout_redirect_uri)
            } else {
                res.json({ ok: true })
            }
        })
    }
)

export default router
