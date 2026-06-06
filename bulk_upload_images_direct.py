#!/usr/bin/env python3
"""
Bulk upload images directly to Odoo for sports cards and gift baskets
Uses the Odoo database field: product.template.image_1920
"""
import csv
import base64
import sys
import time
import os

ODOO_URL = "https://country-cove-inc.odoo.com"
ODOO_DB = "country-cove-inc"
ODOO_USERNAME = "countrycoveinc@gmail.com"
ODOO_PASSWORD = "M@nhattan1234"

try:
    import xmlrpc.client
    common = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/common')
    uid = common.authenticate(ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {})
    models = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/object')

    def execute(model, method, args, kwargs=None):
        if kwargs is None:
            kwargs = {}
        return models.execute_kw(ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs)

    print(f"[OK] Connected to Odoo\n")
except Exception as e:
    print(f"[ERROR] Failed to connect: {e}")
    sys.exit(1)

def upload_images_for_products(csv_file, category_name):
    """Upload images for products already in Odoo"""
    try:
        with open(csv_file, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            products = list(reader)
    except Exception as e:
        print(f"[ERROR] Failed to read {csv_file}: {e}")
        return 0, 0, 0

    print(f"\n{'='*70}")
    print(f"UPLOADING IMAGES FOR {category_name.upper()}")
    print(f"{'='*70}\n")

    success = 0
    failed = 0
    not_found = 0

    for idx, row in enumerate(products, 1):
        try:
            sku = row['Default Code'].strip()
            name = row['Name'].strip()
            image_url = row['Image URL'].strip()

            # Find product by SKU
            print(f"[{idx}/{len(products)}] Searching for SKU: {sku}...", end=' ')
            product_ids = execute('product.template', 'search', [[['default_code', '=', sku]]])

            if not product_ids:
                print(f"NOT FOUND")
                not_found += 1
                continue

            product_id = product_ids[0]
            print(f"Found (ID: {product_id})", end=' ')

            # Upload image
            image_path = f"public{image_url}"
            if not os.path.exists(image_path):
                print(f"IMAGE MISSING")
                failed += 1
                continue

            # Read and encode image
            with open(image_path, 'rb') as img_file:
                image_data = base64.b64encode(img_file.read()).decode('utf-8')

            # Upload to Odoo
            execute('product.template', 'write', [[product_id], {'image_1920': image_data}])
            print(f"✓ Image Uploaded")
            success += 1

            # Rate limit
            if idx % 20 == 0:
                time.sleep(1)

        except Exception as e:
            print(f"ERROR: {str(e)[:40]}")
            failed += 1

    print(f"\n{'='*70}")
    print(f"{category_name.upper()} UPLOAD COMPLETE")
    print(f"{'='*70}")
    print(f"Success:  {success}")
    print(f"Failed:   {failed}")
    print(f"Not Found: {not_found}")
    print(f"Total:    {len(products)}")
    print(f"{'='*70}\n")

    return success, failed, not_found

# Upload both categories
print(f"\n{'='*70}")
print(f"BULK IMAGE UPLOADER FOR ODOO")
print(f"{'='*70}")

s_success, s_failed, s_notfound = upload_images_for_products(
    'products_sports_cards.csv', 'Sports Cards'
)
g_success, g_failed, g_notfound = upload_images_for_products(
    'products_gift_baskets.csv', 'Gift Baskets'
)

print(f"\n{'='*70}")
print(f"FINAL SUMMARY")
print(f"{'='*70}")
print(f"Sports Cards:")
print(f"  ✓ Success:  {s_success}")
print(f"  ✗ Failed:   {s_failed}")
print(f"  ? Not Found: {s_notfound}")
print(f"\nGift Baskets:")
print(f"  ✓ Success:  {g_success}")
print(f"  ✗ Failed:   {g_failed}")
print(f"  ? Not Found: {g_notfound}")
print(f"\nTOTAL SUCCESS: {s_success + g_success}/{335}")
print(f"{'='*70}")
