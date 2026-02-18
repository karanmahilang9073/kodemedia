import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js'
import router from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import aiRouter from './routes/aiRoutes.js'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}))

app.use(express.json())

const PORT = process.env.PORT 

// CONNECT DB
connectDB()

// ROUTES
app.get('/', (req, res) => {
    res.send("backend running properly")
})
app.use('/api/auth', router)
app.use('/api/posts', postRoutes)
app.use('/api/ai', aiRouter)

//global error handler
app.use((err, req, res, next) => {
    console.log("error", err)
    res.status(err.statusCode).json({success : false, message : err.message || "internal server error"})
})

app.listen(PORT, () => {
    console.log(`backend is running on port ${PORT}`)
})