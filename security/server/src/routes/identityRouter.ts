import { Router } from 'express'
import { authenticate } from '@security/middleware'
import {
    signup,
    login,
    logout,
    checkAuth,
    getMyAccount,
    updateMyAccount,
    deleteMyAccount,
} from '../controllers/identityController'

const router = Router()

// ─── Public ───────────────────────────────────────────────────────────────────

router.post('/signup', signup)
router.post('/login', login)

// ─── Protected ────────────────────────────────────────────────────────────────
// All routes below require a valid auth_token cookie or Bearer token.
// authenticate attaches req.identity for downstream controllers.

router.use(authenticate)

router.post('/logout', logout)
router.get('/me', getMyAccount)
router.get('/me/check', checkAuth)
router.patch('/me', updateMyAccount)
router.delete('/me', deleteMyAccount)

export default router
