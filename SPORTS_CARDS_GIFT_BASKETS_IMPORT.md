# Sports Cards & Gift Baskets Import Guide

## Overview

This guide explains how to import the newly created product catalogs into your Odoo database:
- **323 Sports Trading Cards** ($49.99 each)
- **12 Premium Gift Baskets** ($84.99-$144.99 each)

## Files Prepared

### CSV Files
- `products_sports_cards.csv` - 323 sports card products
- `products_gift_baskets.csv` - 12 gift basket products

### Images
- `public/assets/images/sports_cards/` - 323 product images (sports_card_0001.jpg through sports_card_0323.jpg)
- `public/assets/images/gift_baskets/` - 12 product images (gift_basket_01.png through gift_basket_12.png)

### Import Scripts
- `import_all_products.py` - Combined XML-RPC import (all-in-one)
- `import_rest_api.py` - REST API version
- `import_sports_cards.py` - Sports cards only
- `import_gift_baskets.py` - Gift baskets only

## Import Method 1: Odoo Web Interface (Recommended)

### Step 1: Import Products via CSV
1. Go to **Odoo Admin** → **Products** → **Products**
2. Click **Import** button
3. Select `products_sports_cards.csv`
4. Map the columns:
   - Name → Name
   - Default Code → SKU
   - List Price → Sale Price
   - Cost → Cost
   - Description → Description
   - Quantity On Hand → Available Quantity
5. Click **Import**
6. Repeat for `products_gift_baskets.csv`

### Step 2: Upload Images to Products
1. For each product in Odoo:
   - Open the product
   - Go to **Images** section
   - Upload the corresponding image from the folders
   - Save

**OR** use the Python scripts below to automate image upload.

## Import Method 2: Python Script (Bulk)

### Prerequisites
```bash
pip install requests xmlrpc
```

### Option A: XML-RPC (if products already exist)
```bash
python3 import_all_products.py
```

This script:
1. Searches for products by SKU in Odoo
2. Uploads images for matching products
3. Creates products if they don't exist (may require API fixes)

### Option B: REST API
```bash
python3 import_rest_api.py
```

## Product Structure

### Sports Cards CSV Format
```
Name | Default Code | List Price | Cost | Description | Quantity On Hand | Image URL
Sports Trading Card Set 1 | CARD-0001 | 49.99 | 15.00 | Premium sports... | 100 | /assets/images/sports_cards/sports_card_0001.jpg
```

### Gift Baskets CSV Format
```
Name | Default Code | List Price | Cost | Description | Quantity On Hand | Image URL
Deluxe Father's Day Gift Basket | GIFT-01 | 84.99 | 30.00 | Premium gift... | 50 | /assets/images/gift_baskets/gift_basket_01.png
```

## Expected Results

After import completion:
- ✅ 335 total new products in Odoo
- ✅ All 335 product images attached
- ✅ Full product details (pricing, SKU, descriptions)
- ✅ Stock quantities set

## Verification

### Check Sports Cards
```bash
# In Odoo, search for products with SKU "CARD-"
Products → Search: default_code = 'CARD-*'
Result: 323 products
```

### Check Gift Baskets
```bash
# In Odoo, search for products with SKU "GIFT-"
Products → Search: default_code = 'GIFT-*'
Result: 12 products
```

### Check Images
For each product, verify the image thumbnail is visible in the product list.

## Troubleshooting

### Images Not Uploading
- Ensure image files exist in the correct directory
- Check file permissions
- Verify image format (JPG/PNG)
- Run script with verbose output: Add `print()` statements in the script

### Products Not Created
- Check Odoo database connection
- Verify API credentials in script
- Check product naming for duplicates
- Review Odoo error logs in database

### API Errors
If using REST API, ensure:
- API key is valid: `7b0d68f00099dcf3d20ed53ac4c087a4c92f4d5e`
- API is enabled in Odoo settings
- Correct endpoint format

## Next Steps

1. **Import Products**: Use Method 1 (web UI) or Method 2 (Python)
2. **Verify Images**: Check that all images display correctly
3. **Set Categories**: Assign products to website categories
4. **Configure Pricing**: Review and adjust pricing as needed
5. **Test Checkout**: Verify products appear on website and checkout works

## File Sizes

- Sports Cards folder: ~8.5 MB (323 images)
- Gift Baskets folder: ~1.2 MB (12 images)
- **Total**: ~9.7 MB

## Deployment

After import and verification:
1. Push changes to git repository
2. Deploy to Vercel (website will fetch from Odoo API)
3. Test on production website
4. Monitor API performance

---

**Status**: ✅ CSV files and images ready for import
**Last Updated**: June 5, 2026
**Products Prepared**: 335 (323 cards + 12 baskets)
