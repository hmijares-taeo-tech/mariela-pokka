let extractedProducts = [];

const logEl = document.getElementById('log');
const countEl = document.getElementById('product-count');
const btnDownload = document.getElementById('btn-download');

function log(msg) {
  const time = new Date().toLocaleTimeString();
  logEl.textContent = `[${time}] ${msg}\n` + logEl.textContent;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

document.getElementById('btn-extract-graphql').addEventListener('click', async () => {
  log("Iniciando extracción por GraphQL...");
  const tab = await getActiveTab();
  if (!tab || !tab.url.includes('shopify.com')) {
    log("⚠️ Error: Abre la extensión mientras estás en la pestaña de admin.shopify.com");
    return;
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: runGraphQLExtraction
    });

    if (results && results[0] && results[0].result) {
      const data = results[0].result;
      if (data.success && data.products && data.products.length > 0) {
        extractedProducts = data.products;
        countEl.textContent = extractedProducts.length;
        btnDownload.disabled = false;
        log(`✅ ¡ÉXITO! Se extrajeron ${extractedProducts.length} productos con todas sus variantes.`);
      } else {
        log(`⚠️ Respuesta de GraphQL: ${data.message || 'No se obtuvieron productos.'}`);
        log("Probando método REST...");
      }
    }
  } catch (err) {
    log(`❌ Error: ${err.message}`);
  }
});

document.getElementById('btn-extract-rest').addEventListener('click', async () => {
  log("Iniciando extracción por REST / JSON endpoints...");
  const tab = await getActiveTab();
  if (!tab) return;

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: runRESTExtraction
    });

    if (results && results[0] && results[0].result) {
      const data = results[0].result;
      if (data.success && data.products && data.products.length > 0) {
        extractedProducts = data.products;
        countEl.textContent = extractedProducts.length;
        btnDownload.disabled = false;
        log(`✅ ¡ÉXITO REST! Se extrajeron ${extractedProducts.length} productos.`);
      } else {
        log(`⚠️ REST falló: ${data.message || 'Sin productos'}`);
      }
    }
  } catch (err) {
    log(`❌ Error en REST: ${err.message}`);
  }
});

document.getElementById('btn-download').addEventListener('click', () => {
  if (!extractedProducts || extractedProducts.length === 0) {
    log("⚠️ No hay productos para descargar.");
    return;
  }

  const blob = new Blob([JSON.stringify(extractedProducts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shopify_mariela_pokka_products_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  log("💾 ¡Descarga iniciada! Guarda el archivo en la carpeta del proyecto.");
});

// Funcion que se ejecuta dentro del contexto de la pestaña de Shopify Admin
async function runGraphQLExtraction() {
  const storeMatch = window.location.pathname.match(/\/store\/([^/]+)/);
  const storeName = storeMatch ? storeMatch[1] : 'mariela-pokka';
  
  // Posibles endpoints internos de GraphQL en Shopify Admin
  const endpoints = [
    `/api/shopify/${storeName}`,
    `/store/${storeName}/api/graphql`,
    `/admin/api/unstable/graphql.json`,
    `/admin/api/2024-01/graphql.json`
  ];

  const query = `
    query FetchAllProducts($cursor: String) {
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

  // Buscar token CSRF si existe en el DOM
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;

  for (const endpoint of endpoints) {
    try {
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
          body: JSON.stringify({
            query,
            variables: { cursor }
          })
        });

        if (!res.ok) {
          break; // Probar siguiente endpoint
        }

        const json = await res.json();
        if (json.data && json.data.products && json.data.products.edges) {
          const edges = json.data.products.edges;
          const mapped = edges.map(e => e.node);
          allProducts = allProducts.concat(mapped);

          hasNextPage = json.data.products.pageInfo.hasNextPage;
          cursor = json.data.products.pageInfo.endCursor;
        } else {
          break;
        }
      }

      if (allProducts.length > 0) {
        return { success: true, count: allProducts.length, products: allProducts, endpointUsed: endpoint };
      }
    } catch (e) {
      console.warn("Fallo probando endpoint", endpoint, e);
    }
  }

  return { success: false, message: "Endpoints de GraphQL requirieron autenticacion adicional o no respondieron." };
}

// Funcion alternativa por REST
async function runRESTExtraction() {
  const storeMatch = window.location.pathname.match(/\/store\/([^/]+)/);
  const storeName = storeMatch ? storeMatch[1] : 'mariela-pokka';

  const urls = [
    `https://${storeName}.myshopify.com/products.json?limit=250`,
    `/products.json?limit=250`,
    `/admin/api/2024-01/products.json?limit=250`,
    `/store/${storeName}/products.json?limit=250`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          return { success: true, count: data.products.length, products: data.products, urlUsed: url };
        }
      }
    } catch (e) {
      console.warn("REST falló en", url, e);
    }
  }

  return { success: false, message: "No se pudo leer products.json directamente." };
}
