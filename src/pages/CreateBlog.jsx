/**
 * Create Blog Page Component
 * 
 * Form for creating a new blog post.
 * Requires authentication (protected route).
 * Users can input title, description, and category.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBlog } from '../context/BlogContext'
import ImageCropper from '../components/ImageCropper'
import './BlogForm.css'

function CreateBlog() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const { createBlog } = useBlog()
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
   * Handle image upload
   * Opens the cropper for positioning
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (!file) {
      setImage(null)
      setImagePreview(null)
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
   * Validates input and creates a new blog
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

    try {
      // Create blog
      const result = await createBlog({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        image: image // Include image if uploaded
      })

      if (result.success) {
        // Redirect to the newly created blog
        navigate(`/blog/${result.blog.id}`)
      } else {
        setError(result.message || 'Something went wrong!')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error creating blog:', err)
      setError(err.response?.data?.message || err.message || 'Something went wrong! Please try again.')
      setLoading(false)
    }
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
        <h1 className="form-title">Create New Blog</h1>
        <p className="form-subtitle">Share your thoughts and ideas with the world.</p>

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
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
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

export default CreateBlog
