import { getCart } from '../utils/cart';
import { getFavorites } from '../utils/favorites';

export function Header(): HTMLElement {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const favorites = getFavorites();
  const totalFavorites = favorites.length;
  
  const header = document.createElement('header');
  header.className = 'bg-white py-2 px-6 shadow-sm sticky top-0 z-30 border-b border-gray-100 transition-shadow duration-300';
  
  header.innerHTML = `
    <div class="mx-auto flex items-center justify-between max-w-7xl">
      <a href="#" class="flex items-center">
        <img src="/Pepper Logo.svg" alt="Pepper Logo" class="h-24 w-auto object-contain" />
      </a>
      <nav class="hidden md:block">
        <ul class="flex space-x-6 items-center">
          <li><a href="#" class="hover:text-pepper-orange transition">Accueil</a></li>
          <li><a href="#menu" class="hover:text-pepper-orange transition">Menu</a></li>
          <li><a href="#commander" class="hover:text-pepper-orange transition">Commander</a></li>
          <li><a href="#apropos" class="hover:text-pepper-orange transition">À propos</a></li>
          <li><a href="#contact" class="hover:text-pepper-orange transition">Contact</a></li>
          <li>
            <a href="#favoris" class="relative hover:text-pepper-orange transition mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span id="favorites-counter-desktop" class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${totalFavorites === 0 ? 'hidden' : ''}">
                ${totalFavorites}
              </span>
            </a>
          </li>
          <li>
            <a href="#commander" class="relative hover:text-pepper-orange transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span id="cart-counter" class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${totalItems === 0 ? 'hidden' : ''}">
                ${totalItems}
              </span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="flex items-center md:hidden">
        <a href="#favoris" class="relative mr-3 hover:text-pepper-orange transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span id="favorites-counter-mobile" class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${totalFavorites === 0 ? 'hidden' : ''}">
            ${totalFavorites}
          </span>
        </a>
        <a href="#commander" class="relative mr-4 hover:text-pepper-orange transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span id="mobile-cart-counter" class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${totalItems === 0 ? 'hidden' : ''}">
            ${totalItems}
          </span>
        </a>
        <button id="mobile-menu-btn" class="text-black">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden w-full pb-4 px-6">
      <ul class="flex flex-col space-y-2 mt-4">
        <li><a href="#" class="hover:text-pepper-orange transition block">Accueil</a></li>
        <li><a href="#menu" class="hover:text-pepper-orange transition block">Menu</a></li>
        <li><a href="#commander" class="hover:text-pepper-orange transition block">Commander</a></li>
        <li><a href="#favoris" class="hover:text-pepper-orange transition block">Favoris</a></li>
        <li><a href="#apropos" class="hover:text-pepper-orange transition block">À propos</a></li>
        <li><a href="#contact" class="hover:text-pepper-orange transition block">Contact</a></li>
      </ul>
    </div>
  `;
  
  // Toggle mobile menu
  setTimeout(() => {
    const mobileMenuBtn = header.querySelector('#mobile-menu-btn');
    const mobileMenu = header.querySelector('#mobile-menu');
    
    mobileMenuBtn?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });
  }, 100);
  
  // Effet ombre sticky au scroll
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('shadow-lg');
        header.classList.remove('shadow-sm');
      } else {
        header.classList.remove('shadow-lg');
        header.classList.add('shadow-sm');
      }
    });
  }

  return header;
}
