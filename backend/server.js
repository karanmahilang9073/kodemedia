import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js'
import router from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import aiRouter from './routes/aiRoutes.js'
import cors from 'cors'

const app = express()

// 1. PLACE CORS AT THE TOP
app.use(cors({
    origin: 'http://localhost:5173', // Fixed: added //
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}))

app.use(express.json())

const PORT = process.env.PORT || 5000 // Added a fallback port

// 2. CONNECT DB
connectDB()

// 3. ROUTES
app.get('/', (req, res) => {
    res.send("backend running properly")
})

app.use('/api/auth', router)
app.use('/api/posts', postRoutes)
app.use('/api/ai', aiRouter)

app.listen(PORT, () => {
    console.log(`backend is running on port ${PORT}`)
})