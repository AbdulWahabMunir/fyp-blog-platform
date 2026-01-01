/**
 * Home Page Component
 * 
 * Displays:
 * - Introduction about the blog website
 * - Search bar to search blogs
 * - Category filter dropdown
 * - Recently posted blogs (all blogs)
 */

import { Link } from 'react-router-dom'
import { useBlog } from '../context/BlogContext'
import './Home.css'

function Home() {
  const { filteredBlogs, categories, searchTerm, selectedCategory, handleSearch, handleCategoryFilter, loading } = useBlog()

  /**
   * Format date to readable string
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
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
   * Check if search term matches in title (not description)
   * @param {string} title - Blog title
   * @param {string} searchTerm - Search term
   * @returns {boolean} - True if match is in title
   */
  const isMatchInTitle = (title, searchTerm) => {
    if (!searchTerm) return false
    return title.toLowerCase().includes(searchTerm.toLowerCase())
  }

  /**
   * Find the sentence containing the search term
   * @param {string} text - Full text to search
   * @param {string} searchTerm - Search term
   * @returns {string|null} - Sentence containing the term or null
   */
  const findMatchingSentence = (text, searchTerm) => {
    if (!searchTerm || !text) return null
    
    const lowerText = text.toLowerCase()
    const lowerSearch = searchTerm.toLowerCase()
    const searchIndex = lowerText.indexOf(lowerSearch)
    
    if (searchIndex === -1) return null
    
    // Find sentence boundaries (period, exclamation, question mark)
    let sentenceStart = 0
    for (let i = searchIndex; i >= 0; i--) {
      if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
        sentenceStart = i + 1
        break
      }
    }
    
    let sentenceEnd = text.length
    for (let i = searchIndex; i < text.length; i++) {
      if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
        sentenceEnd = i + 1
        break
      }
    }
    
    return text.substring(sentenceStart, sentenceEnd).trim()
  }

  /**
   * Highlight search term in text
   * @param {string} text - Text to highlight
   * @param {string} searchTerm - Term to highlight
   * @returns {JSX.Element} - Text with highlighted terms
   */
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark key={index} className="search-highlight">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  /**
   * Get description preview with highlighted search term
   * @param {Object} blog - Blog object
   * @returns {Object} - Object with preview text and matching sentence
   */
  const getDescriptionPreview = (blog) => {
    const isTitleMatch = isMatchInTitle(blog.title, searchTerm)
    const matchingSentence = !isTitleMatch && searchTerm 
      ? findMatchingSentence(blog.description, searchTerm)
      : null
    
    // If we found a matching sentence and it's not in title, show that sentence
    if (matchingSentence && !isTitleMatch) {
      return {
        preview: matchingSentence,
        isHighlighted: true
      }
    }
    
    // Otherwise, show normal preview
    return {
      preview: blog.description.length > 150 
        ? blog.description.substring(0, 150) + '...' 
        : blog.description,
      isHighlighted: false
    }
  }

  return (
    <div className="home">
      {/* Introduction Section */}
      <section className="home-intro">
        <h1 className="intro-title">Welcome to Our Blog Platform</h1>
        <p className="intro-text">
          Share your thoughts, ideas, and stories with the world. Our platform allows you to 
          create, edit, and manage your own blogs while exploring content from other writers.
        </p>
      </section>

      {/* Search and Filter Section */}
      <section className="search-filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search blogs by title, category, or content..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Blogs List Section */}
      <section className="blogs-section">
        <h2 className="section-title">
          {selectedCategory !== 'All' ? `${selectedCategory} Blogs` : 'All Blogs'}
          {searchTerm && ` - Search: "${searchTerm}"`}
        </h2>

        {loading ? (
          <div className="no-blogs">
            <p>Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="no-blogs">
            <p>No blogs found. {searchTerm || selectedCategory !== 'All' ? 'Try different search terms or categories.' : 'Be the first to create a blog!'}</p>
          </div>
        ) : (
          <div className="blogs-list">
              {filteredBlogs.map((blog) => (
                <article key={blog.id} className="blog-card">
                  <Link to={`/blog/${blog.id}`} className="blog-link">
                  {/* Blog Thumbnail Image */}
                  {blog.image && (
                    <div className="blog-thumbnail-container">
                      <img src={blog.image} alt={blog.title} className="blog-thumbnail" />
                    </div>
                  )}
                  <div className="blog-header">
                    <h3 className="blog-title">
                      {searchTerm && isMatchInTitle(blog.title, searchTerm)
                        ? highlightText(blog.title, searchTerm)
                        : blog.title}
                    </h3>
                    <span className="blog-category">{blog.category}</span>
                  </div>
                  <p className="blog-description">
                    {(() => {
                      const { preview, isHighlighted } = getDescriptionPreview(blog)
                      return isHighlighted && searchTerm ? (
                        <>
                          <span className="matching-sentence-indicator">📌 Matching line:</span>{' '}
                          {highlightText(preview, searchTerm)}
                        </>
                      ) : (
                        preview
                      )
                    })()}
                  </p>
                  <div className="blog-meta">
                    <span className="blog-author">By {blog.author}</span>
                    <span className="blog-date">{formatDate(blog.date)}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home