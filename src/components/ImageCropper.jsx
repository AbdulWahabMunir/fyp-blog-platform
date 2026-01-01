/**
 * Image Cropper Component
 * 
 * Allows users to crop/position images with previews for:
 * - Home page (200px height)
 * - Blog view page (500px height)
 */

import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import './ImageCropper.css'

function ImageCropper({ image, onCropComplete, onCancel, onRemove }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [previewImages, setPreviewImages] = useState({ home: null, blog: null })

  /**
   * Handle crop area change
   */
  const onCropChange = useCallback((crop) => {
    setCrop(crop)
  }, [])

  /**
   * Handle zoom change
   */
  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom)
  }, [])

  /**
   * Create a preview image at a specific height
   */
  const createPreviewImage = useCallback((imageSrc, pixelCrop, targetHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = imageSrc
      img.onload = () => {
        // Calculate aspect ratio and target width
        const aspectRatio = pixelCrop.width / pixelCrop.height
        const targetWidth = targetHeight * aspectRatio

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = targetWidth
        canvas.height = targetHeight

        // Draw the cropped image scaled to target size
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          targetWidth,
          targetHeight
        )

        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = reject
    })
  }, [])

  /**
   * Handle crop completion
   * Calculate the cropped area in pixels and update previews
   */
  const onCropCompleteCallback = useCallback(async (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
    
    // Generate preview images for home (200px) and blog view (500px)
    if (croppedAreaPixels) {
      try {
        const homePreview = await createPreviewImage(image, croppedAreaPixels, 200)
        const blogPreview = await createPreviewImage(image, croppedAreaPixels, 500)
        setPreviewImages({ home: homePreview, blog: blogPreview })
      } catch (error) {
        console.error('Error generating previews:', error)
      }
    }
  }, [image, createPreviewImage])

  /**
   * Create a cropped image from the original image
   */
  const createCroppedImage = async () => {
    if (!croppedAreaPixels) {
      // If no crop area defined, return original image
      onCropComplete(image)
      return
    }

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      onCropComplete(croppedImage)
    } catch (error) {
      console.error('Error cropping image:', error)
      // Fallback to original image
      onCropComplete(image)
    }
  }


  /**
   * Get cropped image as base64 (high quality for storage)
   */
  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = imageSrc
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Set canvas dimensions to cropped area
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // Draw the cropped image
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )

        // Convert to base64
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'))
              return
            }
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          },
          'image/jpeg',
          0.9 // Quality
        )
      }
      img.onerror = reject
    })
  }


  return (
    <div className="image-cropper-modal">
      <div className="image-cropper-content">
        <div className="cropper-header">
          <h3>Position Your Image</h3>
          <p>Drag to position, use the slider to zoom</p>
        </div>

        {/* Cropper Area */}
        <div className="cropper-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={undefined} // Free aspect ratio - user can position freely
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            style={{
              containerStyle: {
                width: '100%',
                height: '400px',
                position: 'relative',
                background: '#000'
              }
            }}
          />
        </div>

        {/* Zoom Control */}
        <div className="zoom-control">
          <label htmlFor="zoom-slider">Zoom:</label>
          <input
            id="zoom-slider"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="zoom-slider"
          />
          <span>{zoom.toFixed(1)}x</span>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <div className="preview-item">
            <h4>Home Page Preview</h4>
            <p className="preview-dimensions">Height: 200px</p>
            <div className="preview-container preview-home">
              {previewImages.home ? (
                <img 
                  src={previewImages.home} 
                  alt="Home preview" 
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}>
                  Preview will appear here
                </div>
              )}
            </div>
          </div>

          <div className="preview-item">
            <h4>Blog View Preview</h4>
            <p className="preview-dimensions">Height: 500px</p>
            <div className="preview-container preview-blog">
              {previewImages.blog ? (
                <img 
                  src={previewImages.blog} 
                  alt="Blog view preview" 
                  style={{
                    width: '100%',
                    height: '500px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '500px', 
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}>
                  Preview will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cropper-actions">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="cropper-button remove-button"
            >
              Remove Image
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="cropper-button cancel-button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={createCroppedImage}
            className="cropper-button confirm-button"
          >
            Confirm Position
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper

