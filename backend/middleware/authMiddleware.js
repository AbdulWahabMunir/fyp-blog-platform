/**
 * Authentication Middleware
 * 
 * Middleware to verify JWT tokens and protect routes
 * Checks if user is authenticated and optionally if user is admin
 */

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      })
    }

    // Extract token
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}

/**
 * Check if user is admin
 * Must be used after authenticate middleware
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    })
  }
  next()
}

/**
 * Check if user owns the resource or is admin
 * Used for blog ownership verification
 */
export const isOwnerOrAdmin = (req, res, next) => {
  // This middleware assumes req.blog exists (set by previous middleware)
  if (req.user.role === 'admin' || req.blog.author.toString() === req.user._id.toString()) {
    return next()
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only modify your own blogs.'
  })
}








