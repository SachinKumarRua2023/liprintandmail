# Image Integration Guide - Banner Buzz

## 📁 Image Organization

### Source Locations:
```
1. Local Assets:
   C:\Users\Sachin Kumar\OneDrive\Desktop\HirenTask\assets\country_cove_products\

2. Banner Buzz Archive:
   C:\Users\Sachin Kumar\Downloads\Buy_Marketing_Materials_Online_at_Affordable_Rate_BannerBuzz__archive\
```

### Categories in country_cove_products:
```
Banners/
├── Backlit
├── Birthday
├── Breakaway
├── Church
├── Fabric
├── General
├── Holiday
├── Mesh & Fence
├── Political
├── Vinyl

Decals/
├── General
├── Wall
├── Window

Displays/
├── Canopy Tents
├── Counters
├── General

Flags/
├── Feather
├── General
├── Teardrop

Marketing/
├── Facility
├── Hero Slides
├── Lifestyle

Signs/
├── Aluminum
├── General
├── LED & Neon
├── Yard Signs

Stands/
├── General
├── Retractable

Table Covers/
├── Fitted
├── Stretch
```

---

## 🚀 Step 1: Copy Images to Project

### Create Public Folder Structure:

```
bannerbuzz_odoo/
└── public/
    └── products/
        ├── banners/
        │   ├── backlit/
        │   ├── vinyl/
        │   ├── fabric/
        │   └── ...
        ├── decals/
        ├── displays/
        ├── flags/
        ├── signs/
        └── stands/
```

### Commands to Copy:

```bash
# Windows PowerShell
# Copy Banner images
Copy-Item -Path "C:\Users\Sachin Kumar\OneDrive\Desktop\HirenTask\assets\country_cove_products\Banners*" -Destination "bannerbuzz_odoo\public\products\banners\" -Recurse

# Copy Decals
Copy-Item -Path "C:\Users\Sachin Kumar\OneDrive\Desktop\HirenTask\assets\country_cove_products\Decals*" -Destination "bannerbuzz_odoo\public\products\decals\" -Recurse

# Copy all categories
Copy-Item -Path "C:\Users\Sachin Kumar\OneDrive\Desktop\HirenTask\assets\country_cove_products\*" -Destination "bannerbuzz_odoo\public\products\" -Recurse
```

---

## 🎨 Step 2: Update Product Data Format

### JSON Structure (in odoo-products.json):

```json
{
  "lastUpdated": "2026-06-05T12:00:00Z",
  "totalProducts": 250,
  "categories": [
    {
      "id": "banners",
      "name": "Banners",
      "subcategories": [
        {
          "id": "banners-vinyl",
          "name": "Vinyl Banners",
          "image": "/products/banners/Banners -- Vinyl/vinyl-banner-thumb.jpg"
        },
        {
          "id": "banners-fabric",
          "name": "Fabric Banners",
          "image": "/products/banners/Banners -- Fabric/fabric-banner-thumb.jpg"
        }
      ]
    }
  ],
  "products": [
    {
      "id": "1",
      "name": "10ft Vinyl Banner - Full Color",
      "category": "Banners",
      "subcategory": "Vinyl Banners",
      "price": "$49.99",
      "cost": "$15.00",
      "description": "Premium vinyl banner printing...",
      "images": [
        "/products/banners/Banners -- Vinyl/10-ft-backlit-trade-show-banner-with-stand.jpg",
        "/products/banners/Banners -- Vinyl/vinyl-banner-lifestyle.jpg"
      ],
      "thumbnail": "/products/banners/Banners -- Vinyl/10-ft-backlit-trade-show-banner-with-stand.jpg",
      "stock": 150,
      "rating": 4.8,
      "reviews": 247
    }
  ]
}
```

---

## 💻 Step 3: React Components for Displaying Images

### Component 1: Product Gallery (Main Image + Thumbnails)

```tsx
// client/src/components/ProductGallery.tsx
import React, { useState } from 'react';
import './ProductGallery.css';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div className="main-image-container">
        <img
          src={mainImage}
          alt={productName}
          className="main-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
      </div>

      {/* Thumbnails */}
      <div className="thumbnail-gallery">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${productName} ${index + 1}`}
            className={`thumbnail ${mainImage === image ? 'active' : ''}`}
            onClick={() => setMainImage(image)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### Component 2: Product Card with Image

```tsx
// client/src/components/ProductCard.tsx
import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  thumbnail: string;
  price: string;
  rating: number;
  reviews: number;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-image-wrapper">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
        <div className="image-overlay">
          <button className="quick-view">Quick View</button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="rating">
          <Star className="star-filled" size={16} />
          <span>{product.rating}</span>
          <span className="reviews">({product.reviews})</span>
        </div>
        <div className="price-section">
          <p className="price">{product.price}</p>
          <button className="add-to-cart">
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Component 3: Category Grid with Images

```tsx
// client/src/components/CategoryGrid.tsx
import React from 'react';

interface Category {
  id: string;
  name: string;
  image: string;
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <div key={category.id} className="category-card">
          <div className="category-image-wrapper">
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
            <div className="category-overlay">
              <h3>{category.name}</h3>
              <button>Explore</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Step 4: CSS Styling

```css
/* ProductGallery.css */
.product-gallery {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.main-image-container {
  flex: 1;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.05);
}

.thumbnail-gallery {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  object-fit: cover;
  transition: border-color 0.2s;
}

.thumbnail:hover {
  border-color: #ddd;
}

.thumbnail.active {
  border-color: #007bff;
}

/* ProductCard.css */
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Square aspect ratio */
  overflow: hidden;
  background: #f5f5f5;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.quick-view {
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 14px;
}

.star-filled {
  color: #ffc107;
  fill: #ffc107;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #007bff;
}

.add-to-cart {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.2s;
}

.add-to-cart:hover {
  background: #0056b3;
}
```

---

## 🔄 Step 5: Image Loading Best Practices

### Lazy Loading Images:

```tsx
export function LazyImage({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/placeholder.jpg';
      }}
      {...props}
    />
  );
}
```

### Image Optimization:

```bash
# Install image optimization library
npm install sharp

# Create script to optimize images
node scripts/optimize-images.js
```

---

## ✅ Implementation Checklist

- [ ] Copy images to `public/products/` folder
- [ ] Update `odoo-products.json` with image paths
- [ ] Create `ProductGallery.tsx` component
- [ ] Create `ProductCard.tsx` component
- [ ] Create `CategoryGrid.tsx` component
- [ ] Add CSS styling
- [ ] Add lazy loading
- [ ] Add error handling (placeholder image)
- [ ] Test image display in browser
- [ ] Optimize images for web
- [ ] Deploy to Vercel

---

## 📸 Placeholder Image (for missing images):

Create `public/placeholder.jpg` - a simple default image (200x200px) to show when images fail to load.

---

## 🚀 Next Steps

1. Copy images to project
2. Update product JSON with image paths
3. Create React components
4. Test locally
5. Push to GitHub
6. Deploy to Vercel

Ready to implement?
