import csv
import os
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

csv_path = '/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/products_export.csv'
dest_dir = '/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/images'

os.makedirs(dest_dir, exist_ok=True)

# 1. Recolectar todas las URLs de imágenes únicas
image_urls = set()
with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        img = row.get('Image Src')
        if img:
            image_urls.add(img.split('?')[0])
        var_img = row.get('Variant Image')
        if var_img:
            image_urls.add(var_img.split('?')[0])

image_list = list(image_urls)
total = len(image_list)
print(f"Total imágenes a verificar/descargar: {total}")

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def download_one(url):
    filename = url.split('/')[-1]
    dest_path = os.path.join(dest_dir, filename)

    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        return ('SKIPPED', filename)

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            with open(dest_path, 'wb') as out:
                out.write(data)
        return ('OK', filename)
    except Exception as e:
        return ('ERROR', f"{filename}: {str(e)}")

start_time = time.time()
completed = 0
success_count = 0
skip_count = 0
error_count = 0

print("Iniciando descarga concurrente con 16 hilos...")

with ThreadPoolExecutor(max_workers=16) as executor:
    futures = {executor.submit(download_one, url): url for url in image_list}
    for future in as_completed(futures):
        completed += 1
        status, detail = future.result()
        if status == 'OK':
            success_count += 1
        elif status == 'SKIPPED':
            skip_count += 1
        else:
            error_count += 1
            print(f"⚠️ Error en {detail}")

        if completed % 50 == 0 or completed == total:
            elapsed = time.time() - start_time
            print(f"[{completed}/{total}] Descargadas: {success_count} | Omitidas: {skip_count} | Errores: {error_count} ({elapsed:.1f}s)")

print("\n" + "="*50)
print(f"🎉 Resumen final: {success_count} descargadas, {skip_count} omitidas, {error_count} errores.")
print(f"Directorio de imágenes: {dest_dir}")
print("="*50)
