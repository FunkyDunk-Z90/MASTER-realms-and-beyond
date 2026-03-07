import { Router } from 'express'
import { sendMail } from '../controllers/resendController'

const router = Router()

router.get('/send', sendMail)

export default router
