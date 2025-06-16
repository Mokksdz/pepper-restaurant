import type { MenuItem } from '../data/menuItems';

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export function getCart(): CartItem[] {
  const cartString = localStorage.getItem('pepperCart');
  if (!cartString) return [];
  try {
    return JSON.parse(cartString);
  } catch (e) {
    console.error('Erreur lors de la lecture du panier:', e);
    return [];
  }
}

export function addToCart(item: MenuItem, size: string = 'normal'): void {
  const cart = getCart();
  const price = size === 'normal' 
    ? item.prices.normal 
    : size === 'xl' 
      ? item.prices.xl 
      : item.prices.xxl;
  
  if (!price) return;
  
  const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.size === size);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      size,
      price,
      quantity: 1,
      image: item.image
    });
  }
  
  localStorage.setItem('pepperCart', JSON.stringify(cart));
}

export function removeFromCart(itemId: string, size: string): void {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId && item.size === size);
  
  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem('pepperCart', JSON.stringify(cart));
  }
}

export function getTotalPrice(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function clearCart(): void {
  localStorage.removeItem('pepperCart');
}
