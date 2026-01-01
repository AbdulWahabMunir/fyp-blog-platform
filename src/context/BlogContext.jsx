/**
 * Blog Context
 * 
 * This context provides blog state and CRUD operations throughout the application.
 * It manages all blog-related data and operations using the backend API.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { blogAPI } from '../utils/api'

// Create the context
const BlogContext = createContext()

/**
 * BlogProvider Component
 * 
 * Provides blog context to all child components.
 * Manages blog state and provides CRUD operations.
 */
export const BlogProvider = ({ children }) => {
  // State for all blogs
  const [blogs, setBlogs] = useState([])
  // State for filtered/searched blogs
  const [filteredBlogs, setFilteredBlogs] = useState([])
  // State for categories
  const [categories, setCategories] = useState([])
  // State for current search term
  const [searchTerm, setSearchTerm] = useState('')
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState('All')
  // Loading state
  const [loading, setLoading] = useState(true)
  // Error state
  const [error, setError] = useState(null)

  /**
   * Load all blogs from API (for getting all categories)
   */
  const loadAllBlogsForCategories = async () => {
    try {
      // Load ALL blogs without filters to get all categories
      const response = await blogAPI.getAll({})
      
      if (response.success) {
        const transformedBlogs = response.data.map(blog => ({
          id: blog._id,
          title: blog.title,
          description: blog.description,
          category: blog.category,
          author: blog.authorName || (blog.author?.username || 'Unknown'),
          authorId: typeof blog.author === 'object' ? blog.author._id : blog.author,
          date: blog.createdAt,
          createdAt: blog.createdAt,
          image: blog.image || null
        }))
        
        // Update categories from ALL blogs (not filtered)
        setCategories(extractCategories(transformedBlogs))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  /**
   * Load all blogs from API
   */
  const loadBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory
      
      const response = await blogAPI.getAll(params)
      
      if (response.success) {
        // Transform API response to match frontend format
        const transformedBlogs = response.data.map(blog => ({
          id: blog._id,
          title: blog.title,
          description: blog.description,
          category: blog.category,
          author: blog.authorName || (blog.author?.username || 'Unknown'),
          authorId: typeof blog.author === 'object' ? blog.author._id : blog.author,
          date: blog.createdAt,
          createdAt: blog.createdAt,
          image: blog.image || null
        }))
        
        setBlogs(transformedBlogs)
      } else {
        setError(response.message || 'Failed to load blogs')
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
      setError(error.response?.data?.message || error.message || 'Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Extract unique categories from blogs array
   * This ensures categories are always up to date with existing blogs
   */
  const extractCategories = (blogsArray) => {
    const uniqueCategories = [...new Set(blogsArray.map(blog => blog.category))].filter(Boolean)
    return uniqueCategories.sort()
  }

  /**
   * Initialize blogs and categories on component mount
   */
  useEffect(() => {
    loadBlogs()
    loadAllBlogsForCategories() // Load all categories separately
  }, [])

  /**
   * Reload blogs when search term or category changes
   */
  useEffect(() => {
    loadBlogs()
  }, [searchTerm, selectedCategory])

  /**
   * Filter blogs client-side for immediate UI updates
   * (API already filters, but this helps with instant feedback)
   */
  useEffect(() => {
    let result = blogs

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.description.toLowerCase().includes(term) ||
        blog.category.toLowerCase().includes(term)
      )
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(blog => blog.category === selectedCategory)
    }

    // Sort by date (newest first)
    result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))

    setFilteredBlogs(result)
  }, [blogs, searchTerm, selectedCategory])

  /**
   * Create a new blog
   * @param {Object} blogData - Blog data (title, description, category)
   * @returns {Promise<Object>} - Result object with success status and message/blog data
   */
  const createBlog = async (blogData) => {
    try {
      const response = await blogAPI.create(blogData)
      
      if (response.success) {
        // Reload blogs and categories
        await loadBlogs()
        await loadAllBlogsForCategories()
        return { 
          success: true, 
          message: response.message,
          blog: {
            id: response.data._id,
            ...response.data
          }
        }
      } else {
        return { success: false, message: response.message || 'Failed to create blog' }
      }
    } catch (error) {
      console.error('Error in createBlog:', error)
      // More detailed error handling
      let errorMessage = 'Failed to create blog'
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection and try again.'
      } else {
        // Error setting up the request
        errorMessage = error.message || errorMessage
      }
      
      return { success: false, message: errorMessage }
    }
  }

  /**
   * Update an existing blog
   * @param {string} blogId - Blog ID to update
   * @param {Object} updates - Fields to update
   * @param {string} userId - ID of user trying to update
   * @returns {Promise<Object>} - Result object with success status and message
   */
  const updateBlog = async (blogId, updates, userId) => {
    try {
      const response = await blogAPI.update(blogId, updates)
      
      if (response.success) {
        // Reload blogs and categories
        await loadBlogs()
        await loadAllBlogsForCategories()
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Failed to update blog' }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update blog'
      return { success: false, message: errorMessage }
    }
  }

  /**
   * Delete a blog
   * @param {string} blogId - Blog ID to delete
   * @param {string} userId - ID of user trying to delete
   * @param {string} userRole - Role of user trying to delete
   * @returns {Promise<Object>} - Result object with success status and message
   */
  const deleteBlog = async (blogId, userId, userRole) => {
    try {
      const response = await blogAPI.delete(blogId)
      
      if (response.success) {
        // Reload blogs and categories
        await loadBlogs()
        await loadAllBlogsForCategories()
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Failed to delete blog' }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete blog'
      return { success: false, message: errorMessage }
    }
  }

  /**
   * Set search term
   * @param {string} term - Search term
   */
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  /**
   * Set selected category filter
   * @param {string} category - Category name or 'All'
   */
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
  }

  // Value object to provide to consumers
  const value = {
    blogs,                    // All blogs
    filteredBlogs,            // Filtered/searched blogs
    categories,               // Available categories
    searchTerm,               // Current search term
    selectedCategory,         // Currently selected category
    loading,                  // Loading state
    error,                    // Error state
    createBlog,               // Create blog function
    updateBlog,               // Update blog function
    deleteBlog,               // Delete blog function
    handleSearch,             // Set search term function
    handleCategoryFilter,     // Set category filter function
    refreshBlogs: loadBlogs   // Refresh blogs from API
  }

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  )
}

/**
 * Custom hook to use blog context
 * @returns {Object} - Blog context value
 */
export const useBlog = () => {
  const context = useContext(BlogContext)
  
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider')
  }
  
  return context
}