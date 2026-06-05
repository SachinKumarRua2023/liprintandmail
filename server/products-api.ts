/**
 * Products API - Fetches product data from Odoo ERP
 * All product data comes directly from Odoo, not hardcoded
 */

import axios from 'axios';

const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'https://country-cove-inc.odoo.com',
  database: process.env.ODOO_DATABASE || 'country-cove-inc',
  username: process.env.ODOO_USERNAME || 'admin',
  password: process.env.ODOO_PASSWORD || 'admin',
  apiKey: process.env.ODOO_API_KEY || '',
};

/**
 * Get all products from Odoo
 */
export async function getAllProducts(limit = 100, offset = 0) {
  try {
    const response = await axios.get(
      `${ODOO_CONFIG.url}/api/res.product`,
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          limit,
          offset,
        }
      }
    );

    const products = response.data?.data || [];

    return {
      success: true,
      total: response.data?.total || products.length,
      products: products.map(formatProduct),
    };
  } catch (error) {
    console.error('Error fetching products from Odoo:', error);
    return {
      success: false,
      error: 'Failed to fetch products from Odoo',
      products: []
    };
  }
}

/**
 * Get single product by ID from Odoo
 */
export async function getProductById(productId: string) {
  try {
    const response = await axios.get(
      `${ODOO_CONFIG.url}/api/res.product/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const product = response.data?.data || response.data;
    return {
      success: true,
      product: formatProduct(product),
    };
  } catch (error) {
    console.error(`Error fetching product ${productId} from Odoo:`, error);
    return {
      success: false,
      error: 'Product not found',
    };
  }
}

/**
 * Search products by category
 */
export async function getProductsByCategory(categoryId: string) {
  try {
    const response = await axios.get(
      `${ODOO_CONFIG.url}/api/res.product`,
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          domain: `[("categ_id", "=", ${categoryId})]`,
        }
      }
    );

    const products = response.data?.data || [];
    return {
      success: true,
      products: products.map(formatProduct),
    };
  } catch (error) {
    console.error('Error searching products by category:', error);
    return {
      success: false,
      error: 'Failed to search products',
      products: []
    };
  }
}

/**
 * Get all product categories from Odoo
 */
export async function getCategories() {
  try {
    const response = await axios.get(
      `${ODOO_CONFIG.url}/api/product.category`,
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const categories = response.data?.data || [];
    return {
      success: true,
      categories: categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
      })),
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories',
      categories: []
    };
  }
}

/**
 * Format Odoo product to frontend format
 */
function formatProduct(odooProduct: any) {
  return {
    id: String(odooProduct.id),
    name: odooProduct.name,
    category: odooProduct.categ_id?.[1] || 'Uncategorized',
    category_id: odooProduct.categ_id?.[0],
    price: `$${(odooProduct.list_price || 0).toFixed(2)}`,
    originalPrice: odooProduct.original_price ? `$${odooProduct.original_price.toFixed(2)}` : null,
    cost: `$${(odooProduct.standard_price || 0).toFixed(2)}`,
    description: odooProduct.description || '',
    image: odooProduct.image_1920 ? `data:image/png;base64,${odooProduct.image_1920}` : '/placeholder.jpg',
    thumbnail: odooProduct.image_1920 ? `data:image/png;base64,${odooProduct.image_1920}` : '/placeholder.jpg',
    stock: Math.floor(odooProduct.qty_available || 0),
    rating: odooProduct.rating_avg || 4.5,
    reviews: odooProduct.review_count || 0,
    sku: odooProduct.default_code || '',
    weight: odooProduct.weight || 0,
    dimensions: odooProduct.dimensions || '',
    material: odooProduct.material || '',
    // Product attributes/features from Odoo
    features: odooProduct.attributes || [],
    shipping_time: odooProduct.shipping_days || '3-5 business days',
    // Stock status
    stock_status: odooProduct.qty_available > 0 ? 'in_stock' : 'out_of_stock',
    // Variants if available
    variants: odooProduct.product_variant_ids || [],
  };
}

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  formatProduct,
};
