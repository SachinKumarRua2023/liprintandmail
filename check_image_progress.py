#!/usr/bin/env python3
"""
Check how many product images have been uploaded to Odoo
"""
import xmlrpc.client

ODOO_URL = "https://country-cove-inc.odoo.com"
ODOO_DB = "country-cove-inc"
ODOO_USERNAME = "countrycoveinc@gmail.com"
ODOO_PASSWORD = "M@nhattan1234"

try:
    common = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/common')
    uid = common.authenticate(ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {})
    models = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/object')

    def execute(model, method, args, kwargs=None):
        if kwargs is None:
            kwargs = {}
        return models.execute_kw(ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs)

    # Count total products
    total_products = len(execute('product.template', 'search', [[]]))

    # Count products WITH images
    products_with_images = len(execute('product.template', 'search',
        [['image_1920', '!=', False]]))

    print("\n" + "=" * 60)
    print("ODOO IMAGE UPLOAD PROGRESS")
    print("=" * 60)
    print(f"Total products in Odoo: {total_products}")
    print(f"Products WITH images:   {products_with_images}")
    print(f"Products WITHOUT images: {total_products - products_with_images}")
    print(f"\nProgress: {(products_with_images/total_products*100):.1f}%" if total_products > 0 else "0%")
    print("=" * 60 + "\n")

except Exception as e:
    print(f"Error: {e}")
