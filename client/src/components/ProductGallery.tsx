import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './ProductGallery.css';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || '/placeholder.jpg');
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    const currentIndex = images.indexOf(mainImage);
    if (currentIndex > 0) {
      setMainImage(images[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = images.indexOf(mainImage);
    if (currentIndex < images.length - 1) {
      setMainImage(images[currentIndex + 1]);
    }
  };

  const handleFullscreenNext = () => {
    if (fullscreenIndex !== null && fullscreenIndex < images.length - 1) {
      setFullscreenIndex(fullscreenIndex + 1);
    }
  };

  const handleFullscreenPrev = () => {
    if (fullscreenIndex !== null && fullscreenIndex > 0) {
      setFullscreenIndex(fullscreenIndex - 1);
    }
  };

  return (
    <>
      <div className="product-gallery">
        {/* Main Image */}
        <div className="main-image-section">
          <div className="main-image-container">
            <img
              src={mainImage}
              alt={productName}
              className="main-image"
              onClick={() => setFullscreenIndex(images.indexOf(mainImage))}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  className="nav-btn prev-btn"
                  onClick={handlePrevious}
                  title="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="nav-btn next-btn"
                  onClick={handleNext}
                  title="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <div className="image-counter">
              {images.indexOf(mainImage) + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="thumbnail-section">
            <div className="thumbnail-gallery">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                  onClick={() => setMainImage(image)}
                  title={`Image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${productName} ${index + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div className="gallery-fullscreen">
          <div className="fullscreen-container">
            {/* Close Button */}
            <button
              className="fullscreen-close"
              onClick={() => setFullscreenIndex(null)}
              title="Close fullscreen"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <img
              src={images[fullscreenIndex]}
              alt={`${productName} ${fullscreenIndex + 1}`}
              className="fullscreen-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="fullscreen-nav prev"
                  onClick={handleFullscreenPrev}
                  disabled={fullscreenIndex === 0}
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  className="fullscreen-nav next"
                  onClick={handleFullscreenNext}
                  disabled={fullscreenIndex === images.length - 1}
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="fullscreen-counter">
              {fullscreenIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductGallery;
