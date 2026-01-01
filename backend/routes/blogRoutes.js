/**
 * Blog Routes
 * 
 * Handles all blog CRUD operations
 */

import express from 'express'
import Blog from '../models/Blog.js'
import { authenticate, isAdmin, isOwnerOrAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * Middleware to find blog by ID and attach to request
 */
const findBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      })
    }
    
    req.blog = blog
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding blog',
      error: error.message
    })
  }
}

/**
 * @route   GET /api/blogs
 * @desc    Get all blogs (with optional search and category filter)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query
    let query = {}

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category
    }

    // Get blogs with author information
    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 }) // Newest first

    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    })
  }
})

/**
 * @route   GET /api/blogs/:id
 * @desc    Get single blog by ID
 * @access  Public
 */
router.get('/:id', findBlog, async (req, res) => {
  try {
    await req.blog.populate('author', 'username email')
    
    res.json({
      success: true,
      data: req.blog
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    })
  }
})

/**
 * @route   POST /api/blogs
 * @desc    Create new blog
 * @access  Private (Authenticated users only)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, category, image } = req.body

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category'
      })
    }

    // Validate image size if provided (base64 images can be large)
    if (image && image.length > 10 * 1024 * 1024) { // 10MB base64 limit
      return res.status(400).json({
        success: false,
        message: 'Image is too large. Please use an image smaller than 2MB.'
      })
    }

    // Create blog
    const blog = await Blog.create({
      title,
      description,
      category,
      image: image || null, // Optional image field
      author: req.user._id,
      authorName: req.user.username
    })

    // Populate author info
    await blog.populate('author', 'username email')

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    })
  } catch (error) {
    console.error('Error creating blog:', error)
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      })
    }
    
    // Handle MongoDB document size errors
    if (error.message && error.message.includes('document is too large')) {
      return res.status(400).json({
        success: false,
        message: 'Image is too large. Please use a smaller image (under 2MB).'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
})

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update blog
 * @access  Private (Owner or Admin only)
 */
router.put('/:id', authenticate, findBlog, isOwnerOrAdmin, async (req, res) => {
  try {
    const { title, description, category, image } = req.body

    // Build update object (only include fields that are provided)
    const updateData = { title, description, category }
    if (image !== undefined) {
      updateData.image = image // Allow setting to null to remove image
    }

    // Update blog
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username email')

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    })
  }
})

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog
 * @access  Private (Owner or Admin only)
 */
router.delete('/:id', authenticate, findBlog, isOwnerOrAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    })
  }
})

/**
 * @route   GET /api/blogs/user/:userId
 * @desc    Get all blogs by a specific user
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user blogs',
      error: error.message
    })
  }
})

/**
 * @route   GET /api/blogs/categories/list
 * @desc    Get list of all unique categories
 * @access  Public
 */
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Blog.distinct('category')
    
    res.json({
      success: true,
      data: categories.sort()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    })
  }
})

export default router



