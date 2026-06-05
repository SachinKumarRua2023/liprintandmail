#!/usr/bin/env python3
"""
Import gift basket products into Odoo from CSV
"""
import csv
import sys
import time

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
csv_path = "products_gift_baskets.csv"
products = []
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Strip whitespace from keys and values
        cleaned_row = {k.strip(): v.strip() if v else v for k, v in row.items()}
        products.append(cleaned_row)

print(f"Found {len(products)} gift basket products to import\n")
print("=" * 70)
print("IMPORTING GIFT BASKETS TO ODOO")
print("=" * 70)

success_count = 0
failed_count = 0

for idx, product in enumerate(products, 1):
    try:
        sku = product['Default Code']
        name = product['Name']
        price = float(product['List Price'])
        cost = float(product['Cost'])
        description = product['Description']
        qty = int(product['Quantity On Hand'])

        # Check if product already exists
        existing = execute('product.template', 'search_read',
            [[['default_code', '=', sku]]],
            {'fields': ['id'], 'limit': 1})

        if existing:
            print(f"[{idx}/{len(products)}] SKIP - SKU already exists: {sku}")
            continue

        # Create product
        product_id = execute('product.template', 'create', [{
            'name': name,
            'default_code': sku,
            'list_price': price,
            'standard_price': cost,
            'description': description,
            'qty_available': qty,
            'type': 'product',
            'uom_id': 1,  # unit
        }])

        # Update stock
        execute('stock.quant', 'create', [{
            'product_id': execute('product.product', 'search', [[['product_tmpl_id', '=', product_id]]], {'limit': 1})[0],
            'location_id': 8,  # Stock location
            'quantity': qty,
        }])

        print(f"[{idx}/{len(products)}] OK — {name[:50]}")
        success_count += 1

        # Rate limit
        if idx % 5 == 0:
            time.sleep(1)

    except Exception as e:
        print(f"[{idx}/{len(products)}] ERROR - {str(e)[:60]}")
        failed_count += 1

print("\n" + "=" * 70)
print("GIFT BASKETS IMPORT COMPLETE")
print("=" * 70)
print(f"Success: {success_count}")
print(f"Failed:  {failed_count}")
print(f"Total:   {len(products)}")
print("=" * 70)
print("\nNext step: Run upload_gift_baskets.py to attach images")
