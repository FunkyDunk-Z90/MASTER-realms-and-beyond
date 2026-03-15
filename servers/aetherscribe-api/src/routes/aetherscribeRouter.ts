import { Router } from 'express'
import { authenticate } from '@rnb/middleware'
import {
    createAccount,
    getMyAccount,
    updateMyAccount,
    deleteMyAccount,
    checkUsername,
} from '../controllers/aetherscribeController'

const router = Router()

// ─── Public ───────────────────────────────────────────────────────────────────

router.get('/check-username/:username', checkUsername)

// ─── Protected ────────────────────────────────────────────────────────────────

router.use(authenticate)

router.post('/', createAccount)
router.get('/me', getMyAccount)
router.patch('/me', updateMyAccount)
router.delete('/me', deleteMyAccount)

export default router
