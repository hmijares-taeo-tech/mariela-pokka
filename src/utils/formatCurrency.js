/**
 * Currency Formatter Utility
 */

export function formatPrice(item, currency = 'EUR') {
  if (!item) return '';

  if (currency === 'USD') {
    const val = item.priceUSD || Math.round(item.priceEUR * 1.09);
    return `$${val.toLocaleString()}`;
  } else if (currency === 'GBP') {
    const val = item.priceGBP || Math.round(item.priceEUR * 0.86);
    return `£${val.toLocaleString()}`;
  } else {
    const val = item.priceEUR;
    return `€${val.toLocaleString()}`;
  }
}
