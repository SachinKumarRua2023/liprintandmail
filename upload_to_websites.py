#!/usr/bin/env python3
"""
Upload images to products on Long Island Convenience & Gift Baskets websites
"""
import os
import base64
import time
import sys

# Fix encoding for Windows
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

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

def upload_images_from_folder(folder_path, category_name):
    """Upload images from a folder to matching products"""

    print(f"\n{'='*70}")
    print(f"UPLOADING {category_name.upper()} IMAGES")
    print(f"{'='*70}\n")

    # Get all image files
    image_files = []
    if os.path.isdir(folder_path):
        image_files = sorted([f for f in os.listdir(folder_path)
                             if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))])

    if not image_files:
        print(f"[ERROR] No images found in {folder_path}")
        return 0, 0

    print(f"Found {len(image_files)} images to upload\n")

    success = 0
    failed = 0

    for idx, filename in enumerate(image_files, 1):
        try:
            image_path = os.path.join(folder_path, filename)

            # Try to find product by filename pattern
            # For sports cards: sports_card_0001.jpg -> CARD-0001
            # For gift baskets: gift_basket_01.png -> GIFT-01

            if 'sports_card' in filename.lower():
                # Extract number from filename
                num = filename.split('_')[-1].split('.')[0]
                sku = f"CARD-{num}"
            elif 'gift_basket' in filename.lower():
                # Extract number from filename
                num = filename.split('_')[-1].split('.')[0]
                sku = f"GIFT-{num}"
            else:
                print(f"[{idx}/{len(image_files)}] SKIP — Unknown format: {filename}")
                continue

            # Find product by SKU
            print(f"[{idx}/{len(image_files)}] {sku}...", end=' ', flush=True)
            product_ids = execute('product.template', 'search', [[['default_code', '=', sku]]])

            if not product_ids:
                print("PRODUCT NOT FOUND")
                failed += 1
                continue

            product_id = product_ids[0]
            print("Found ", end='', flush=True)

            # Read and encode image
            with open(image_path, 'rb') as img_file:
                image_data = base64.b64encode(img_file.read()).decode('utf-8')

            # Upload to Odoo
            execute('product.template', 'write', [[product_id], {'image_1920': image_data}])
            print("OK")
            success += 1

            if idx % 50 == 0:
                time.sleep(1)

        except Exception as e:
            print("ERROR")
            failed += 1

    print(f"\n{'='*70}")
    print(f"{category_name.upper()} UPLOAD COMPLETE")
    print(f"{'='*70}")
    print(f"Success: {success}")
    print(f"Failed:  {failed}")
    print(f"Total:   {len(image_files)}")
    print(f"{'='*70}\n")

    return success, failed

# Upload both image sets
print(f"\n{'='*70}")
print(f"UPLOADING IMAGES TO ODOO PRODUCTS")
print(f"longislandconvenience.com & ligiftbasket")
print(f"{'='*70}")

s_success, s_failed = upload_images_from_folder(
    'public/assets/images/sports_cards', 'Sports Cards'
)
g_success, g_failed = upload_images_from_folder(
    'public/assets/images/gift_baskets', 'Gift Baskets'
)

print(f"\n{'='*70}")
print(f"FINAL UPLOAD SUMMARY")
print(f"{'='*70}")
print(f"Sports Cards: {s_success}/{323} uploaded")
print(f"Gift Baskets: {g_success}/{12} uploaded")
print(f"TOTAL: {s_success + g_success}/{335} images uploaded")
print(f"{'='*70}")

if s_success + g_success == 335:
    print("\n[SUCCESS] ALL IMAGES UPLOADED SUCCESSFULLY!")
    print("\nVisit your websites:")
    print("  • https://longislandconvenience.com")
    print("  • https://ligiftbasket.com")
