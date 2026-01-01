/**
 * Blog Model
 * 
 * MongoDB schema for blog posts
 * Includes references to author (User)
 */

import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Blog description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'General',
      'Technology',
      'Lifestyle',
      'Travel',
      'Food',
      'Health',
      'Education',
      'Business',
      'Entertainment',
      'Tutorial',
      'Sports'
    ],
    default: 'General'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null // Optional - stores base64 image data or URL
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Index for faster queries
blogSchema.index({ title: 'text', description: 'text', category: 'text' })
blogSchema.index({ author: 1 })
blogSchema.index({ category: 1 })
blogSchema.index({ createdAt: -1 })

const Blog = mongoose.model('Blog', blogSchema)

export default Blog



