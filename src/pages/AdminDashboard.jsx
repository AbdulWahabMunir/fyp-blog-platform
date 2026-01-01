/**
 * Admin Dashboard Component
 * 
 * Admin-only page that displays all blogs from all users.
 * Admins can delete any blog but cannot edit user blogs.
 * Protected route - requires admin role.
 */

import { Link } from 'react-router-dom'
import { useBlog } from '../context/BlogContext'
import { useAuth } from '../context/AuthContext'
import './AdminDashboard.css'

function AdminDashboard() {
  const { filteredBlogs, refreshBlogs, deleteBlog } = useBlog()
  const { user } = useAuth()

  // Sort blogs by date (newest first)
  const sortedBlogs = [...filteredBlogs].sort((a, b) => new Date(b.date) - new Date(a.date))

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Handle blog deletion
   * Admins can delete any blog
   */
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      const result = await deleteBlog(blogId, user.id, user.role)
      
      if (result.success) {
        refreshBlogs()
        alert('Blog deleted successfully')
      } else {
        alert(result.message)
      }
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage all blogs on the platform</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Blogs</h3>
          <p className="stat-number">{sortedBlogs.length}</p>
        </div>
      </div>

      {sortedBlogs.length === 0 ? (
        <div className="no-blogs">
          <p>No blogs found on the platform.</p>
        </div>
      ) : (
        <div className="admin-blogs-list">
          <h2 className="section-title">All Blogs</h2>
          {sortedBlogs.map((blog) => (
            <article key={blog.id} className="admin-blog-card">
              <div className="blog-content">
                <Link to={`/blog/${blog.id}`} className="blog-link">
                  <div className="blog-header">
                    <h3 className="blog-title">{blog.title}</h3>
                    <span className="blog-category">{blog.category}</span>
                  </div>
                  <p className="blog-description">
                    {blog.description.length > 150 
                      ? blog.description.substring(0, 150) + '...' 
                      : blog.description}
                  </p>
                  <div className="blog-meta">
                    <span className="blog-author">By {blog.author}</span>
                    <span className="blog-date">{formatDate(blog.date)}</span>
                  </div>
                </Link>
              </div>
              
              <div className="blog-actions">
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="delete-button"
                  title="Delete this blog"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="admin-note">
        <p><strong>Note:</strong> As an admin, you can delete any blog. You cannot edit blogs created by other users.</p>
      </div>
    </div>
  )
}

export default AdminDashboard
