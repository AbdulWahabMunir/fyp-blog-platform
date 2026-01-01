/**
 * Protected Route Component
 * 
 * This component protects routes that require authentication.
 * If user is not logged in, redirects to login page.
 * Can also check for specific roles (admin/user).
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute Component
 * @param {Object} props
 * @param {ReactNode} props.children - Component to render if authenticated
 * @param {boolean} props.requireAdmin - If true, requires admin role
 */
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If admin is required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  // User is authenticated (and admin if required), render children
  return children
}

export default ProtectedRoute








