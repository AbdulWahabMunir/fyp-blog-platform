/**
 * API Utility Functions
 * 
 * Centralized API configuration and helper functions
 * Handles all HTTP requests to the backend server
 */

import axios from 'axios'

// API Base URL - change this to your backend server URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fyp-blog-platform-production.up.railway.app/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Add token to request headers
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    // Also save to localStorage for persistence
    localStorage.setItem('auth_token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('auth_token')
  }
}

// Load token from localStorage on app start
const savedToken = localStorage.getItem('auth_token')
if (savedToken) {
  setAuthToken(savedToken)
}

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - { username, email, password }
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  /**
   * Login user
   * @param {Object} credentials - { username, password }
   * @returns {Promise} - API response with user data and token
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }
}

/**
 * Blog API endpoints
 */
export const blogAPI = {
  /**
   * Get all blogs
   * @param {Object} filters - { search, category }
   * @returns {Promise} - API response with blogs array
   */
  getAll: async (filters = {}) => {
    const response = await api.get('/blogs', { params: filters })
    return response.data
  },

  /**
   * Get single blog by ID
   * @param {string} id - Blog ID
   * @returns {Promise} - API response with blog data
   */
  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`)
    return response.data
  },

  /**
   * Create new blog
   * @param {Object} blogData - { title, description, category }
   * @returns {Promise} - API response with created blog
   */
  create: async (blogData) => {
    const response = await api.post('/blogs', blogData)
    return response.data
  },

  /**
   * Update blog
   * @param {string} id - Blog ID
   * @param {Object} blogData - { title, description, category }
   * @returns {Promise} - API response with updated blog
   */
  update: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData)
    return response.data
  },

  /**
   * Delete blog
   * @param {string} id - Blog ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    const response = await api.delete(`/blogs/${id}`)
    return response.data
  },

  /**
   * Get blogs by user ID
   * @param {string} userId - User ID
   * @returns {Promise} - API response with user's blogs
   */
  getByUser: async (userId) => {
    const response = await api.get(`/blogs/user/${userId}`)
    return response.data
  },

  /**
   * Get all categories
   * @returns {Promise} - API response with categories array
   */
  getCategories: async () => {
    const response = await api.get('/blogs/categories/list')
    return response.data
  }
}

export default api








