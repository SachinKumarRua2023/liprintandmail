/**
 * Odoo Integration Script for LiPrintandMail
 * This script connects to your local Odoo instance and syncs products
 *
 * Setup Instructions:
 * 1. Install: npm install xmlrpc
 * 2. Create .env with ODOO credentials
 * 3. Run: node server/odoo-integration.ts
 */

// @ts-ignore
import axios from "axios";

// ODOO Configuration - Update these with your Odoo details
const ODOO_CONFIG = {
  // For local Odoo: http://localhost:8069
  // For cloud Odoo: https://yourcompany.odoo.com
  url: process.env.ODOO_URL || "http://localhost:8069",
  database: process.env.ODOO_DATABASE || "odoo_db",
  username: process.env.ODOO_USERNAME || "admin",
  password: process.env.ODOO_PASSWORD || "admin",
  apiKey: process.env.ODOO_API_KEY || "",
};

interface OdooProduct {
  id: number;
  name: string;
  category_id: [number, string];
  list_price: number;
  standard_price: number;
  description: string;
  image_1920: string;
  qty_available: number;
  uom_id: [number, string];
}

interface MappedProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  cost: string;
  description: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
}

/**
 * Connect to Odoo and fetch products
 */
export async function fetchProductsFromOdoo(): Promise<MappedProduct[]> {
  try {
    console.log("🔌 Connecting to Odoo...");
    console.log(`📍 URL: ${ODOO_CONFIG.url}`);
    console.log(`💾 Database: ${ODOO_CONFIG.database}`);

    // For REST API (newer Odoo versions)
    if (ODOO_CONFIG.apiKey) {
      return await fetchViaRestAPI();
    }
    // For older versions, you'd use XML-RPC
    else {
      return await fetchViaXmlRpc();
    }
  } catch (error) {
    console.error("❌ Error connecting to Odoo:", error);
    return [];
  }
}

/**
 * Fetch products via REST API (Odoo 16+)
 */
async function fetchViaRestAPI(): Promise<MappedProduct[]> {
  try {
    console.log("📡 Using REST API...");

    // Fetch products
    const response = await axios.get(
      `${ODOO_CONFIG.url}/api/res.product`,
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const products = response.data.data || response.data;

    console.log(`✅ Fetched ${products.length} products from Odoo`);

    // Map Odoo products to our format
    return products.map((product: OdooProduct) => ({
      id: String(product.id),
      name: product.name,
      category: product.category_id?.[1] || "Uncategorized",
      price: `$${(product.list_price || 0).toFixed(2)}`,
      cost: `$${(product.standard_price || 0).toFixed(2)}`,
      description: product.description || "",
      image: product.image_1920 || "",
      stock: Math.floor(product.qty_available || 0),
      rating: 4.5, // You'd fetch this from reviews if available
      reviews: 0, // Fetch from product reviews
    }));
  } catch (error) {
    console.error("❌ REST API Error:", error);
    throw error;
  }
}

/**
 * Fetch products via XML-RPC (Odoo 13-15)
 */
async function fetchViaXmlRpc(): Promise<MappedProduct[]> {
  try {
    console.log("📡 Using XML-RPC API...");

    // You would use the 'xmlrpc' npm package for this
    // This is a placeholder - uncomment when you install xmlrpc
    /*
    const client = new xmlrpc.Client({
      host: ODOO_CONFIG.url.replace('http://', '').replace('https://', ''),
      port: 8069,
      path: '/xmlrpc/2/',
    });

    // Authenticate
    const uid = await authenticateXmlRpc(client);

    // Fetch products
    const products = await client.methodCall('execute_kw', [
      ODOO_CONFIG.database,
      uid,
      ODOO_CONFIG.password,
      'product.product',
      'search_read',
      [],
      {
        fields: [
          'id',
          'name',
          'categ_id',
          'list_price',
          'standard_price',
          'description',
          'image_1920',
          'qty_available',
        ],
      },
    ]);

    return mapOdooProducts(products);
    */

    console.log("⚠️ XML-RPC requires 'xmlrpc' package. Install: npm install xmlrpc");
    return [];
  } catch (error) {
    console.error("❌ XML-RPC Error:", error);
    throw error;
  }
}

/**
 * Save products to local JSON file
 */
export async function saveProductsToFile(
  products: MappedProduct[],
  filename: string = "src/data/odoo-products.json"
): Promise<void> {
  try {
    const fs = await import("fs").then((m) => m.promises);

    const data = {
      lastUpdated: new Date().toISOString(),
      totalProducts: products.length,
      products: products,
    };

    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`✅ Products saved to ${filename}`);
  } catch (error) {
    console.error("❌ Error saving products:", error);
  }
}

/**
 * Organize products by category
 */
export function organizeByCategory(
  products: MappedProduct[]
): Record<string, MappedProduct[]> {
  return products.reduce(
    (acc, product) => {
      const category = product.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, MappedProduct[]>
  );
}

/**
 * Main sync function
 */
export async function syncOdooProducts(): Promise<void> {
  console.log("\n🚀 Starting Odoo Sync...\n");

  try {
    // Fetch products from Odoo
    const products = await fetchProductsFromOdoo();

    if (products.length === 0) {
      console.log("⚠️ No products found. Check your Odoo connection.");
      return;
    }

    // Organize by category
    const byCategory = organizeByCategory(products);
    console.log("\n📊 Products by Category:");
    Object.entries(byCategory).forEach(([category, items]) => {
      console.log(`   • ${category}: ${items.length} products`);
    });

    // Save to file
    await saveProductsToFile(products, "src/data/odoo-products.json");

    console.log("\n✅ Odoo sync completed successfully!");
    console.log(`📦 Total products synced: ${products.length}`);
    console.log(
      "💡 Use src/data/odoo-products.json in your React components\n"
    );
  } catch (error) {
    console.error("❌ Sync failed:", error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncOdooProducts();
}

export default {
  fetchProductsFromOdoo,
  saveProductsToFile,
  organizeByCategory,
  syncOdooProducts,
};
