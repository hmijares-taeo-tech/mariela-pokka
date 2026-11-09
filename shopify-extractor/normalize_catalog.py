import csv
import json
import os
import re

csv_path = '/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/products_export.csv'
images_dir = '/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/images'
output_json = '/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/catalog_normalized.json'

def clean_filename(url):
    if not url:
        return None
    cleaned = url.split('?')[0].split('/')[-1]
    return cleaned

products = {}

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        handle = row.get('Handle', '').strip()
        if not handle:
            continue

        title = row.get('Title', '').strip()

        # Si el producto aún no ha sido registrado, inicializarlo
        if handle not in products:
            desc_html = row.get('Body (HTML)', '').strip()
            # Limpiar HTML simple para descripción corta
            clean_desc = re.sub('<[^<]+?>', '', desc_html).strip()

            tags = [t.strip() for t in row.get('Tags', '').split(',') if t.strip()]

            products[handle] = {
                'handle': handle,
                'title': title,
                'description': clean_desc,
                'description_html': desc_html,
                'vendor': row.get('Vendor', 'Mariela Pokka').strip() or 'Mariela Pokka',
                'product_category': row.get('Product Category', '').strip(),
                'type': row.get('Type', '').strip() or 'Apparel',
                'tags': tags,
                'published': row.get('Published', 'true').lower() == 'true',
                'status': row.get('Status', 'active').strip(),
                'options': [],
                'variants': [],
                'images': [],
                'image_filenames': []
            }

        prod = products[handle]
        if title and not prod['title']:
            prod['title'] = title

        # Imagen general del producto
        img_src = row.get('Image Src', '').strip()
        if img_src:
            fname = clean_filename(img_src)
            local_exists = os.path.exists(os.path.join(images_dir, fname)) if fname else False
            if fname and fname not in prod['image_filenames']:
                prod['image_filenames'].append(fname)
                prod['images'].append({
                    'src': img_src,
                    'filename': fname,
                    'local_exists': local_exists,
                    'alt': row.get('Image Alt Text', '')
                })

        # Opciones (Option1, Option2, Option3)
        for opt_idx in [1, 2, 3]:
            opt_name = row.get(f'Option{opt_idx} Name', '').strip()
            if opt_name and opt_name != 'Title' and opt_name not in prod['options']:
                prod['options'].append(opt_name)

        # Variantes
        sku = row.get('Variant SKU', '').strip()
        opt1_val = row.get('Option1 Value', '').strip()
        opt2_val = row.get('Option2 Value', '').strip()
        opt3_val = row.get('Option3 Value', '').strip()

        # Solo procesar variante si hay valor de opción o SKU
        if sku or opt1_val:
            price_str = row.get('Variant Price', '').strip() or '0'
            compare_price_str = row.get('Variant Compare At Price', '').strip() or '0'
            try:
                price = float(price_str)
            except ValueError:
                price = 0.0

            try:
                compare_price = float(compare_price_str)
            except ValueError:
                compare_price = 0.0

            try:
                qty = int(float(row.get('Variant Inventory Qty', '0') or 0))
            except ValueError:
                qty = 0

            try:
                grams = float(row.get('Variant Grams', '0') or 0)
            except ValueError:
                grams = 0.0

            var_img_url = row.get('Variant Image', '').strip()
            var_img_fname = clean_filename(var_img_url)

            # Nombre descriptivo de la variante
            variant_title_parts = [v for v in [opt1_val, opt2_val, opt3_val] if v and v != 'Default Title']
            variant_title = " / ".join(variant_title_parts) if variant_title_parts else "Default"

            # Opciones de esta variante
            variant_options = {}
            if opt1_val and opt1_val != 'Default Title':
                opt1_name = row.get('Option1 Name', 'Size').strip() or 'Size'
                variant_options[opt1_name] = opt1_val
            if opt2_val:
                opt2_name = row.get('Option2 Name', 'Color').strip() or 'Color'
                variant_options[opt2_name] = opt2_val
            if opt3_val:
                opt3_name = row.get('Option3 Name', 'Material').strip() or 'Material'
                variant_options[opt3_name] = opt3_val

            variant = {
                'sku': sku,
                'title': variant_title,
                'price_eur': price,
                'price_eur_cents': int(round(price * 100)),
                'compare_at_price_eur': compare_price,
                'compare_at_price_eur_cents': int(round(compare_price * 100)),
                'inventory_quantity': qty,
                'weight_grams': grams,
                'barcode': row.get('Variant Barcode', '').strip(),
                'options': variant_options,
                'image_filename': var_img_fname,
                'requires_shipping': row.get('Variant Requires Shipping', 'true').lower() == 'true',
                'taxable': row.get('Variant Taxable', 'true').lower() == 'true'
            }

            prod['variants'].append(variant)

product_list = list(products.values())

with open(output_json, 'w', encoding='utf-8') as out:
    json.dump(product_list, out, ensure_ascii=False, indent=2)

print(f"✅ Catálogo normalizado guardado en: {output_json}")
print(f"Total productos normalizados: {len(product_list)}")

# Estadísticas rápidas
total_vars = sum(len(p['variants']) for p in product_list)
total_imgs = sum(len(p['images']) for p in product_list)
print(f"Total variantes mapeadas: {total_vars}")
print(f"Total imágenes asociadas: {total_imgs}")
