/**
 * Pakistani Rupee formatting used across the whole storefront.
 * Prices are stored as plain numbers (e.g. 2190) and shown as "Rs. 2,190".
 */
export const formatPrice = (amount) => {
  const value = Number(amount || 0);
  return `Rs. ${new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Math.round(value))}`;
};

export const formatPriceCalculation = (quantity, price) => {
  return (Number(quantity) * Number(price)).toFixed(2);
};

export const formatRevenue = (value) => {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + "B";
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + "K";
  } else {
    return value;
  }
};

/** Store-wide delivery rules, mirrored on the backend. */
export const FREE_DELIVERY_THRESHOLD = 3000;
export const DELIVERY_FEE = 199;

export const deliveryFeeFor = (subtotal) =>
  Number(subtotal) >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
