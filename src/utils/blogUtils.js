/**
 * Blog Utility Functions
 * 
 * These functions handle all blog-related operations including
 * creating, reading, updating, and deleting blogs.
 */

import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storage'

/**
 * Initialize sample blogs if no blogs exist
 * This creates some example blogs for demonstration
 */
export const initializeSampleBlogs = () => {
  const blogs = getFromStorage(STORAGE_KEYS.BLOGS)
  
  if (!blogs || blogs.length === 0) {
    const sampleBlogs = [
      {
        id: 1,
        title: 'Welcome to Our Blog Platform',
        description: 'This is a sample blog post to demonstrate the features of our blog platform. You can create, edit, and delete your own blogs!',
        category: 'General',
        author: 'admin',
        authorId: 1,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Getting Started with Blogging',
        description: 'Learn how to create your first blog post and share your thoughts with the world. Blogging is a great way to express yourself and connect with others.',
        category: 'Tutorial',
        author: 'admin',
        authorId: 1,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
    saveToStorage(STORAGE_KEYS.BLOGS, sampleBlogs)
  }
}

/**
 * Get all blogs from storage
 * @returns {Array} - Array of all blogs
 */
export const getAllBlogs = () => {
  return getFromStorage(STORAGE_KEYS.BLOGS) || []
}

/**
 * Get a single blog by ID
 * @param {number} id - Blog ID
 * @returns {Object|null} - Blog object or null if not found
 */
export const getBlogById = (id) => {
  const blogs = getAllBlogs()
  return blogs.find(blog => blog.id === parseInt(id)) || null
}

/**
 * Get blogs by author ID
 * @param {number} authorId - Author's user ID
 * @returns {Array} - Array of blogs by the author
 */
export const getBlogsByAuthor = (authorId) => {
  const blogs = getAllBlogs()
  return blogs.filter(blog => blog.authorId === authorId)
}

/**
 * Create a new blog
 * @param {Object} blogData - Blog data object
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.description - Blog description/content
 * @param {string} blogData.category - Blog category
 * @param {string} blogData.author - Author username
 * @param {number} blogData.authorId - Author's user ID
 * @returns {Object} - Created blog object
 */
export const createBlog = ({ title, description, category, author, authorId }) => {
  const blogs = getAllBlogs()
  
  // Generate new ID
  const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1
  
  const newBlog = {
    id: newId,
    title,
    description,
    category,
    author,
    authorId,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
  
  blogs.push(newBlog)
  saveToStorage(STORAGE_KEYS.BLOGS, blogs)
  
  return newBlog
}

/**
 * Update an existing blog
 * @param {number} blogId - Blog ID to update
 * @param {Object} updates - Fields to update
 * @param {number} userId - ID of user trying to update (for authorization)
 * @returns {Object} - Object with success status and message/blog data
 */
export const updateBlog = (blogId, updates, userId) => {
  const blogs = getAllBlogs()
  const blogIndex = blogs.findIndex(b => b.id === parseInt(blogId))
  
  if (blogIndex === -1) {
    return { success: false, message: 'Blog not found' }
  }
  
  const blog = blogs[blogIndex]
  
  // Check if user owns the blog
  if (blog.authorId !== userId) {
    return { success: false, message: 'You can only edit your own blogs' }
  }
  
  // Update blog fields
  blogs[blogIndex] = {
    ...blog,
    ...updates,
    id: blog.id, // Ensure ID doesn't change
    authorId: blog.authorId, // Ensure authorId doesn't change
    author: blog.author, // Ensure author doesn't change
    createdAt: blog.createdAt, // Keep original creation date
    date: new Date().toISOString() // Update date to current time
  }
  
  saveToStorage(STORAGE_KEYS.BLOGS, blogs)
  
  return { 
    success: true, 
    message: 'Blog updated successfully',
    blog: blogs[blogIndex]
  }
}

/**
 * Delete a blog
 * @param {number} blogId - Blog ID to delete
 * @param {number} userId - ID of user trying to delete
 * @param {string} userRole - Role of user trying to delete ('admin' or 'user')
 * @returns {Object} - Object with success status and message
 */
export const deleteBlog = (blogId, userId, userRole) => {
  const blogs = getAllBlogs()
  const blogIndex = blogs.findIndex(b => b.id === parseInt(blogId))
  
  if (blogIndex === -1) {
    return { success: false, message: 'Blog not found' }
  }
  
  const blog = blogs[blogIndex]
  
  // Admin can delete any blog, users can only delete their own
  if (userRole !== 'admin' && blog.authorId !== userId) {
    return { success: false, message: 'You can only delete your own blogs' }
  }
  
  blogs.splice(blogIndex, 1)
  saveToStorage(STORAGE_KEYS.BLOGS, blogs)
  
  return { success: true, message: 'Blog deleted successfully' }
}

/**
 * Search blogs by title or category
 * @param {string} searchTerm - Search term
 * @returns {Array} - Array of matching blogs
 */
export const searchBlogs = (searchTerm) => {
  const blogs = getAllBlogs()
  const term = searchTerm.toLowerCase().trim()
  
  if (!term) {
    return blogs
  }
  
  return blogs.filter(blog => 
    blog.title.toLowerCase().includes(term) ||
    blog.category.toLowerCase().includes(term) ||
    blog.description.toLowerCase().includes(term)
  )
}

/**
 * Get blogs by category
 * @param {string} category - Category name
 * @returns {Array} - Array of blogs in the category
 */
export const getBlogsByCategory = (category) => {
  const blogs = getAllBlogs()
  
  if (!category || category === 'All') {
    return blogs
  }
  
  return blogs.filter(blog => blog.category === category)
}

/**
 * Get all unique categories from blogs
 * @returns {Array} - Array of unique category names
 */
export const getAllCategories = () => {
  const blogs = getAllBlogs()
  const categories = [...new Set(blogs.map(blog => blog.category))]
  return categories.sort()
}








