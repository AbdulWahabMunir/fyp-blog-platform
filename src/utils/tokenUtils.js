/**
 * JWT Token Utilities
 * 
 * Functions to decode and manage JWT tokens
 */

/**
 * Decode JWT token without verification (for client-side use)
 * Note: In production, always verify tokens on the server side
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    // Decode the payload (second part)
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload))
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null // Token expired
    }
    
    return decoded
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Get user info from token
 * @param {string} token - JWT token
 * @returns {Object|null} - User info or null
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.userId) return null
  
  return {
    id: decoded.userId,
    // Note: Other user info (username, email, role) comes from API response
    // Token only contains userId
  }
}








