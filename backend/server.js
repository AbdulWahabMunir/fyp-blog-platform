/**
 * Backend Server - Blog Website API
 * 
 * Express server with MongoDB Atlas integration
 * Handles authentication and blog CRUD operations
 */

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
// CORS configuration - allows frontend to make requests
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Alternative dev port
  process.env.FRONTEND_URL // Production frontend URL
].filter(Boolean) // Remove undefined values

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins 
    : true, // Allow all in development
  credentials: true
}))
// Increase body size limit to handle base64 images (50MB limit)
app.use(express.json({ limit: '50mb' })) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })) // Parse URL-encoded bodies

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string'

// Validate MONGODB_URI before connecting
if (!MONGODB_URI || MONGODB_URI === 'mongodb+srv://your-connection-string') {
  console.error('❌ MONGODB_URI is not set or is using placeholder value!')
  console.error('Please set MONGODB_URI environment variable in Railway.')
  process.exit(1)
}

if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  console.error('❌ Invalid MONGODB_URI format!')
  console.error('Connection string must start with "mongodb://" or "mongodb+srv://"')
  console.error('Current value (first 20 chars):', MONGODB_URI.substring(0, 20))
  process.exit(1)
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas')
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  })

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API Server is running!',
    endpoints: {
      auth: '/api/auth',
      blogs: '/api/blogs'
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📝 API available at http://localhost:${PORT}`)
})
