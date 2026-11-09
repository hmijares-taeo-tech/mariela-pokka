/**
 * Medusa.js v2 Storefront API Client for Mariela Pokka
 * Includes Catalog, Collections, Cart, and Stripe Checkout hooks
 */

const MEDUSA_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:9000');
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_6be3221614edad88fef2bcafcf33e7314e29efa3f3c20519c0db55c240c437f4';
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

const defaultHeaders = {
  'x-publishable-api-key': PUBLISHABLE_KEY,
  'Content-Type': 'application/json'
};

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

// 2. Fetch Products with Variants, Images and Options
export async function fetchMedusaProducts() {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/products?limit=150&fields=*variants,*options,*images,*collection`, {
      headers: defaultHeaders
    });

    if (!res.ok) {
      throw new Error(`Medusa API responded with ${res.status}`);
    }

    const data = await res.json();
    if (!data.products || data.products.length === 0) {
      return [];
    }

    return data.products.map(transformMedusaProduct);
  } catch (err) {
    console.warn("⚠️ Could not fetch from live Medusa backend, checking fallback:", err);
    return [];
  }
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

// Transform raw Medusa product to Storefront schema
export function transformMedusaProduct(p) {
  const titleLower = (p.title || '').toLowerCase();
  const colHandle = p.collection?.handle || '';
  
  let category = colHandle || 'outerwear';
  let categoryLabel = p.collection?.title || 'Outerwear & Trench';
  
  if (!colHandle) {
    if (titleLower.includes('dress') || titleLower.includes('skirt')) {
      category = 'dresses';
      categoryLabel = 'Dresses & Skirts';
    } else if (titleLower.includes('jacket') || titleLower.includes('blazer') || titleLower.includes('suit')) {
      category = 'jackets';
      categoryLabel = 'Tailored Jackets';
    } else if (titleLower.includes('pant') || titleLower.includes('short') || titleLower.includes('bermuda')) {
      category = 'pants';
      categoryLabel = 'Trousers & Shorts';
    } else if (titleLower.includes('glove') || titleLower.includes('belt') || titleLower.includes('collar')) {
      category = 'accessories';
      categoryLabel = 'Accessories & Gloves';
    }
  }

  const gallery = (p.images || []).map(img => img.url).filter(Boolean);
  const mainImage = p.thumbnail || gallery[0] || '/images/hero-model-red.jpg';

  const sizeOption = (p.options || []).find(o => (o.title || '').toLowerCase() === 'size');
  const sizes = sizeOption?.values?.map(v => v.value) || ['36', '38', '40', '42'];

  const colorOption = (p.options || []).find(o => (o.title || '').toLowerCase() === 'color');
  const colors = colorOption?.values?.map(v => v.value) || ['Noir Arctic', 'Lapland Blue'];

  let minPriceEur = 1200;
  if (p.variants && p.variants.length > 0) {
    const firstVariantPrices = p.variants[0].prices || [];
    const eurPrice = firstVariantPrices.find(pr => (pr.currency_code || '').toLowerCase() === 'eur');
    if (eurPrice && eurPrice.amount) {
      minPriceEur = eurPrice.amount;
    }
  }

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description || '',
    category,
    categoryLabel,
    collectionTitle: p.collection?.title,
    priceEUR: minPriceEur,
    priceUSD: Math.round(minPriceEur * 1.09),
    priceGBP: Math.round(minPriceEur * 0.86),
    image: mainImage,
    gallery: gallery.length > 0 ? gallery : [mainImage],
    sizes: sizes.length > 0 ? sizes : ['36', '38', '40', '42'],
    availableColors: colors.length > 0 ? colors : ['Black'],
    badge: titleLower.includes('limited') ? 'Limited Edition' : 'Arctic Couture',
    rawVariants: p.variants || []
  };
}
