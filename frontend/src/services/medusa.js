/**
 * Medusa.js v2 Storefront API Client for Mariela Pokka
 * Includes Catalog, Collections, Cart, Region Pricing, Inventory, and Stripe Checkout hooks
 */

const MEDUSA_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:9000');
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_6be3221614edad88fef2bcafcf33e7314e29efa3f3c20519c0db55c240c437f4';
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const DEFAULT_EUR_REGION_ID = 'reg_01M5JF7HHTYV4NZ84W373EKARQ';

const defaultHeaders = {
  'x-publishable-api-key': PUBLISHABLE_KEY,
  'Content-Type': 'application/json'
};

let cachedProductsPromise = null;

// 1. Fetch Official Collections from Medusa
export async function fetchMedusaCollections() {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/collections`, { headers: defaultHeaders });
    if (!res.ok) return [];
    const data = await res.json();
    return data.collections || [];
  } catch (e) {
    console.warn("Could not fetch Medusa collections:", e);
    return [];
  }
}

// 2. Fetch Products with Variants, Calculated Prices, Inventory, Images and Options
export async function fetchMedusaProducts() {
  if (cachedProductsPromise) {
    return cachedProductsPromise;
  }

  cachedProductsPromise = (async () => {
    try {
      let regionId = DEFAULT_EUR_REGION_ID;
      try {
        const regRes = await fetch(`${MEDUSA_URL}/store/regions`, { headers: defaultHeaders });
        if (regRes.ok) {
          const regData = await regRes.json();
          const eurRegion = (regData.regions || []).find(
            (r) => (r.currency_code || '').toLowerCase() === 'eur'
          ) || (regData.regions || [])[0];
          if (eurRegion?.id) regionId = eurRegion.id;
        }
      } catch (_) {
        // Use default regionId fallback
      }

      const url = `${MEDUSA_URL}/store/products?limit=150&region_id=${regionId}&fields=*variants,*variants.calculated_price,+variants.inventory_quantity,*options,*images,*collection`;
      const res = await fetch(url, { headers: defaultHeaders });

      if (!res.ok) {
        throw new Error(`Medusa API responded with ${res.status}`);
      }

      const data = await res.json();
      if (!data.products || data.products.length === 0) {
        return [];
      }

      return data.products.map(transformMedusaProduct);
    } catch (err) {
      cachedProductsPromise = null;
      console.warn("⚠️ Could not fetch from live Medusa backend, checking fallback:", err);
      return [];
    }
  })();

  return cachedProductsPromise;
}

// 3. Cart & Checkout Operations
export async function createMedusaCart(currencyCode = 'eur') {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({
        currency_code: currencyCode.toLowerCase()
      })
    });
    if (!res.ok) throw new Error("Could not create cart");
    const data = await res.json();
    return data.cart;
  } catch (e) {
    console.error("Cart creation failed:", e);
    return null;
  }
}

export async function addLineItemToCart(cartId, variantId, quantity = 1) {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({
        variant_id: variantId,
        quantity
      })
    });
    if (!res.ok) throw new Error("Could not add line item");
    const data = await res.json();
    return data.cart;
  } catch (e) {
    console.error("Adding line item failed:", e);
    return null;
  }
}

// 4. Stripe Payment Readiness Check
export function isStripeConfigured() {
  return Boolean(STRIPE_PK);
}

// Normalize color names for clean filtering in the Boutique
function normalizeColorLabel(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s || s.toLowerCase() === 'default title' || /^[0-9]+$/.test(s)) return null;
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Transform raw Medusa product to Storefront schema
export function transformMedusaProduct(p) {
  const titleLower = (p.title || '').toLowerCase();
  const colHandle = p.collection?.handle || '';

  let category = colHandle || 'outerwear';
  let categoryLabel = p.collection?.title || 'Trenches & Outerwear';

  if (!colHandle) {
    if (titleLower.includes('trench') || titleLower.includes('coat') || titleLower.includes('vest')) {
      category = 'outerwear';
      categoryLabel = 'Trenches & Outerwear';
    } else if (titleLower.includes('dress') || titleLower.includes('skirt')) {
      category = 'dresses';
      categoryLabel = 'Dresses & Skirts';
    } else if (titleLower.includes('jacket') || titleLower.includes('blazer') || titleLower.includes('suit') || titleLower.includes('smoking')) {
      category = 'jackets';
      categoryLabel = 'Tailored Jackets & Suits';
    } else if (titleLower.includes('pant') || titleLower.includes('short') || titleLower.includes('bermuda') || titleLower.includes('legging')) {
      category = 'pants';
      categoryLabel = 'Pants, Shorts & Bermudas';
    } else if (titleLower.includes('shirt') || titleLower.includes('blouse') || titleLower.includes('top')) {
      category = 'blouses';
      categoryLabel = 'Blouses, Shirts & Tops';
    } else if (titleLower.includes('glove') || titleLower.includes('belt') || titleLower.includes('collar') || titleLower.includes('bag')) {
      category = 'accessories';
      categoryLabel = 'Accessories & Fine Leather Goods';
    }
  }

  const gallery = (p.images || []).map((img) => img.url).filter(Boolean);
  const mainImage = p.thumbnail || gallery[0] || '/images/hero-model-red.jpg';

  const sizeOption = (p.options || []).find((o) => (o.title || '').toLowerCase() === 'size');
  const rawSizes = sizeOption?.values?.map((v) => String(v.value).trim()).filter(Boolean) || [];
  const sizes = [...new Set(rawSizes)];

  const colorOption = (p.options || []).find((o) => (o.title || '').toLowerCase() === 'color');
  const rawColors = (colorOption?.values || [])
    .map((v) => normalizeColorLabel(v.value))
    .filter(Boolean);
  const colors = [...new Set(rawColors)];

  // Calculate real price and real stock across variants
  const variants = p.variants || [];
  let totalStock = 0;
  const validPrices = [];

  for (const v of variants) {
    const qty = typeof v.inventory_quantity === 'number' ? v.inventory_quantity : 0;
    if (qty > 0) totalStock += qty;

    const calcAmt = v.calculated_price?.calculated_amount;
    if (typeof calcAmt === 'number' && calcAmt > 0) {
      validPrices.push(calcAmt);
    } else if (Array.isArray(v.prices)) {
      const eurPrice = v.prices.find((pr) => (pr.currency_code || '').toLowerCase() === 'eur');
      if (eurPrice?.amount) validPrices.push(eurPrice.amount);
    }
  }

  // Prefer prices > 100 EUR (since 100/10 in the original CSV were placeholder variant prices)
  const realPricesAbovePlaceholder = validPrices.filter((amt) => amt > 100);
  let priceEUR = 1290;
  if (realPricesAbovePlaceholder.length > 0) {
    priceEUR = Math.min(...realPricesAbovePlaceholder);
  } else if (validPrices.length > 0) {
    const maxFound = Math.max(...validPrices);
    if (maxFound > 100) {
      priceEUR = maxFound;
    } else {
      // Category-appropriate luxury price when CSV had placeholder 100
      const categoryDefaults = {
        outerwear: 2450,
        jackets: 1690,
        dresses: 1490,
        pants: 1190,
        blouses: 980,
        accessories: 490
      };
      priceEUR = categoryDefaults[category] || 1390;
    }
  }

  const cleanDescription = (p.description || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tagline = cleanDescription
    ? cleanDescription.split('.').slice(0, 1).join('.') + '.'
    : 'Handcrafted in Finnish Lapland from ethical 0.6mm Arctic reindeer leather.';

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    tagline,
    description: cleanDescription || 'Handcrafted in Finnish Lapland from the finest ethical Arctic reindeer leather.',
    category,
    categoryLabel,
    collectionTitle: p.collection?.title || categoryLabel,
    priceEUR,
    priceUSD: Math.round(priceEUR * 1.09),
    priceGBP: Math.round(priceEUR * 0.86),
    image: mainImage,
    secondImage: gallery[1] || null,
    gallery: gallery.length > 0 ? gallery : [mainImage],
    sizes: sizes.length > 0 ? sizes : ['36', '38', '40', '42'],
    availableColors: colors.length > 0 ? colors : ['Black'],
    totalStock,
    inStock: totalStock > 0,
    badge: totalStock > 0
      ? 'Ready to Ship'
      : titleLower.includes('limited')
      ? 'Limited Edition'
      : 'Arctic Couture',
    details: [
      '100% Ethical Arctic Reindeer Leather (0.6mm Silk of the North)',
      'Handcrafted at our Rovaniemi Atelier (66°33′ N, Finland)',
      totalStock > 0
        ? `Immediate Dispatch Available (${totalStock} ${totalStock === 1 ? 'piece' : 'pieces'} in atelier vault)`
        : 'Made-to-Order in Lapland • Complimentary Worldwide Courier'
    ],
    rawVariants: variants
  };
}
