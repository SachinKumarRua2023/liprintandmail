/**
 * Real Basket Showcase Component
 * Displays actual gift basket images on ligiftbasket.com homepage
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface BasketCategory {
  name: string;
  href: string;
  images: string[];
  description: string;
}

export function RealBasketShowcase() {
  const [categories] = useState<BasketCategory[]>([
    {
      name: 'Graduation Baskets',
      href: '/shop/category/graduation',
      images: [
        '/images/baskets/graduation_1.jpg',
        '/images/baskets/graduation_2.jpg',
        '/images/baskets/graduation_3.jpg'
      ],
      description: 'Celebrate their achievement with a gourmet gift basket'
    },
    {
      name: "Father's Day Baskets",
      href: '/shop/category/fathers-day',
      images: [
        '/images/baskets/fathers_1.jpg',
        '/images/baskets/fathers_2.jpg',
        '/images/baskets/fathers_3.jpg'
      ],
      description: 'BBQ, craft beer, whiskey & gourmet baskets for Dad'
    },
    {
      name: 'Birthday Baskets',
      href: '/shop/category/birthday',
      images: [
        '/images/baskets/birthday_1.jpg',
        '/images/baskets/birthday_2.jpg',
        '/images/baskets/birthday_3.jpg'
      ],
      description: 'Chocolates, snacks, candies & personalized gifts for all ages'
    },
    {
      name: 'Corporate Gifts',
      href: '/shop/category/corporate',
      images: [
        '/images/baskets/corporate_1.jpg',
        '/images/baskets/corporate_2.jpg',
        '/images/baskets/corporate_3.jpg'
      ],
      description: 'Branded gift baskets for clients, employees & holidays'
    },
    {
      name: 'Holiday Baskets',
      href: '/shop/category/holiday',
      images: [
        '/images/baskets/holiday_1.jpg',
        '/images/baskets/holiday_2.jpg',
        '/images/baskets/holiday_3.jpg'
      ],
      description: 'Christmas, Hanukkah, Easter & Thanksgiving themed sets'
    }
  ]);

  return (
    <section className="basket-showcase-section">
      <div className="showcase-container">
        <h2 className="showcase-title">Shop by Occasion</h2>
        <p className="showcase-subtitle">Premium gift baskets for every celebration</p>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={category.href}
              key={category.name}
              className="basket-card"
            >
              <div className="basket-images-wrapper">
                <div className="basket-images">
                  {category.images.map((imageSrc, idx) => (
                    <div key={idx} className="basket-image-container">
                      <img
                        src={imageSrc}
                        alt={`${category.name} ${idx + 1}`}
                        className="basket-image"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="basket-info">
                <h3 className="basket-name">{category.name}</h3>
                <p className="basket-description">{category.description}</p>
                <p className="basket-cta">View Baskets →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RealBasketShowcase;
