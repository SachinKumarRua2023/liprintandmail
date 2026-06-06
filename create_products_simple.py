#!/usr/bin/env python3
"""
Create sports cards and gift basket products in Odoo
Simple version that creates products without stock management
"""
import csv
import time

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
    import sys
    sys.exit(1)

def create_products_from_csv(csv_file, category_name):
    """Create products from CSV"""
    try:
        with open(csv_file, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            products = list(reader)
    except Exception as e:
        print(f"[ERROR] Failed to read {csv_file}: {e}")
        return 0, 0

    print(f"\n{'='*70}")
    print(f"CREATING {category_name.upper()} PRODUCTS")
    print(f"{'='*70}\n")

    success = 0
    failed = 0

    for idx, row in enumerate(products, 1):
        try:
            sku = row['Default Code'].strip()
            name = row['Name'].strip()
            price = float(row['List Price'].strip())
            cost = float(row['Cost'].strip())
            description = row['Description'].strip()

            # Check if already exists
            existing = execute('product.template', 'search', [[['default_code', '=', sku]]])

            if existing:
                print(f"[{idx}/{len(products)}] SKIP — {sku} already exists")
                continue

            # Create product
            vals = {
                'name': name,
                'default_code': sku,
                'list_price': price,
                'standard_price': cost,
                'description': description,
                'type': 'product',
                'detailed_type': 'product',
                'sale_ok': True,
                'purchase_ok': False,
            }

            product_id = execute('product.template', 'create', [vals])
            print(f"[{idx}/{len(products)}] OK — {name[:50]} (ID: {product_id})")
            success += 1

            if idx % 50 == 0:
                time.sleep(2)

        except Exception as e:
            error_msg = str(e)[:80]
            print(f"[{idx}/{len(products)}] ERROR — {error_msg}")
            failed += 1

    print(f"\n{'='*70}")
    print(f"{category_name.upper()} CREATION COMPLETE")
    print(f"{'='*70}")
    print(f"Success: {success}")
    print(f"Failed:  {failed}")
    print(f"Total:   {len(products)}")
    print(f"{'='*70}\n")

    return success, failed

# Create both categories
print(f"\n{'='*70}")
print(f"PRODUCT CREATOR FOR ODOO")
print(f"{'='*70}")

s_success, s_failed = create_products_from_csv(
    'products_sports_cards.csv', 'Sports Cards'
)
g_success, g_failed = create_products_from_csv(
    'products_gift_baskets.csv', 'Gift Baskets'
)

print(f"\n{'='*70}")
print(f"FINAL SUMMARY")
print(f"{'='*70}")
print(f"Sports Cards:  {s_success} created, {s_failed} failed")
print(f"Gift Baskets:  {g_success} created, {g_failed} failed")
print(f"TOTAL CREATED: {s_success + g_success}/335")
print(f"{'='*70}")
print(f"\nNext step: Run bulk_upload_images_direct.py to add images")
