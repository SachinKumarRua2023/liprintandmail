#!/usr/bin/env python3
"""
Import products using Odoo REST API instead of XML-RPC
"""
import csv
import base64
import requests
import json
import time
import os

ODOO_URL = "https://country-cove-inc.odoo.com"
ODOO_DB = "country-cove-inc"
API_KEY = "7b0d68f00099dcf3d20ed53ac4c087a4c92f4d5e"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

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

            # Create product via REST API
            product_data = {
                'name': name,
                'default_code': sku,
                'list_price': price,
                'standard_price': cost,
                'description': description,
                'type': 'product',
            }

            # Upload image if exists
            image_path = f"public{image_url}"
            if os.path.exists(image_path):
                with open(image_path, 'rb') as img:
                    image_b64 = base64.b64encode(img.read()).decode('utf-8')
                    product_data['image_1920'] = image_b64

            # Create product
            url = f"{ODOO_URL}/api/product.template"
            response = requests.post(url, headers=headers, json=product_data)

            if response.status_code in [200, 201]:
                print(f"[{idx}/{len(products)}] OK — {name[:50]}")
                success += 1
            else:
                print(f"[{idx}/{len(products)}] ERROR — {response.status_code}: {response.text[:50]}")
                failed += 1

            if idx % 10 == 0:
                time.sleep(1)

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
