import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  badge?: string;
}

export function useProducts(limit: number = 5) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products?limit=${limit}&offset=0`);
        const result = await response.json();

        if (result.success && result.products) {
          const formattedProducts = result.products.map((prod: any) => ({
            id: prod.id,
            name: prod.name,
            rating: prod.rating || 4.5,
            reviews: prod.reviews || 0,
            price: prod.price,
            image: prod.image || '/placeholder.jpg',
          }));

          setProducts(formattedProducts);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products from server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, loading, error };
}
