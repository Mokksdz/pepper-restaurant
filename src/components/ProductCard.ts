import { formatPrice } from '../utils/formatPrice';
import type { MenuItem } from '../data/menuItems';
import { addToCart, getCart } from '../utils/cart';
import { isFavorite, toggleFavorite, updateFavoritesCount } from '../utils/favorites';

export function ProductCard(item: MenuItem): HTMLElement {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 hover:shadow-md transition';
  
  // Ajouter les attributs d'animation
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', (Math.random() * 300).toString());
  
  // Vérifier si le produit est dans le panier
  const cart = getCart();
  const cartItem = cart.find(cartItem => cartItem.id === item.id && cartItem.size === 'normal');
  const quantity = cartItem ? cartItem.quantity : 0;
  
  // Vérifier si le produit est dans les favoris
  const isFav = isFavorite(item.id);
  
  card.innerHTML = `
    <div class="relative w-full">
      <a href="#product/${item.id}" class="block">
        <img src="${item.image}" alt="${item.name}" class="w-28 h-28 object-cover rounded-full mx-auto mb-3 hover:scale-105 transition-transform duration-300" loading="lazy" />
        ${quantity > 0 ? `<span class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${quantity}</span>` : ''}
      </a>
      <button class="favorite-btn absolute top-0 right-0 ${isFav ? 'text-red-500' : 'text-gray-300'} hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
    <a href="#product/${item.id}" class="block hover:text-pepper-orange transition-colors">
      <h3 class="font-semibold text-center">${item.name}</h3>
    </a>
    <p class="text-xs text-gray-500 text-center line-clamp-2 h-8">${item.description || '&nbsp;'}</p>
    
    <div class="flex flex-wrap justify-center gap-2 text-pepper-orange font-bold text-base mb-3">
      ${item.prices.normal ? 
        `<div class="price-option" data-size="normal" data-price="${item.prices.normal}">
          <span>${formatPrice(item.prices.normal)}</span>
        </div>` : ''}
      ${item.prices.xl ? 
        `<div class="price-option" data-size="xl" data-price="${item.prices.xl}">
          <span>XL: ${formatPrice(item.prices.xl)}</span>
        </div>` : ''}
      ${item.prices.xxl ? 
        `<div class="price-option" data-size="xxl" data-price="${item.prices.xxl}">
          <span>XXL: ${formatPrice(item.prices.xxl)}</span>
        </div>` : ''}
    </div>
    
    <div class="flex items-center justify-center gap-2 w-full">
      <button class="decrement-btn bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors ${quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
        -
      </button>
      <span class="quantity-display w-8 text-center font-semibold">${quantity}</span>
      <button class="increment-btn bg-pepper-orange hover:bg-black text-white font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors">
        +
      </button>
    </div>
  `;
  
  // Ajouter les écouteurs d'événements
  const incrementBtn = card.querySelector('.increment-btn');
  const decrementBtn = card.querySelector('.decrement-btn');
  const quantityDisplay = card.querySelector('.quantity-display');
  const priceOptions = card.querySelectorAll('.price-option');
  const favoriteBtn = card.querySelector('.favorite-btn');
  
  // Sélectionner la taille par défaut
  if (priceOptions.length > 0) {
    priceOptions[0].classList.add('selected', 'ring-2', 'ring-pepper-orange', 'rounded', 'px-2', 'py-1');
  }
  
  // Ajouter des écouteurs pour les options de prix/taille
  priceOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Retirer la sélection actuelle
      priceOptions.forEach(opt => opt.classList.remove('selected', 'ring-2', 'ring-pepper-orange', 'rounded', 'px-2', 'py-1'));
      // Ajouter la nouvelle sélection
      option.classList.add('selected', 'ring-2', 'ring-pepper-orange', 'rounded', 'px-2', 'py-1');
    });
  });
  
  // Gérer l'incrémentation
  incrementBtn?.addEventListener('click', () => {
    const selectedOption = card.querySelector('.price-option.selected') as HTMLElement;
    const size = selectedOption?.dataset.size || 'normal';
    addToCart(item, size);
    if (quantityDisplay) {
      const updatedCart = getCart();
      const updatedItem = updatedCart.find(cartItem => cartItem.id === item.id && cartItem.size === size);
      quantityDisplay.textContent = updatedItem ? String(updatedItem.quantity) : '0';
    }
    if (decrementBtn && quantity === 0) {
      decrementBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    // Mise à jour du compteur dans l'en-tête
    updateCartCounter();
  });
  
  // Gérer les favoris
  favoriteBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorited = toggleFavorite(item.id);
    const heartIcon = favoriteBtn.querySelector('svg');
    
    if (isFavorited) {
      favoriteBtn.classList.add('text-red-500');
      favoriteBtn.classList.remove('text-gray-300');
      if (heartIcon) heartIcon.setAttribute('fill', 'currentColor');
    } else {
      favoriteBtn.classList.add('text-gray-300');
      favoriteBtn.classList.remove('text-red-500');
      if (heartIcon) heartIcon.setAttribute('fill', 'none');
    }
    
    // Mettre à jour le compteur de favoris dans le header
    updateFavoritesCount();
  });
  
  // Gérer la décrémentation
  decrementBtn?.addEventListener('click', () => {
    if (quantity === 0) return;
    
    const selectedOption = card.querySelector('.price-option.selected') as HTMLElement;
    const size = selectedOption?.dataset.size || 'normal';
    removeFromCart(item.id, size);
    if (quantityDisplay) {
      const updatedCart = getCart();
      const updatedItem = updatedCart.find(cartItem => cartItem.id === item.id && cartItem.size === size);
      const newQuantity = updatedItem ? updatedItem.quantity : 0;
      quantityDisplay.textContent = String(newQuantity);
      
      if (newQuantity === 0 && decrementBtn) {
        decrementBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }
    // Mise à jour du compteur dans l'en-tête
    updateCartCounter();
  });
  
  return card;
}

function removeFromCart(itemId: string, size: string): void {
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

function updateCartCounter(): void {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartCounter = document.getElementById('cart-counter');
  if (cartCounter) {
    cartCounter.textContent = totalItems.toString();
    cartCounter.classList.toggle('hidden', totalItems === 0);
  }
}

