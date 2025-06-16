import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { menuItems } from '../data/menuItems';
import { formatPrice } from '../utils/formatPrice';
import { addToCart, getCart } from '../utils/cart';
import { isFavorite, toggleFavorite, updateFavoritesCount } from '../utils/favorites';

export function renderProduct(productId: string) {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  // Trouver le produit par son ID
  const product = menuItems.find(item => item.id === productId);
  
  if (!product) {
    // Si le produit n'existe pas, afficher un message d'erreur
    const errorMain = document.createElement('main');
    errorMain.className = 'py-14 px-4 max-w-4xl mx-auto text-center';
    errorMain.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-sm" data-aos="fade-up">
        <h1 class="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <p class="text-gray-500 mb-6">Le produit que vous recherchez n'existe pas.</p>
        <a href="#menu" class="bg-pepper-orange text-white px-6 py-2 rounded-full inline-block hover:bg-black transition">Retour au menu</a>
      </div>
    `;
    app.appendChild(errorMain);
  } else {
    // Récupérer l'état du panier pour ce produit
    const cart = getCart();
    const normalItem = cart.find(item => item.id === product.id && item.size === 'normal');
    const xlItem = cart.find(item => item.id === product.id && item.size === 'xl');
    const xxlItem = cart.find(item => item.id === product.id && item.size === 'xxl');
    
    const normalQuantity = normalItem ? normalItem.quantity : 0;
    const xlQuantity = xlItem ? xlItem.quantity : 0;
    const xxlQuantity = xxlItem ? xxlItem.quantity : 0;
    
    // Vérifier si le produit est dans les favoris
    const isProductFavorite = isFavorite(product.id);

    // Créer la page détaillée du produit
    const main = document.createElement('main');
    main.className = 'py-10 px-4 max-w-6xl mx-auto';

    const productSection = document.createElement('section');
    productSection.className = 'bg-white rounded-xl shadow-sm overflow-hidden';
    
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'bg-gray-50 px-6 py-3 text-sm';
    breadcrumb.innerHTML = `
      <a href="#" class="text-gray-500 hover:text-pepper-orange">Accueil</a>
      <span class="mx-2 text-gray-400">/</span>
      <a href="#menu" class="text-gray-500 hover:text-pepper-orange">Menu</a>
      <span class="mx-2 text-gray-400">/</span>
      <span class="text-gray-700">${product.name}</span>
    `;
    breadcrumb.setAttribute('data-aos', 'fade-down');
    breadcrumb.setAttribute('data-aos-duration', '500');
    
    const productContent = document.createElement('div');
    productContent.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 p-6';
    
    // Image du produit
    const imageContainer = document.createElement('div');
    imageContainer.className = 'flex items-center justify-center p-4';
    imageContainer.innerHTML = `
      <div class="relative" data-aos="fade-right" data-aos-duration="800">
        <img src="${product.image}" alt="${product.name}" class="w-64 h-64 object-cover rounded-full shadow-lg" />
        ${product.category === 'Burgers' ? 
          `<div class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full px-3 py-1 uppercase tracking-wide">
            ${product.id === 'pepper-smash' ? 'New' : 'Burger'}
          </div>` : ''}
      </div>
    `;
    
    // Détails du produit
    const productDetails = document.createElement('div');
    productDetails.className = 'flex flex-col';
    productDetails.setAttribute('data-aos', 'fade-left');
    productDetails.setAttribute('data-aos-duration', '800');
    
    productDetails.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h1 class="text-3xl font-bold text-black">${product.name}</h1>
        <button id="favorite-btn" class="${isProductFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="${isProductFavorite ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <p class="text-gray-600 mb-6">${product.description}</p>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Tailles disponibles</h3>
        <div class="flex flex-wrap gap-4">
          ${product.prices.normal ? 
            `<div class="flex flex-col items-center">
              <div class="text-lg font-bold text-pepper-orange">${formatPrice(product.prices.normal)}</div>
              <div class="text-sm text-gray-500">Normal</div>
            </div>` : ''}
          
          ${product.prices.xl ? 
            `<div class="flex flex-col items-center">
              <div class="text-lg font-bold text-pepper-orange">${formatPrice(product.prices.xl)}</div>
              <div class="text-sm text-gray-500">XL</div>
            </div>` : ''}
          
          ${product.prices.xxl ? 
            `<div class="flex flex-col items-center">
              <div class="text-lg font-bold text-pepper-orange">${formatPrice(product.prices.xxl)}</div>
              <div class="text-sm text-gray-500">XXL</div>
            </div>` : ''}
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Ajouter au panier</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${product.prices.normal ? 
            `<div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
              <div class="font-medium mb-2">Normal</div>
              <div class="flex items-center gap-3">
                <button id="decrement-normal" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">-</button>
                <span id="quantity-normal" class="font-semibold">${normalQuantity}</span>
                <button id="increment-normal" class="w-8 h-8 rounded-full bg-pepper-orange text-white flex items-center justify-center hover:bg-black transition">+</button>
              </div>
            </div>` : ''}
          
          ${product.prices.xl ? 
            `<div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
              <div class="font-medium mb-2">XL</div>
              <div class="flex items-center gap-3">
                <button id="decrement-xl" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">-</button>
                <span id="quantity-xl" class="font-semibold">${xlQuantity}</span>
                <button id="increment-xl" class="w-8 h-8 rounded-full bg-pepper-orange text-white flex items-center justify-center hover:bg-black transition">+</button>
              </div>
            </div>` : ''}
          
          ${product.prices.xxl ? 
            `<div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
              <div class="font-medium mb-2">XXL</div>
              <div class="flex items-center gap-3">
                <button id="decrement-xxl" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">-</button>
                <span id="quantity-xxl" class="font-semibold">${xxlQuantity}</span>
                <button id="increment-xxl" class="w-8 h-8 rounded-full bg-pepper-orange text-white flex items-center justify-center hover:bg-black transition">+</button>
              </div>
            </div>` : ''}
        </div>
      </div>
      
      <div class="mt-auto flex gap-4">
        <a href="#menu" class="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition">
          Retour au menu
        </a>
        <a href="#commander" class="px-6 py-2 bg-pepper-orange text-white rounded-full hover:bg-black transition">
          Commander
        </a>
      </div>
    `;
    
    productContent.appendChild(imageContainer);
    productContent.appendChild(productDetails);
    
    productSection.appendChild(breadcrumb);
    productSection.appendChild(productContent);
    
    // Suggestions de produits similaires
    const suggestionsSection = document.createElement('section');
    suggestionsSection.className = 'mt-12';
    suggestionsSection.setAttribute('data-aos', 'fade-up');
    suggestionsSection.setAttribute('data-aos-delay', '200');
    
    const suggestionsTitle = document.createElement('h2');
    suggestionsTitle.className = 'text-2xl font-bold mb-6 text-black';
    suggestionsTitle.textContent = 'Vous pourriez aussi aimer';
    
    const suggestionsGrid = document.createElement('div');
    suggestionsGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-6';
    
    // Trouver des produits de la même catégorie
    const similarProducts = menuItems
      .filter(item => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
    
    similarProducts.forEach(item => {
      const card = document.createElement('a');
      card.href = `#product/${item.id}`;
      card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 hover:shadow-md transition';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', Math.floor(Math.random() * 300).toString());
      
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-full" />
        <h3 class="font-medium text-center">${item.name}</h3>
        <div class="text-pepper-orange font-semibold">${formatPrice(item.prices.normal || 0)}</div>
      `;
      
      suggestionsGrid.appendChild(card);
    });
    
    suggestionsSection.appendChild(suggestionsTitle);
    suggestionsSection.appendChild(suggestionsGrid);
    
    main.appendChild(productSection);
    main.appendChild(suggestionsSection);
    app.appendChild(main);
    
    // Ajouter les écouteurs d'événements pour les boutons d'incrémentation/décrémentation et favoris
    setTimeout(() => {
      // Bouton favoris
      const favoriteBtn = document.getElementById('favorite-btn');
      favoriteBtn?.addEventListener('click', () => {
        const isFav = toggleFavorite(product.id);
        
        // Mettre à jour l'apparence du bouton
        if (favoriteBtn instanceof HTMLElement) {
          const heartIcon = favoriteBtn.querySelector('svg');
          
          if (isFav) {
            favoriteBtn.classList.add('text-red-500');
            favoriteBtn.classList.remove('text-gray-400');
            if (heartIcon) heartIcon.setAttribute('fill', 'currentColor');
          } else {
            favoriteBtn.classList.add('text-gray-400');
            favoriteBtn.classList.remove('text-red-500');
            if (heartIcon) heartIcon.setAttribute('fill', 'none');
          }
        }
        
        // Mettre à jour le compteur dans le header
        updateFavoritesCount();
      });
      
      if (product.prices.normal) {
        const decrementNormal = document.getElementById('decrement-normal');
        const incrementNormal = document.getElementById('increment-normal');
        const quantityNormal = document.getElementById('quantity-normal');
        
        decrementNormal?.addEventListener('click', () => {
          if (normalQuantity > 0) {
            removeFromCart(product.id, 'normal');
            window.location.hash = `#product/${product.id}`;
          }
        });
        
        incrementNormal?.addEventListener('click', () => {
          addToCart(product, 'normal');
          window.location.hash = `#product/${product.id}`;
        });
      }
      
      if (product.prices.xl) {
        const decrementXl = document.getElementById('decrement-xl');
        const incrementXl = document.getElementById('increment-xl');
        const quantityXl = document.getElementById('quantity-xl');
        
        decrementXl?.addEventListener('click', () => {
          if (xlQuantity > 0) {
            removeFromCart(product.id, 'xl');
            window.location.hash = `#product/${product.id}`;
          }
        });
        
        incrementXl?.addEventListener('click', () => {
          addToCart(product, 'xl');
          window.location.hash = `#product/${product.id}`;
        });
      }
      
      if (product.prices.xxl) {
        const decrementXxl = document.getElementById('decrement-xxl');
        const incrementXxl = document.getElementById('increment-xxl');
        const quantityXxl = document.getElementById('quantity-xxl');
        
        decrementXxl?.addEventListener('click', () => {
          if (xxlQuantity > 0) {
            removeFromCart(product.id, 'xxl');
            window.location.hash = `#product/${product.id}`;
          }
        });
        
        incrementXxl?.addEventListener('click', () => {
          addToCart(product, 'xxl');
          window.location.hash = `#product/${product.id}`;
        });
      }
    }, 100);
  }
  
  app.appendChild(Footer());
}

function removeFromCart(itemId: string, size: string): void {
  // Récupérer le panier actuel
  const cartString = localStorage.getItem('pepperCart');
  if (!cartString) return;
  
  try {
    const cart = JSON.parse(cartString);
    const itemIndex = cart.findIndex((item: any) => item.id === itemId && item.size === size);
    
    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
      localStorage.setItem('pepperCart', JSON.stringify(cart));
    }
  } catch (e) {
    console.error('Erreur lors de la suppression du produit du panier:', e);
  }
}
