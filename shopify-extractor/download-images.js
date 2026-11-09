import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../data/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Buscar cualquier archivo json descargado en el proyecto o data
const possibleJsonPaths = [
  path.resolve(__dirname, '../data/products.json'),
  path.resolve(__dirname, '../mariela_pokka_products_graphql.json'),
  path.resolve(__dirname, '../mariela_pokka_products_rest.json'),
];

let jsonPath = possibleJsonPaths.find(p => fs.existsSync(p));

if (!jsonPath) {
  // Buscar en la carpeta data
  const dataDir = path.resolve(__dirname, '../data');
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    if (files.length > 0) jsonPath = path.join(dataDir, files[0]);
  }
}

if (!jsonPath) {
  console.log("⚠️ Coloca el archivo JSON exportado en la carpeta 'data/products.json' o en la raíz del proyecto y vuelve a ejecutar este script.");
  process.exit(1);
}

console.log(`📖 Leyendo datos de: ${jsonPath}`);
const raw = fs.readFileSync(jsonPath, 'utf-8');
const products = JSON.parse(raw);

// Extraer todas las URLs de imágenes (soporta formato GraphQL y REST de Shopify)
const imageUrls = new Set();

for (const p of products) {
  // Formato REST: p.images = [ { src: '...' } ]
  if (Array.isArray(p.images)) {
    p.images.forEach(img => {
      const url = img.src || img.url;
      if (url) imageUrls.add(url.split('?')[0]); // Limpiar query params de tamaño
    });
  }
  // Formato GraphQL: p.images.edges = [ { node: { url: '...' } } ]
  else if (p.images && Array.isArray(p.images.edges)) {
    p.images.edges.forEach(e => {
      const url = e.node?.url;
      if (url) imageUrls.add(url.split('?')[0]);
    });
  }
}

console.log(`📸 Encontradas ${imageUrls.size} imágenes únicas para descargar...`);

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function startDownloads() {
  let count = 0;
  for (const url of imageUrls) {
    const filename = path.basename(url);
    const dest = path.join(targetDir, filename);

    if (fs.existsSync(dest)) {
      console.log(`⏩ [${++count}/${imageUrls.size}] Ya existe: ${filename}`);
      continue;
    }

    try {
      console.log(`⬇️ [${++count}/${imageUrls.size}] Descargando: ${filename}...`);
      await downloadFile(url, dest);
    } catch (e) {
      console.error(`❌ Error descargando ${url}: ${e.message}`);
    }
  }

  console.log(`\n🎉 ¡Todas las imágenes han sido salvadas con éxito en: ${targetDir}!`);
}

startDownloads();
