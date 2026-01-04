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
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: 'https://fyp-blog-platform-4xepl02u7.vercel.app', // your Vercel frontend URL
  credentials: true // needed if sending cookies or auth headers
}));
// Increase body size limit to handle base64 images (50MB limit)
app.use(express.json({ limit: '50mb' })) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })) // Parse URL-encoded bodies

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abdulwahabmnr_db_user:wahab796@cluster0.tn5i0fp.mongodb.net/fyp_blog_platform?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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



