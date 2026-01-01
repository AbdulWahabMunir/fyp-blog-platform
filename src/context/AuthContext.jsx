/**
 * Authentication Context
 * 
 * This context provides authentication state and functions throughout the application.
 * It manages user login, logout, and registration using the backend API.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, setAuthToken } from '../utils/api'

// Create the context
const AuthContext = createContext()

/**
 * AuthProvider Component
 * 
 * Provides authentication context to all child components.
 * Manages user state and provides login, logout, and register functions.
 */
export const AuthProvider = ({ children }) => {
  // State for current logged-in user
  const [user, setUser] = useState(null)
  // State to track if we're still checking for existing login
  const [loading, setLoading] = useState(true)

  /**
   * Initialize authentication on component mount
   * Check if user is already logged in from localStorage token
   */
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (token && savedUser) {
      try {
        // Set token in axios headers
        setAuthToken(token)
        // Restore user from localStorage
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error restoring user session:', error)
        // Clear invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    
    setLoading(false)
  }, [])

  /**
   * Login function
   * Authenticates user with backend API
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @returns {Promise<Object>} - Result object with success status and message
   */
  const handleLogin = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password })
      
      if (response.success) {
        const { user: userData, token } = response.data
        
        // Set token in axios headers
        setAuthToken(token)
        
        // Save user and token to localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(userData))
        
        // Update state
        setUser(userData)
        
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Login failed' }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      return { success: false, message: errorMessage }
    }
  }

  /**
   * Register function
   * Creates a new user account via backend API
   * @param {string} username - Username
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<Object>} - Result object with success status and message
   */
  const handleRegister = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password })
      
      if (response.success) {
        const { user: userData, token } = response.data
        
        // Set token in axios headers
        setAuthToken(token)
        
        // Save user and token to localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(userData))
        
        // Update state
        setUser(userData)
        
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Registration failed' }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.'
      return { success: false, message: errorMessage }
    }
  }

  /**
   * Logout function
   * Clears the current user from state and localStorage
   */
  const handleLogout = () => {
    // Remove token from axios headers
    setAuthToken(null)
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    
    // Clear state
    setUser(null)
  }

  // Value object to provide to consumers
  const value = {
    user,              // Current user object or null
    loading,           // Loading state
    login: handleLogin,        // Login function
    register: handleRegister,  // Register function
    logout: handleLogout,      // Logout function
    isAuthenticated: !!user,   // Boolean indicating if user is logged in
    isAdmin: user?.role === 'admin'  // Boolean indicating if user is admin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use authentication context
 * @returns {Object} - Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}