export const AVAILABLE_CITIES = ['Trichy', 'Bengaluru', 'Mumbai', 'London', 'New York'];

export function getCurrencySymbol(city?: string): string {
  const c = (city || '').toLowerCase();
  if (['trichy', 'tiruchirappalli', 'bengaluru', 'mumbai', 'chennai'].includes(c)) {
    return '₹';
  }
  if (c === 'new york') {
    return '$';
  }
  return '£';
}

export function formatCurrency(amount: number, city?: string, forceDecimals = false): string {
  const symbol = getCurrencySymbol(city);
  const isInr = symbol === '₹';
  if (isInr && !forceDecimals && Number.isInteger(amount)) {
    return `${symbol}${amount}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}
