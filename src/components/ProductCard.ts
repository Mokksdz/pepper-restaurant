import { formatPrice } from '../utils/formatPrice';
import type { MenuItem } from '../data/menuItems';
import { addToCart, getCart } from '../utils/cart';
import { isFavorite, toggleFavorite, updateFavoritesCount } from '../utils/favorites';
import { getImageUrl } from '../utils/imageLoader';

export function ProductCard(item: MenuItem): HTMLElement {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-2xl shadow-md border border-gray-100 p-3 flex flex-col items-center gap-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative min-h-[320px]';
  
  // Ajouter les attributs d'animation
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', (Math.random() * 300).toString());
  
  // Vérifier si le produit est dans le panier
  const cart = getCart();
  const cartItem = cart.find(cartItem => cartItem.id === item.id && cartItem.size === 'normal' && !cartItem.isMenu);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  // Vérifier si le produit est dans les favoris
  const isFav = isFavorite(item.id);
  const imageSrc = getImageUrl(item.image);
  
  card.innerHTML = `
    <div class="relative w-full flex flex-col items-center">
      <a href="#product/${item.id}" class="block relative">
        <img src="${imageSrc}" alt="${item.name}" class="w-24 h-24 object-cover rounded-xl shadow mx-auto mb-2 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 border-2 border-white" loading="lazy" />
        ${quantity > 0 ? `<span class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">${quantity}</span>` : ''}
        ${item.isNew ? `<span class="absolute top-2 left-2 bg-green-500 text-white text-[11px] font-bold rounded-full px-2 py-0.5 shadow">Nouveau</span>` : ''}
        ${item.isBestSeller ? `<span class="absolute top-2 right-2 bg-pepper-orange text-white text-[11px] font-bold rounded-full px-2 py-0.5 shadow">Best Seller</span>` : ''}
      </a>
      <button class="favorite-btn absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:scale-110 active:scale-95 focus:ring-2 focus:ring-pepper-orange transition-all duration-200 ease-in-out ${isFav ? 'text-red-500' : 'text-gray-300'} hover:text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="confetti absolute -top-3 right-1 opacity-0 scale-75 pointer-events-none select-none transition-all duration-300 z-30">🎉</span>
      </button>
    </div>
    <a href="#product/${item.id}" class="block hover:text-pepper-orange transition-colors">
      <h3 class="font-semibold text-center text-base md:text-lg mt-1 mb-0.5">${item.name}</h3>
    </a>
    <p class="text-xs text-gray-500 text-center line-clamp-2 min-h-[32px] mb-1">${item.description || '&nbsp;'}</p>
    
    <div class="flex flex-wrap justify-center gap-2 mb-3">
      ${item.prices.normal ? 
        `<div class="price-option cursor-pointer select-none bg-pepper-orange/10 text-pepper-orange font-extrabold text-lg px-3 py-1 rounded-lg shadow hover:bg-pepper-orange/20 transition-all" data-size="normal" data-price="${item.prices.normal}">
          <span>${formatPrice(item.prices.normal)}</span>
        </div>` : ''}
      ${item.prices.xl ? 
        `<div class="price-option cursor-pointer select-none bg-pepper-orange/10 text-pepper-orange font-extrabold text-lg px-3 py-1 rounded-lg shadow hover:bg-pepper-orange/20 transition-all" data-size="xl" data-price="${item.prices.xl}">
          <span>XL: ${formatPrice(item.prices.xl)}</span>
        </div>` : ''}
      ${item.prices.xxl ? 
        `<div class="price-option cursor-pointer select-none bg-pepper-orange/10 text-pepper-orange font-extrabold text-lg px-3 py-1 rounded-lg shadow hover:bg-pepper-orange/20 transition-all" data-size="xxl" data-price="${item.prices.xxl}">
          <span>XXL: ${formatPrice(item.prices.xxl)}</span>
        </div>` : ''}
    </div>
    
    ${(item.category === 'Burgers' || item.category === 'Sandwichs orientaux') ? 
      `<div class="menu-option w-full mb-3 p-2 border border-gray-200 rounded-lg">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="menu-checkbox" />
          <span class="text-sm text-gray-700">
            <span class="font-semibold text-pepper-orange">Menu:</span> + Frite + Boisson 
            <span class="font-bold text-pepper-orange">(+350 DA)</span>
          </span>
        </label>
      </div>` : ''}
    
    <div class="flex items-center justify-center gap-3 w-full mt-2 relative">
      <button class="decrement-btn bg-gray-100 hover:bg-pepper-orange/20 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:ring-2 focus:ring-pepper-orange ${quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
        <span class="text-xl">-</span>
      </button>
      <span class="quantity-display w-10 text-center font-semibold text-lg">${quantity}</span>
      <button class="increment-btn bg-pepper-orange hover:bg-black hover:text-pepper-orange text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:ring-2 focus:ring-pepper-orange">
        <span class="text-xl">+</span>
      </button>
      <span class="added-feedback pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 opacity-0 scale-90 select-none px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow transition-all duration-300 z-20">Ajouté !</span>
    </div>
  `;
  
  // Ajouter le débogage des images après la création du DOM
  const imgElement = card.querySelector('img') as HTMLImageElement;
  if (imgElement) {
    // TEMPORAIREMENT DÉSACTIVÉ - Le debug causait un clignotement des images
    // debugImageLoad(imageSrc, imgElement);
    console.log('🖼️ Debug d\'image temporairement désactivé pour:', imageSrc);
  }
  
  // Ajouter les écouteurs d'événements
  const incrementBtn = card.querySelector('.increment-btn');
  const decrementBtn = card.querySelector('.decrement-btn');
  const quantityDisplay = card.querySelector('.quantity-display');
  const priceOptions = card.querySelectorAll('.price-option');
  const favoriteBtn = card.querySelector('.favorite-btn');
  const menuCheckbox = card.querySelector('.menu-checkbox') as HTMLInputElement;
  
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
      // Mettre à jour la quantité affichée
      updateQuantityDisplay();
    });
  });
  
  // Ajouter un écouteur pour la checkbox menu
  if (menuCheckbox) {
    menuCheckbox.addEventListener('change', () => {
      updateQuantityDisplay();
    });
  }
  
  // Fonction pour mettre à jour l'affichage de la quantité
  function updateQuantityDisplay() {
    const selectedOption = card.querySelector('.price-option.selected') as HTMLElement;
    const size = selectedOption?.dataset.size || 'normal';
    const isMenu = menuCheckbox?.checked || false;
    const updatedCart = getCart();
    const updatedItem = updatedCart.find(cartItem => 
      cartItem.id === item.id && 
      cartItem.size === size && 
      cartItem.isMenu === isMenu
    );
    const currentQuantity = updatedItem ? updatedItem.quantity : 0;
    if (quantityDisplay) {
      quantityDisplay.textContent = String(currentQuantity);
    }
    // Mettre à jour l'état du bouton de décrémentation
    if (decrementBtn) {
      if (currentQuantity === 0) {
        decrementBtn.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        decrementBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }
  
  // Gérer l'incrémentation
  incrementBtn?.addEventListener('click', () => {
    const selectedOption = card.querySelector('.price-option.selected') as HTMLElement;
    const size = selectedOption?.dataset.size || 'normal';
    const isMenu = menuCheckbox?.checked || false;
    addToCart(item, size, isMenu);
    updateQuantityDisplay();
    // Mise à jour du compteur dans l'en-tête
    updateCartCounter();
    // Feedback visuel "Ajouté !"
    const feedback = card.querySelector('.added-feedback') as HTMLElement;
    if (feedback) {
      feedback.classList.remove('opacity-0', 'scale-90', '-translate-y-2');
      feedback.classList.add('opacity-100', 'scale-105', '-translate-y-2');
      setTimeout(() => {
        feedback.classList.remove('opacity-100', 'scale-105', '-translate-y-2');
        feedback.classList.add('opacity-0', 'scale-90');
      }, 900);
    }
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
      // Animation confetti 🎉
      const confetti = favoriteBtn.querySelector('.confetti') as HTMLElement;
      if (confetti) {
        confetti.classList.remove('opacity-0', 'scale-75', '-translate-y-2');
        confetti.classList.add('opacity-100', 'scale-110', '-translate-y-2');
        setTimeout(() => {
          confetti.classList.remove('opacity-100', 'scale-110', '-translate-y-2');
          confetti.classList.add('opacity-0', 'scale-75');
        }, 800);
      }
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
    const isMenu = menuCheckbox?.checked || false;
    removeFromCart(item.id, size, isMenu);
    updateQuantityDisplay();
    // Mise à jour du compteur dans l'en-tête
    updateCartCounter();
  });
  
  return card;
}

function removeFromCart(itemId: string, size: string, isMenu: boolean = false): void {
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

function updateCartCounter(): void {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartCounter = document.getElementById('cart-counter');
  if (cartCounter) {
    cartCounter.textContent = totalItems.toString();
    cartCounter.classList.toggle('hidden', totalItems === 0);
  }
}
