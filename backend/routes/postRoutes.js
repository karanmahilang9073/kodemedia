import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { addComment, createPost, deletePost, getPosts, likePost } from '../controllers/postController.js'

const router = express.Router()

router.post('/',protect, createPost)
router.get('/',getPosts)
router.put('/:postId/like',protect,likePost)
router.post('/:postId/comment',protect,addComment)
router.delete('/:postId',protect,deletePost)

export default router