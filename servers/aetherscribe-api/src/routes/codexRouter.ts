import { Router } from 'express'
import {
    listCodex,
    getCodex,
    createCodex,
    updateCodex,
    deleteCodex,
    setDefaultCodex,
} from '../controllers/codexController'

const router = Router()

router.get('/', listCodex)
router.post('/', createCodex)
router.get('/:codexId', getCodex)
router.patch('/:codexId', updateCodex)
router.delete('/:codexId', deleteCodex)
router.patch('/:codexId/set-default', setDefaultCodex)

export default router
