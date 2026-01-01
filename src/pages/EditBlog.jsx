/**
 * Edit Blog Page Component
 * 
 * Form for editing an existing blog post.
 * Only the blog owner can edit their blogs.
 * Pre-fills the form with existing blog data.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBlog } from '../context/BlogContext'
import { blogAPI } from '../utils/api'
import ImageCropper from '../components/ImageCropper'
import './BlogForm.css'

function EditBlog() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [blog, setBlog] = useState(null)

  const { user } = useAuth()
  const { updateBlog } = useBlog()
  const navigate = useNavigate()

  // Available categories
  const categories = [
    'General',
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Education',
    'Business',
    'Entertainment',
    'Tutorial',
    'Sports'
  ]

  /**
   * Load blog data when component mounts
   */
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await blogAPI.getById(id)
        
        if (response.success) {
          const blogData = response.data
          const transformedBlog = {
            id: blogData._id,
            title: blogData.title,
            description: blogData.description,
            category: blogData.category,
            authorId: typeof blogData.author === 'object' ? blogData.author._id : blogData.author
          }

          // Check if user owns this blog
          if (transformedBlog.authorId !== user?.id) {
            alert('You can only edit your own blogs')
            navigate('/')
            return
          }

          setBlog(transformedBlog)
          setTitle(transformedBlog.title)
          setDescription(transformedBlog.description)
          setCategory(transformedBlog.category)
          // Set existing image if available
          if (blogData.image) {
            setImage(blogData.image)
            setImagePreview(blogData.image)
          }
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Error loading blog:', error)
        navigate('/')
      }
    }
    
    loadBlog()
  }, [id, user, navigate])

  /**
   * Handle image upload
   * Opens the cropper for positioning
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (!file) {
      // Don't clear existing image if no file selected
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB')
      return
    }

    // Convert to base64 and show cropper
    const reader = new FileReader()
    reader.onloadend = () => {
      setTempImage(reader.result) // Base64 string
      setShowCropper(true)
      setError('')
    }
    reader.onerror = () => {
      setError('Error reading image file')
    }
    reader.readAsDataURL(file)
  }

  /**
   * Handle crop completion
   * Saves the cropped/positioned image
   */
  const handleCropComplete = (croppedImage) => {
    setImage(croppedImage)
    setImagePreview(croppedImage)
    setShowCropper(false)
    setTempImage(null)
  }

  /**
   * Handle cropper cancel
   */
  const handleCropperCancel = () => {
    setShowCropper(false)
    setTempImage(null)
    // Reset file input
    const fileInput = document.getElementById('image')
    if (fileInput) fileInput.value = ''
  }

  /**
   * Handle remove image from cropper
   */
  const handleCropperRemove = () => {
    setImage(null)
    setImagePreview(null)
    setShowCropper(false)
    setTempImage(null)
    // Reset file input
    const fileInput = document.getElementById('image')
    if (fileInput) fileInput.value = ''
  }

  /**
   * Remove uploaded image
   */
  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
    // Reset file input
    const fileInput = document.getElementById('image')
    if (fileInput) fileInput.value = ''
  }

  /**
   * Handle form submission
   * Validates input and updates the blog
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate input
    if (!title.trim() || !description.trim() || !category.trim()) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long')
      setLoading(false)
      return
    }

    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters long')
      setLoading(false)
      return
    }

    // Update blog
    const result = await updateBlog(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        image: image // Include image (null if removed)
      },
      user.id
    )

    if (result.success) {
      // Redirect to the updated blog
      navigate(`/blog/${id}`)
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  if (!blog) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="blog-form-page">
      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropperCancel}
          onRemove={handleCropperRemove}
        />
      )}
      <div className="blog-form-container">
        <h1 className="form-title">Edit Blog</h1>
        <p className="form-subtitle">Update your blog post.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Blog Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title for your blog"
              disabled={loading}
              maxLength={200}
              required
            />
            <small className="form-hint">Minimum 3 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="image">Blog Image (Optional)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="image-input"
            />
            <small className="form-hint">Max size: 2MB. Supported formats: JPG, PNG, GIF</small>
            
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-button"
                  disabled={loading}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Blog Description / Content *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your blog content here..."
              rows="12"
              disabled={loading}
              required
            />
            <small className="form-hint">Minimum 10 characters</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Blog'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/blog/${id}`)}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBlog
