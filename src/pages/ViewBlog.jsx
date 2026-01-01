/**
 * View Blog Page Component
 * 
 * Displays a single blog post with full content.
 * Shows blog title, description, category, author, and date.
 */

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBlog } from '../context/BlogContext'
import { useAuth } from '../context/AuthContext'
import { blogAPI } from '../utils/api'
import './ViewBlog.css'

function ViewBlog() {
  const { id } = useParams()
  const { user } = useAuth()
  const { refreshBlogs, deleteBlog } = useBlog()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load blog from API
  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true)
        const response = await blogAPI.getById(id)
        
        if (response.success) {
          const blogData = response.data
          setBlog({
            id: blogData._id,
            title: blogData.title,
            description: blogData.description,
            category: blogData.category,
            author: blogData.authorName || (blogData.author?.username || 'Unknown'),
            authorId: typeof blogData.author === 'object' ? blogData.author._id : blogData.author,
            date: blogData.createdAt,
            image: blogData.image || null
          })
        } else {
          setError('Blog not found')
        }
      } catch (error) {
        setError('Failed to load blog')
        console.error('Error loading blog:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadBlog()
  }, [id])

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
   * Only allows deletion if user owns the blog or is an admin
   */
  const handleDelete = async () => {
    if (!blog) return

    const canDelete = user && (user.id === blog.authorId || user.role === 'admin')
    
    if (!canDelete) {
      alert('You do not have permission to delete this blog')
      return
    }

    if (window.confirm('Are you sure you want to delete this blog?')) {
      const result = await deleteBlog(blog.id, user.id, user.role)
      
      if (result.success) {
        navigate('/')
      } else {
        alert(result.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="blog-not-found">
        <p>Loading blog...</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="blog-not-found">
        <h1>Blog Not Found</h1>
        <p>The blog you're looking for doesn't exist.</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    )
  }

  const canEdit = user && user.id === blog.authorId
  const canDelete = user && (user.id === blog.authorId || user.role === 'admin')

  return (
    <article className="view-blog">
      <Link to="/" className="back-link">← Back to Home</Link>

      {/* White container for blog content */}
      <div className="blog-content-container">
        {/* Blog Image - displayed before title */}
        {blog.image && (
          <div className="blog-image-container">
            <img src={blog.image} alt={blog.title} className="blog-image" />
          </div>
        )}

        <div className="blog-header">
          <div className="blog-title-section">
            <h1 className="blog-title">{blog.title}</h1>
            <span className="blog-category">{blog.category}</span>
          </div>

          {/* Action buttons - only show if user can edit/delete */}
          {(canEdit || canDelete) && (
            <div className="blog-actions">
              {canEdit && (
                <Link to={`/edit-blog/${blog.id}`} className="edit-button">
                  Edit Blog
                </Link>
              )}
              {canDelete && (
                <button onClick={handleDelete} className="delete-button">
                  Delete Blog
                </button>
              )}
            </div>
          )}
        </div>

        <div className="blog-meta">
          <span className="blog-author">By {blog.author}</span>
          <span className="blog-date">{formatDate(blog.date)}</span>
        </div>

        <div className="blog-content">
          <p className="blog-description">{blog.description}</p>
        </div>
      </div>
    </article>
  )
}

export default ViewBlog
