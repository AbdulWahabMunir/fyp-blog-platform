/**
 * Authentication Utility Functions
 * 
 * These functions handle user authentication operations including
 * registration, login validation, and password checking.
 */

import { getFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from './storage'

/**
 * Initialize default admin user if no users exist
 * This creates an admin account for testing purposes
 */
export const initializeDefaultUsers = () => {
  const users = getFromStorage(STORAGE_KEYS.USERS)
  
  // If no users exist, create a default admin user
  if (!users || users.length === 0) {
    const defaultUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@blog.com',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ]
    saveToStorage(STORAGE_KEYS.USERS, defaultUsers)
  }
}

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password (plain text - in production, hash this)
 * @returns {Object} - Object with success status and message/user data
 */
export const registerUser = (username, email, password) => {
  const users = getFromStorage(STORAGE_KEYS.USERS) || []
  
  // Check if username already exists
  if (users.find(u => u.username === username)) {
    return { success: false, message: 'Username already exists' }
  }
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already exists' }
  }
  
  // Create new user (default role is 'user')
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    email,
    password, // In production, hash the password before storing
    role: 'user', // Default role is 'user'
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  saveToStorage(STORAGE_KEYS.USERS, users)
  
  return { 
    success: true, 
    message: 'Registration successful',
    user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
  }
}

/**
 * Login a user
 * @param {string} username - Username or email
 * @param {string} password - User's password
 * @returns {Object} - Object with success status and message/user data
 */
export const loginUser = (username, password) => {
  const users = getFromStorage(STORAGE_KEYS.USERS) || []
  
  // Find user by username or email
  const user = users.find(u => 
    (u.username === username || u.email === username) && 
    u.password === password // In production, compare hashed passwords
  )
  
  if (!user) {
    return { success: false, message: 'Invalid username/email or password' }
  }
  
  // Return user data without password
  const { password: _, ...userWithoutPassword } = user
  
  return { 
    success: true, 
    message: 'Login successful',
    user: userWithoutPassword
  }
}

/**
 * Get current logged-in user from storage
 * @returns {Object|null} - Current user or null
 */
export const getCurrentUser = () => {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER)
}

/**
 * Save current user to storage
 * @param {Object} user - User object to save
 */
export const setCurrentUser = (user) => {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user)
}

/**
 * Logout current user (remove from storage)
 */
export const logoutUser = () => {
  removeFromStorage(STORAGE_KEYS.CURRENT_USER)
}
