/**
 * My Blogs Page Component
 * 
 * Displays all blogs created by the logged-in user.
 * Provides options to edit and delete own blogs.
 * Protected route - requires authentication.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBlog } from '../context/BlogContext'
import { blogAPI } from '../utils/api'
import './MyBlogs.css'

function MyBlogs() {
  const { user } = useAuth()
  const { deleteBlog } = useBlog()
  const [myBlogs, setMyBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Load user's blogs from API
  useEffect(() => {
    const loadMyBlogs = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const response = await blogAPI.getByUser(user.id)
        
        if (response.success) {
          const transformedBlogs = response.data.map(blog => ({
            id: blog._id,
            title: blog.title,
            description: blog.description,
            category: blog.category,
            author: blog.authorName || (blog.author?.username || 'Unknown'),
            authorId: typeof blog.author === 'object' ? blog.author._id : blog.author,
            date: blog.createdAt,
            image: blog.image || null
          }))
          setMyBlogs(transformedBlogs)
        }
      } catch (error) {
        console.error('Error loading my blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadMyBlogs()
  }, [user?.id])
  
  // Sort by date (newest first)
  const sortedBlogs = [...myBlogs].sort((a, b) => new Date(b.date) - new Date(a.date))

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  /**
   * Handle blog deletion
   * Confirms deletion and removes the blog
   */
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      const result = await deleteBlog(blogId, user.id, user.role)
      
      if (result.success) {
        // Remove from local state
        setMyBlogs(myBlogs.filter(blog => blog.id !== blogId))
        alert('Blog deleted successfully')
      } else {
        alert(result.message)
      }
    }
  }

  return (
    <div className="my-blogs-page">
      <div className="my-blogs-header">
        <h1 className="page-title">My Blogs</h1>
        <Link to="/create-blog" className="create-button">
          + Create New Blog
        </Link>
      </div>

      {loading ? (
        <div className="no-blogs">
          <p>Loading your blogs...</p>
        </div>
      ) : sortedBlogs.length === 0 ? (
        <div className="no-blogs">
          <p>You haven't created any blogs yet.</p>
          <Link to="/create-blog" className="create-link">
            Create your first blog
          </Link>
        </div>
      ) : (
        <div className="blogs-list">
          {sortedBlogs.map((blog) => (
            <article key={blog.id} className="blog-card">
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
                    <span className="blog-date">{formatDate(blog.date)}</span>
                  </div>
                </Link>
              </div>
              
              <div className="blog-actions">
                <Link to={`/edit-blog/${blog.id}`} className="edit-button">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBlogs
