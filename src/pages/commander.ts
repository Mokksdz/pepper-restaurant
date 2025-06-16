import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { getCart, CartItem, clearCart } from '../utils/cart';
import { formatPrice as formatPriceUtil } from '../utils/formatPrice';
import { menuItems } from '../data/menuItems';

export function renderCommander() {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  const main = document.createElement('main');
  main.className = 'py-14 px-4 max-w-4xl mx-auto';
  
  // Récupérer le contenu du panier
  const cart = getCart();
  const hasItems = cart.length > 0;
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  main.innerHTML = `
    <h1 class="text-3xl font-bold mb-8 text-black">Commander</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Récapitulatif panier -->
      <div class="md:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 class="text-xl font-semibold mb-4">Votre commande</h2>
          
          ${hasItems ? `
            <div class="divide-y divide-gray-100 mb-6">
              ${cart.map(item => `
                <div class="py-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg" />
                      <span class="absolute -top-2 -right-2 bg-pepper-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${item.quantity}</span>
                    </div>
                    <div>
                      <h3 class="font-medium">${item.name}</h3>
                      <p class="text-sm text-gray-500">${item.size !== 'normal' ? `Taille: ${item.size.toUpperCase()}` : ''}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-pepper-orange">${formatPriceUtil(item.price * item.quantity)}</div>
                    <div class="text-sm text-gray-500">${item.quantity} x ${formatPriceUtil(item.price)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="flex justify-between items-center border-t border-gray-100 pt-4 font-semibold">
              <span>Total</span>
              <span class="text-pepper-orange text-xl">${formatPriceUtil(totalPrice)}</span>
            </div>
            
            <div class="mt-6 flex justify-end gap-4">
              <button id="clear-cart" class="text-gray-500 hover:text-gray-700 transition text-sm">Vider le panier</button>
              <button id="continue-shopping" class="text-pepper-orange hover:text-black transition text-sm">Continuer les achats</button>
            </div>
          ` : `
            <div class="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="mb-4">Votre panier est vide</p>
              <a href="#menu" class="bg-pepper-orange text-white px-4 py-2 rounded-full text-sm hover:bg-black transition">Voir le menu</a>
            </div>
          `}
        </div>
      </div>
      
      <!-- Formulaire de commande -->
      <div>
        <form id="order-form" class="bg-white p-6 rounded-lg shadow-sm" ${!hasItems ? 'disabled' : ''}>
          <h2 class="text-xl font-semibold mb-4">Informations</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-semibold mb-1" for="name">Nom complet</label>
            <input type="text" id="name" name="name" class="w-full border border-gray-200 rounded px-4 py-2" required ${!hasItems ? 'disabled' : ''} />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-semibold mb-1" for="phone">Téléphone</label>
            <input type="tel" id="phone" name="phone" class="w-full border border-gray-200 rounded px-4 py-2" required ${!hasItems ? 'disabled' : ''} />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-semibold mb-1" for="address">Adresse de livraison</label>
            <textarea id="address" name="address" rows="2" class="w-full border border-gray-200 rounded px-4 py-2" required ${!hasItems ? 'disabled' : ''}></textarea>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Options supplémentaires</label>
            <div class="flex flex-wrap gap-4">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" name="extra_sauce" ${!hasItems ? 'disabled' : ''} /> Sauce supplémentaire
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" name="extra_cheese" ${!hasItems ? 'disabled' : ''} /> Fromage supplémentaire
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" name="no_pickles" ${!hasItems ? 'disabled' : ''} /> Sans cornichons
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" name="no_onions" ${!hasItems ? 'disabled' : ''} /> Sans oignons
              </label>
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Mode de paiement</label>
            <div class="flex flex-col gap-3">
              <label class="inline-flex items-center gap-2">
                <input type="radio" name="payment_method" value="cash" checked ${!hasItems ? 'disabled' : ''} /> Paiement à la livraison
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="radio" name="payment_method" value="card" ${!hasItems ? 'disabled' : ''} /> Carte bancaire à la livraison
              </label>
            </div>
          </div>
          
          <button type="submit" class="w-full bg-pepper-orange text-white font-semibold rounded-full px-8 py-3 text-lg shadow hover:bg-black hover:text-pepper-orange transition" ${!hasItems ? 'disabled' : ''}>
            ${hasItems ? `Commander (${formatPriceUtil(totalPrice)})` : 'Commander'}
          </button>
        </form>
      </div>
    </div>
  `;
  
  app.appendChild(main);
  app.appendChild(Footer());
  
  // Ajouter les écouteurs d'événements
  if (hasItems) {
    // Bouton pour vider le panier
    const clearCartBtn = document.getElementById('clear-cart');
    clearCartBtn?.addEventListener('click', () => {
      clearCart();
      window.location.hash = '#commander'; // Recharger la page
    });
    
    // Bouton pour continuer les achats
    const continueShoppingBtn = document.getElementById('continue-shopping');
    continueShoppingBtn?.addEventListener('click', () => {
      window.location.hash = '#menu';
    });
    
    // Soumission du formulaire
    const orderForm = document.getElementById('order-form');
    orderForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Afficher un message de confirmation
      const app = document.getElementById('app')!;
      app.innerHTML = '';
      app.appendChild(Header());
      
      const confirmationMain = document.createElement('main');
      confirmationMain.className = 'py-14 px-4 max-w-xl mx-auto text-center';
      confirmationMain.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-sm">
          <div class="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold mb-2">Commande confirmée !</h1>
          <p class="text-gray-500 mb-6">Votre commande a été validée avec succès.</p>
          <p class="font-medium mb-6">Nous vous contacterons bientôt pour confirmer la livraison.</p>
          <a href="#" class="bg-pepper-orange text-white px-6 py-2 rounded-full inline-block hover:bg-black transition">Retour à l'accueil</a>
        </div>
      `;
      
      app.appendChild(confirmationMain);
      app.appendChild(Footer());
      
      // Vider le panier après confirmation
      clearCart();
    });
  }
}

