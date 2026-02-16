import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { addComment, createPost, deletePost, getPosts, likePost, updatePost } from '../controllers/postController.js'

const router = express.Router()

router.post('/',verifyToken, createPost)
router.get('/',getPosts)
router.put('/:postId/like',verifyToken,likePost)
router.post('/:postId/comment',verifyToken,addComment)
router.put('/:postId',verifyToken,updatePost)
router.delete('/:postId',verifyToken,deletePost)

export default router