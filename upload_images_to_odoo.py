#!/usr/bin/env python3
"""
Upload all product images to Odoo from products_for_odoo.csv
Downloads images from /assets/images/ and attaches to products
"""
import csv
import base64
import sys
import time
import os
from pathlib import Path

# Odoo credentials
ODOO_URL = "https://country-cove-inc.odoo.com"
ODOO_DB = "country-cove-inc"
ODOO_USERNAME = "countrycoveinc@gmail.com"
ODOO_PASSWORD = "M@nhattan1234"

# XML-RPC connection
try:
    import xmlrpc.client
    common = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/common')
    uid = common.authenticate(ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {})
    models = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/object')

    def execute(model, method, args, kwargs=None):
        if kwargs is None:
            kwargs = {}
        return models.execute_kw(ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs)

    print(f"[OK] Connected to Odoo (UID: {uid})\n")
except Exception as e:
    print(f"[ERROR] Failed to connect to Odoo: {e}")
    sys.exit(1)

# Read CSV
csv_path = "products_for_odoo.csv"
products = []
with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        products.append(row)

print(f"Found {len(products)} products in CSV\n")
print("=" * 70)
print("UPLOADING IMAGES TO ODOO")
print("=" * 70)

success_count = 0
failed_count = 0
skipped_count = 0

for idx, product in enumerate(products, 1):
    try:
        # Get image path
        image_url = product['Image URL']
        image_path = f"public{image_url}"  # Convert /assets/... to public/assets/...

        if not os.path.exists(image_path):
            print(f"[{idx}/{len(products)}] SKIP - Image not found: {image_url}")
            skipped_count += 1
            continue

        # Read and encode image
        with open(image_path, 'rb') as img_file:
            image_data = base64.b64encode(img_file.read()).decode('utf-8')

        # Find product by SKU
        sku = product['Default Code']
        products_found = execute('product.template', 'search_read',
            [[['default_code', '=', sku]]],
            {'fields': ['id', 'name'], 'limit': 1})

        if not products_found:
            print(f"[{idx}/{len(products)}] SKIP - SKU not found in Odoo: {sku}")
            skipped_count += 1
            continue

        product_id = products_found[0]['id']
        product_name = products_found[0]['name']

        # Upload image to Odoo
        execute('product.template', 'write',
            [[product_id], {'image_1920': image_data}])

        print(f"[{idx}/{len(products)}] OK — {product_name[:50]}")
        success_count += 1

        # Rate limit (avoid overwhelming Odoo)
        if idx % 10 == 0:
            time.sleep(0.5)

    except Exception as e:
        print(f"[{idx}/{len(products)}] ERROR - {str(e)[:60]}")
        failed_count += 1

print("\n" + "=" * 70)
print("UPLOAD COMPLETE")
print("=" * 70)
print(f"Success: {success_count}")
print(f"Failed:  {failed_count}")
print(f"Skipped: {skipped_count}")
print(f"Total:   {len(products)}")
