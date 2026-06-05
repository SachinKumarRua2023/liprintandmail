/**
 * Real Card Showcase Component
 * Displays actual trading card images on homepage category sections
 * Fetches from /config/card-images.json and local /images/cards/ directory
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CardCategory {
  name: string;
  href: string;
  images: string[];
  local_files: string[];
}

interface CardConfig {
  categories: {
    [key: string]: CardCategory;
  };
  updated: string;
  source: string;
}

export function RealCardShowcase() {
  const [categories, setCategories] = useState<CardCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCardImages();
  }, []);

  const loadCardImages = async () => {
    try {
      // Load configuration
      const response = await fetch('/config/card-images.json');

      if (!response.ok) {
        console.warn('Card images config not found, using fallback');
        setCategories(getFallbackCategories());
        setLoading(false);
        return;
      }

      const config: CardConfig = await response.json();

      // Convert to array with proper routes
      const categoryArray: CardCategory[] = [
        {
          name: 'Sports Cards',
          href: '/shop/category/sports-cards',
          images: config.categories.sports?.images || [],
          local_files: config.categories.sports?.local_files || getDefaultSportsCardImages()
        },
        {
          name: 'Pokémon',
          href: '/shop/category/pokemon',
          images: config.categories.pokemon?.images || [],
          local_files: config.categories.pokemon?.local_files || []
        },
        {
          name: 'Magic: The Gathering',
          href: '/shop/category/magic',
          images: config.categories.magic?.images || [],
          local_files: config.categories.magic?.local_files || []
        },
        {
          name: 'Yu-Gi-Oh!',
          href: '/shop/category/yugioh',
          images: config.categories.yugioh?.images || [],
          local_files: config.categories.yugioh?.local_files || getDefaultYuGiOhImages()
        },
        {
          name: 'Graded',
          href: '/shop/category/graded',
          images: config.categories.graded?.images || [],
          local_files: config.categories.graded?.local_files || []
        }
      ];

      setCategories(categoryArray);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load card images:', error);
      setCategories(getFallbackCategories());
      setLoading(false);
    }
  };

  const getDefaultSportsCardImages = () => [
    '/images/products/CARD-0005.jpg',
    '/images/products/CARD-0006.jpg',
    '/images/products/CARD-0010.jpg'
  ];

  const getDefaultYuGiOhImages = () => [
    '/images/cards/graded_1.jpg',
    '/images/cards/graded_2.jpg',
    '/images/cards/graded_3.jpg'
  ];

  const getFallbackCategories = (): CardCategory[] => [
    {
      name: 'Sports Cards',
      href: '/shop/category/sports-cards',
      images: [],
      local_files: getDefaultSportsCardImages()
    },
    {
      name: 'Pokémon',
      href: '/shop/category/pokemon',
      images: [],
      local_files: [
        '/images/cards/pokemon_1.jpg',
        '/images/cards/pokemon_2.jpg',
        '/images/cards/pokemon_3.jpg'
      ]
    },
    {
      name: 'Magic: The Gathering',
      href: '/shop/category/magic',
      images: [],
      local_files: [
        '/images/cards/magic_1.jpg',
        '/images/cards/magic_2.jpg',
        '/images/cards/magic_3.jpg'
      ]
    },
    {
      name: 'Yu-Gi-Oh!',
      href: '/shop/category/yugioh',
      images: [],
      local_files: getDefaultYuGiOhImages()
    },
    {
      name: 'Graded',
      href: '/shop/category/graded',
      images: [],
      local_files: [
        '/images/cards/graded_1.jpg',
        '/images/cards/graded_2.jpg',
        '/images/cards/graded_3.jpg'
      ]
    }
  ];

  if (loading) {
    return (
      <div className="card-showcase-loading">
        <div className="loading-spinner">Loading card images...</div>
      </div>
    );
  }

  return (
    <section className="card-showcase-section">
      <div className="showcase-container">
        <h2 className="showcase-title">Shop by Category</h2>
        <p className="showcase-subtitle">Browse our collection of authentic trading cards</p>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={category.href}
              key={category.name}
              className="category-card"
            >
              <div className="category-images-wrapper">
                <div className="category-images">
                  {/* Display local files first, fallback to remote images */}
                  {(category.local_files && category.local_files.length > 0
                    ? category.local_files
                    : category.images
                  ).slice(0, 3).map((imageSrc, idx) => (
                    <div key={idx} className="card-image-container">
                      <img
                        src={imageSrc}
                        alt={`${category.name} card ${idx + 1}`}
                        className="card-image"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          (e.target as HTMLImageElement).src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                  ))}

                  {/* Placeholder if less than 3 images */}
                  {(category.local_files?.length || 0) < 3 && (
                    <>
                      {Array(3 - (category.local_files?.length || 0))
                        .fill(null)
                        .map((_, idx) => (
                          <div key={`placeholder-${idx}`} className="card-image-container placeholder">
                            <div className="placeholder-content">
                              <span className="placeholder-text">{category.name}</span>
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>

              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-cta">Browse Collection →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RealCardShowcase;
