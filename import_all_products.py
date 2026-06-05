#!/usr/bin/env python3
"""
Simple import and image upload for sports cards and gift baskets
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

def process_csv_file(csv_file, category_name):
    """Import products and upload images from CSV"""
    try:
        with open(csv_file, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            products = list(reader)
    except Exception as e:
        print(f"[ERROR] Failed to read {csv_file}: {e}")
        return 0, 0

    print(f"\n{'='*70}")
    print(f"PROCESSING {category_name} - {len(products)} products")
    print(f"{'='*70}\n")

    success = 0
    failed = 0

    for idx, row in enumerate(products, 1):
        try:
            sku = row['Default Code'].strip()
            name = row['Name'].strip()
            price = float(row['List Price'].strip())
            cost = float(row['Cost'].strip())
            image_url = row['Image URL'].strip()
            description = row['Description'].strip()

            # Find or create product
            existing = execute('product.template', 'search', [[['default_code', '=', sku]]])

            if existing:
                product_id = existing[0]
            else:
                # Create new product
                product_id = execute('product.template', 'create', [{
                    'name': name,
                    'default_code': sku,
                    'list_price': price,
                    'standard_price': cost,
                    'description': description,
                    'type': 'product',
                }])

            # Upload image
            image_path = f"public{image_url}"
            if os.path.exists(image_path):
                with open(image_path, 'rb') as img:
                    image_data = base64.b64encode(img.read()).decode('utf-8')
                    execute('product.template', 'write', [[product_id], {'image_1920': image_data}])
                print(f"[{idx}/{len(products)}] OK — {name[:50]}")
                success += 1
            else:
                print(f"[{idx}/{len(products)}] SKIP — Image not found")

            if idx % 10 == 0:
                time.sleep(0.5)

        except Exception as e:
            print(f"[{idx}/{len(products)}] ERROR — {str(e)[:50]}")
            failed += 1

    print(f"\n{'='*70}")
    print(f"{category_name.upper()} COMPLETE")
    print(f"{'='*70}")
    print(f"Success: {success}")
    print(f"Failed:  {failed}")
    print(f"Total:   {len(products)}")
    print(f"{'='*70}\n")

    return success, failed

# Process both files
s_success, s_failed = process_csv_file('products_sports_cards.csv', 'Sports Cards')
g_success, g_failed = process_csv_file('products_gift_baskets.csv', 'Gift Baskets')

print(f"\n{'='*70}")
print(f"ALL IMPORTS COMPLETE")
print(f"{'='*70}")
print(f"Sports Cards:  {s_success} success, {s_failed} failed")
print(f"Gift Baskets:  {g_success} success, {g_failed} failed")
print(f"Total Success: {s_success + g_success}")
print(f"Total Failed:  {s_failed + g_failed}")
print(f"{'='*70}")
