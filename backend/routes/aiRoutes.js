import express from 'express'
import { rewritePost } from '../controllers/aiController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const aiRouter = express.Router()

aiRouter.post('/rewrite', verifyToken, rewritePost)

export default aiRouter;