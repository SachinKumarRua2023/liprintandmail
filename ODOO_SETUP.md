# LiPrintandMail Odoo Integration Guide

## 📋 Quick Start

### Option 1: Local Odoo (Recommended for Development)

#### Setup Local Odoo:
```bash
# Using Docker (easiest)
docker run -d -e POSTGRES_USER=odoo -e POSTGRES_PASSWORD=odoo \
  -e PGPASSWORD=odoo --name db postgres:15
  
docker run -d --name odoo --link db:db \
  -p 8069:8069 odoo:17
```

Then:
1. Go to http://localhost:8069
2. Create a new database (e.g., "liprintandmail")
3. Set username: admin, password: admin

#### Configure Environment:
```bash
# .env file
ODOO_URL=http://localhost:8069
ODOO_DATABASE=liprintandmail
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
```

### Option 2: Cloud Odoo (Production Ready)

1. Sign up at https://www.odoo.com/app/signup
2. Create your database
3. Get API Key from Settings → API Key
4. Update .env:
```bash
ODOO_URL=https://yourcompany.odoo.com
ODOO_DATABASE=your_database
ODOO_USERNAME=your_email@example.com
ODOO_PASSWORD=your_password
ODOO_API_KEY=your_api_key
```

---

## 📦 Syncing Products

### Manual Sync:
```bash
npm install axios
node server/odoo-integration.ts
```

This will:
- ✅ Connect to your Odoo instance
- ✅ Fetch all products
- ✅ Organize by category
- ✅ Save to `src/data/odoo-products.json`
- ✅ Include pricing, stock, images

### Automated Sync:
Add to `server/index.ts`:
```typescript
import { syncOdooProducts } from './odoo-integration';

// Sync every hour
setInterval(() => {
  syncOdooProducts().catch(console.error);
}, 60 * 60 * 1000);
```

---

## 🖼️ Product Images

### Your Product Images (Already Available):
If your images are in a folder:
```
/products/
├── banners/
│   ├── vinyl-banner-1.jpg
│   ├── vinyl-banner-2.jpg
│   └── ...
├── flags/
│   ├── flag-1.jpg
│   └── ...
└── signs/
```

Copy them to:
```
/public/products/
```

Then reference in products:
```json
{
  "id": "1",
  "name": "Vinyl Banner",
  "image": "/products/banners/vinyl-banner-1.jpg"
}
```

### Auto-Fetch Images from Odoo:
Odoo stores product images in base64. The script handles this:
```typescript
// From Odoo
product.image: "iVBORw0KGgo..." // base64
// Convert to
"image": "data:image/png;base64,iVBORw0KGgo..."
```

---

## 📊 Product Data Structure

After syncing, your `odoo-products.json` will look like:
```json
{
  "lastUpdated": "2026-06-05T10:30:00Z",
  "totalProducts": 250,
  "products": [
    {
      "id": "1",
      "name": "Vinyl Banners - 3x2ft",
      "category": "Banners",
      "price": "$6.99",
      "cost": "$2.50",
      "description": "Premium vinyl banners...",
      "image": "/products/banners/vinyl-banner.jpg",
      "stock": 150,
      "rating": 4.5,
      "reviews": 247
    },
    {
      "id": "2",
      "name": "Custom LED Neon Sign",
      "category": "LED Signs",
      "price": "$249.00",
      "cost": "$120.00",
      ...
    }
  ]
}
```

---

## 🔌 API Endpoints (After Setup)

### GET /api/products
```bash
curl http://localhost:8080/api/products
```

Response:
```json
{
  "products": [...],
  "total": 250,
  "categories": ["Banners", "Signs", "Flags"]
}
```

### GET /api/products/:id
```bash
curl http://localhost:8080/api/products/1
```

### GET /api/categories
```bash
curl http://localhost:8080/api/categories
```

---

## 🛒 Creating Orders in Odoo

The app can create orders:
```typescript
POST /api/orders
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567"
  },
  "items": [
    {
      "product_id": 1,
      "quantity": 100,
      "price": 6.99
    }
  ],
  "total": 699.00
}
```

---

## 📱 Mobile & Web

Once you deploy:
- **Local**: http://localhost:8080
- **Production**: Your domain (Netlify/Vercel)
- **Mobile**: Same URL works on phones

---

## ❓ Troubleshooting

### Connection Failed
- Check ODOO_URL is correct
- Ensure Odoo is running
- Test: `curl http://localhost:8069`

### No Products Found
- Check database name and credentials
- Create sample products in Odoo first
- Verify API Key (if using cloud)

### Image Issues
- Ensure `/public/products/` folder exists
- Check file paths in product JSON
- Use relative paths: `/products/image.jpg`

---

## 🚀 Next Steps

1. ✅ Install Odoo locally or use cloud
2. ✅ Update .env with credentials
3. ✅ Run: `node server/odoo-integration.ts`
4. ✅ Check: `src/data/odoo-products.json` created
5. ✅ Deploy app (see PUBLISH.md)

Need help? Check Odoo docs: https://www.odoo.com/documentation
