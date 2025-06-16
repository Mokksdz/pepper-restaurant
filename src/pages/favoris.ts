import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { menuItems } from '../data/menuItems';
import { getFavorites, removeFromFavorites } from '../utils/favorites';
import { formatPrice } from '../utils/formatPrice';

export function renderFavoris() {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  const main = document.createElement('main');
  main.className = 'py-10 px-4 max-w-6xl mx-auto';

  // Titre de la page
  const pageTitle = document.createElement('h1');
  pageTitle.className = 'text-3xl font-bold mb-8 text-center';
  pageTitle.textContent = 'Mes Favoris';
  pageTitle.setAttribute('data-aos', 'fade-down');
  pageTitle.setAttribute('data-aos-duration', '600');
  main.appendChild(pageTitle);

  // Récupérer les favoris
  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    // Afficher un message si aucun favori
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'text-center py-10';
    emptyMessage.setAttribute('data-aos', 'fade-up');
    emptyMessage.innerHTML = `
      <div class="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
        <div class="text-6xl mb-4">❤️</div>
        <h2 class="text-xl font-bold mb-4">Vous n'avez pas encore de favoris</h2>
        <p class="text-gray-500 mb-6">Parcourez notre menu et ajoutez des produits à vos favoris en cliquant sur l'icône ❤️</p>
        <a href="#menu" class="bg-pepper-orange text-white px-6 py-2 rounded-full inline-block hover:bg-black transition">Voir le menu</a>
      </div>
    `;
    main.appendChild(emptyMessage);
  } else {
    // Afficher les produits favoris
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    grid.setAttribute('data-aos', 'fade-up');
    
    // Filtrer les produits qui sont dans les favoris
    const favoriteItems = favorites.map(fav => {
      return {
        item: menuItems.find(item => item.id === fav.id),
        timestamp: fav.timestamp
      };
    }).filter(fav => fav.item !== undefined);
    
    // Trier par date d'ajout (plus récent en premier)
    favoriteItems.sort((a, b) => b.timestamp - a.timestamp);
    
    favoriteItems.forEach((fav, index) => {
      const item = fav.item!;
      
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (index * 100).toString());
      
      const dateAdded = new Date(fav.timestamp);
      const formattedDate = dateAdded.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
      
      card.innerHTML = `
        <div class="absolute top-4 right-4 flex gap-2">
          <span class="text-xs text-gray-400">Ajouté le ${formattedDate}</span>
          <button class="remove-favorite text-gray-400 hover:text-red-500 transition" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
        
        <div class="flex items-center mb-4">
          <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-full mr-4" />
          <div>
            <h3 class="text-lg font-semibold">${item.name}</h3>
            <p class="text-gray-500 text-sm line-clamp-2">${item.description || ''}</p>
          </div>
        </div>
        
        <div class="flex justify-between items-center mt-auto">
          <div class="text-pepper-orange font-bold">
            ${item.prices.normal ? formatPrice(item.prices.normal) : ''}
            ${item.prices.xl ? ` / XL ${formatPrice(item.prices.xl)}` : ''}
            ${item.prices.xxl ? ` / XXL ${formatPrice(item.prices.xxl)}` : ''}
          </div>
          <div class="flex gap-2">
            <a href="#product/${item.id}" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition">Voir</a>
            <a href="#commander" class="bg-pepper-orange hover:bg-black text-white px-3 py-1 rounded-full text-sm transition">Commander</a>
          </div>
        </div>
      `;
      
      grid.appendChild(card);
    });
    
    main.appendChild(grid);
  }
  
  app.appendChild(main);
  app.appendChild(Footer());
  
  // Ajouter les écouteurs d'événements pour les boutons de suppression
  setTimeout(() => {
    const removeButtons = document.querySelectorAll('.remove-favorite');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const itemId = target.dataset.id;
        
        if (itemId) {
          removeFromFavorites(itemId);
          
          // Animation de suppression
          const card = target.closest('.bg-white') as HTMLElement;
          if (card) {
            card.classList.add('opacity-0', 'scale-95');
            card.style.transition = 'all 0.3s ease-out';
            
            setTimeout(() => {
              // Recharger la page après l'animation
              window.location.hash = '#favoris';
            }, 300);
          }
        }
      });
    });
  }, 100);
}
