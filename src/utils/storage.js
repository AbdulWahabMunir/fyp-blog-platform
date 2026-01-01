/**
 * Storage Utility Functions
 * 
 * These functions handle all localStorage operations for the blog application.
 * localStorage is used to persist data (users, blogs) across browser sessions.
 */

/**
 * Get data from localStorage by key
 * @param {string} key - The key to retrieve data from
 * @returns {any} - The parsed data or null if not found
 */
export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error)
    return null
  }
}

/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {any} value - The data to store (will be stringified)
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error)
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error)
  }
}

// Storage keys used throughout the application
export const STORAGE_KEYS = {
  USERS: 'blog_users',
  BLOGS: 'blog_blogs',
  CURRENT_USER: 'blog_current_user'
}








