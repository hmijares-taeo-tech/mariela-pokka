/**
 * INSTRUCCIONES PARA EJECUTAR EN BRAVE:
 * 1. En la pestaña donde tienes abierto Shopify Admin (admin.shopify.com/store/mariela-pokka/...)
 * 2. Presiona F12 (o Ctrl+Shift+I) para abrir las DevTools.
 * 3. Ve a la pestaña "Console" (Consola).
 * 4. Pega TODO este código y presiona ENTER.
 * 5. Si tiene éxito, descargará automáticamente el archivo 'mariela_pokka_products_backup.json'.
 */

(async function rescueShopifyProducts() {
  console.log("🚀 Iniciando extracción de productos desde Shopify Admin...");

  const storeMatch = window.location.pathname.match(/\/store\/([^/]+)/);
  const storeName = storeMatch ? storeMatch[1] : 'mariela-pokka';

  // 1. Probar endpoints GraphQL internos
  const endpoints = [
    `/api/shopify/${storeName}`,
    `/store/${storeName}/api/graphql`,
    `/admin/api/unstable/graphql.json`,
    `/admin/api/2024-01/graphql.json`
  ];

  const query = `
    query RescueCatalog($cursor: String) {
      products(first: 50, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            vendor
            productType
            tags
            status
            totalInventory
            createdAt
            updatedAt
            options {
              id
              name
              values
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  barcode
                  inventoryQuantity
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
            images(first: 50) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            collections(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  `;

  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;

  for (const endpoint of endpoints) {
    try {
      console.log(`Intentando conectar con ${endpoint}...`);
      let allProducts = [];
      let hasNextPage = true;
      let cursor = null;

      while (hasNextPage) {
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ query, variables: { cursor } })
        });

        if (!res.ok) {
          console.warn(`Endpoint ${endpoint} respondió con status ${res.status}`);
          break;
        }

        const json = await res.json();
        if (json.data && json.data.products && json.data.products.edges) {
          const edges = json.data.products.edges;
          const mapped = edges.map(e => e.node);
          allProducts = allProducts.concat(mapped);
          console.log(`📦 Lote obtenido: ${allProducts.length} productos hasta ahora...`);

          hasNextPage = json.data.products.pageInfo.hasNextPage;
          cursor = json.data.products.pageInfo.endCursor;
        } else {
          break;
        }
      }

      if (allProducts.length > 0) {
        console.log(`🎉 ¡ÉXITO TOTAL! ${allProducts.length} productos extraídos vía ${endpoint}.`);
        triggerDownload(allProducts, `mariela_pokka_products_graphql.json`);
        return allProducts;
      }
    } catch (e) {
      console.warn(`Error en ${endpoint}:`, e);
    }
  }

  // 2. Si GraphQL falla, probar endpoints REST
  console.log("Intentando vías REST alternativas...");
  const restUrls = [
    `https://${storeName}.myshopify.com/products.json?limit=250`,
    `/products.json?limit=250`,
    `/admin/api/2024-01/products.json?limit=250`
  ];

  for (const url of restUrls) {
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          console.log(`🎉 ¡ÉXITO REST! ${data.products.length} productos extraídos desde ${url}.`);
          triggerDownload(data.products, `mariela_pokka_products_rest.json`);
          return data.products;
        }
      }
    } catch (e) {
      console.warn(`Error en REST ${url}:`, e);
    }
  }

  console.error("❌ No se pudo extraer automáticamente con los endpoints directos.");
  console.info("💡 Alternativa rápida: en la barra izquierda haz clic en 'Productos', luego arriba en 'Exportar' > 'Todos los productos' > CSV.");
})();

function triggerDownload(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log(`💾 ¡Archivo ${filename} descargado a tu carpeta de descargas!`);
}
