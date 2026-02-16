import express from 'express'
import { loginUser, registerUser, getUserProfile, updateUser, deleteUser } from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile', verifyToken, getUserProfile)
router.put('/update', verifyToken, updateUser)
router.delete('/delete', verifyToken, deleteUser)

export default router;