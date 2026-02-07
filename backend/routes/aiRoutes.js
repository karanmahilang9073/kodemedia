import express from 'express'
import { rewritePost } from '../controllers/aiController.js'

const aiRouter = express.Router()

aiRouter.post('/rewrite',rewritePost)

export default aiRouter;