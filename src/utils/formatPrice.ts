export function formatPrice(price: number): string {
  return price.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD', minimumFractionDigits: 0 }).replace('DZD', 'DA');
}

