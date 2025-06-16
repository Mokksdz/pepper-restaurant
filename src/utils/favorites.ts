import type { MenuItem } from '../data/menuItems';

// Interface pour les favoris
export interface FavoriteItem {
  id: string;
  timestamp: number;
}

/**
 * Récupère la liste des favoris depuis le localStorage
 */
export function getFavorites(): FavoriteItem[] {
  const favoritesString = localStorage.getItem('pepperFavorites');
  if (!favoritesString) return [];
  
  try {
    return JSON.parse(favoritesString);
  } catch (e) {
    console.error('Erreur lors de la récupération des favoris:', e);
    return [];
  }
}

/**
 * Vérifie si un produit est dans les favoris
 */
export function isFavorite(itemId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(item => item.id === itemId);
}

/**
 * Ajoute un produit aux favoris
 */
export function addToFavorites(itemId: string): void {
  const favorites = getFavorites();
  
  // Vérifier si le produit est déjà dans les favoris
  if (!isFavorite(itemId)) {
    favorites.push({
      id: itemId,
      timestamp: Date.now()
    });
    
    localStorage.setItem('pepperFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
  }
}

/**
 * Supprime un produit des favoris
 */
export function removeFromFavorites(itemId: string): void {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(item => item.id !== itemId);
  
  localStorage.setItem('pepperFavorites', JSON.stringify(updatedFavorites));
  updateFavoritesCount();
}

/**
 * Bascule l'état d'un produit dans les favoris (ajoute ou supprime)
 */
export function toggleFavorite(itemId: string): boolean {
  const isFav = isFavorite(itemId);
  
  if (isFav) {
    removeFromFavorites(itemId);
    return false;
  } else {
    addToFavorites(itemId);
    return true;
  }
}

/**
 * Met à jour le compteur de favoris dans le header
 */
export function updateFavoritesCount(): void {
  const favorites = getFavorites();
  const count = favorites.length;
  
  const favoritesCounterDesktop = document.getElementById('favorites-counter-desktop');
  const favoritesCounterMobile = document.getElementById('favorites-counter-mobile');
  
  if (favoritesCounterDesktop) {
    favoritesCounterDesktop.textContent = count > 0 ? count.toString() : '';
    favoritesCounterDesktop.style.display = count > 0 ? 'flex' : 'none';
  }
  
  if (favoritesCounterMobile) {
    favoritesCounterMobile.textContent = count > 0 ? count.toString() : '';
    favoritesCounterMobile.style.display = count > 0 ? 'flex' : 'none';
  }
}
