import { useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import './ProductCard.css';

interface Product {
  id: string;
  name: string;
  thumbnail: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  sku?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = () => {
    setIsLoading(true);
    setTimeout(() => {
      onAddToCart?.(product);
      setIsLoading(false);
    }, 300);
  };

  const discount = product.originalPrice
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-image-container">
        <img
          src={product.thumbnail || '/assets/images/a101_bbclc01_1_us.jpg'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // If image fails, try another from assets
            const fallbacks = [
              '/assets/images/a101_bbcm01_1_us.jpg',
              '/assets/images/a101_bbdh01_1_us.jpg',
              '/assets/images/a101_bbevt01_1_us.jpg',
              '/placeholder.jpg'
            ];
            const img = e.target as HTMLImageElement;
            const currentSrc = img.src;
            const nextFallback = fallbacks.find(f => f !== currentSrc);
            if (nextFallback) {
              img.src = nextFallback;
            }
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="discount-badge">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="wishlist-btn"
          onClick={() => setIsWishlisted(!isWishlisted)}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className={isWishlisted ? 'filled' : ''}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Stock Status */}
        <div className="stock-status">
          {product.stock > 20 ? (
            <span className="in-stock">In Stock</span>
          ) : product.stock > 0 ? (
            <span className="low-stock">Low Stock</span>
          ) : (
            <span className="out-stock">Out of Stock</span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="image-overlay">
          <button className="quick-view-btn">Quick View</button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        <div className="rating-container">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews-count">({product.reviews})</span>
        </div>

        {/* Description */}
        <p className="product-description">{product.description}</p>

        {/* Price Section */}
        <div className="price-section">
          <div className="prices">
            <span className="current-price">{product.price}</span>
            {product.originalPrice && (
              <span className="original-price">{product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isLoading || product.stock === 0}
          title={product.stock === 0 ? "Out of stock" : "Add to cart"}
        >
          <ShoppingCart size={18} />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
