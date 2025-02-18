require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const rateLimit = require('express-rate-limit')

const app = express()

// Middleware
app.use(cors({
  origin: ['https://frontend-qh2u8njca-akhil-vinod-ns-projects.vercel.app'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}))
app.options('*', cors())
app.use(express.json())

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api', authRoutes)
app.use('/api/send-otp', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  skip: (req) => req.method === 'OPTIONS' // Skip OPTIONS requests
}))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) 