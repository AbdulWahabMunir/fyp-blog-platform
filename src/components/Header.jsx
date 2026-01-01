/**
 * Header Component
 * 
 * Navigation header that displays:
 * - Logo/Brand name
 * - Navigation links based on authentication status
 * - User-specific links (My Blogs, Create Blog for users; Admin Dashboard for admins)
 * - Login/Logout buttons
 */

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function Header() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  /**
   * Handle logout
   * Logs out the user and redirects to home page
   */
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Blog Platform
        </Link>
        <nav className="nav">
          {/* Public Navigation */}
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>

          {/* Authenticated User Navigation */}
          {isAuthenticated ? (
            <>
              <Link to="/create-blog" className="nav-link">Create Blog</Link>
              <Link to="/my-blogs" className="nav-link">My Blogs</Link>
              
              {/* Admin Only Navigation */}
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              
              {/* User Info and Logout */}
              <div className="user-section">
                <span className="username">Hello, {user?.username}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            /* Guest Navigation */
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-link">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header