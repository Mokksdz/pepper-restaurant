import type { MenuItem } from '../data/menuItems';

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  isMenu?: boolean;
  menuPrice?: number;
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

export function addToCart(item: MenuItem, size: string = 'normal', isMenu: boolean = false): void {
  const cart = getCart();
  const basePrice = size === 'normal' 
    ? item.prices.normal 
    : size === 'xl' 
      ? item.prices.xl 
      : item.prices.xxl;
  
  if (!basePrice) return;
  
  const finalPrice = isMenu ? basePrice + 350 : basePrice;
  const itemKey = `${item.id}-${size}-${isMenu ? 'menu' : 'solo'}`;
  
  const existingItem = cart.find(cartItem => 
    cartItem.id === item.id && 
    cartItem.size === size && 
    cartItem.isMenu === isMenu
  );
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: isMenu ? `${item.name} (Menu)` : item.name,
      size,
      price: finalPrice,
      quantity: 1,
      image: item.image,
      isMenu,
      menuPrice: isMenu ? 350 : undefined
    });
  }
  
  localStorage.setItem('pepperCart', JSON.stringify(cart));
}

export function removeFromCart(itemId: string, size: string, isMenu: boolean = false): void {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => 
    item.id === itemId && 
    item.size === size && 
    item.isMenu === isMenu
  );
  
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
