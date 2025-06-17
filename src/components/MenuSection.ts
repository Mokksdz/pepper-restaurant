import { menuItems, MenuCategory } from '../data/menuItems';
import { ProductCard } from './ProductCard';
import type { MenuItem } from '../data/menuItems';

export function MenuSection(title: string, items: MenuItem[]): HTMLElement {
  const section = document.createElement('section');
  section.className = 'py-6';

  // Détermination de l'icône en fonction du titre
  let icon = '';
  if (/burger/i.test(title)) icon = '🍔';
  else if (/sandwich/i.test(title)) icon = '🥙';
  else if (/side|accompagnement/i.test(title)) icon = '🍟';
  else if (/dessert/i.test(title)) icon = '🍰';
  else if (/boisson/i.test(title)) icon = '🥤';

  // Titre stylisé avec fond doux, icône et séparateur
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'flex flex-col items-center mb-8';

  const titleElement = document.createElement('h2');
  titleElement.className = 'text-3xl md:text-4xl font-extrabold text-center text-black bg-pepper-orange/10 px-8 py-3 rounded-2xl shadow-sm flex items-center gap-3';
  titleElement.innerHTML = icon ? `<span class="text-2xl md:text-3xl">${icon}</span> <span>${title}</span>` : title;
  titleElement.setAttribute('data-aos', 'fade-right');
  titleElement.setAttribute('data-aos-duration', '600');
  
  // Séparateur graphique
  const separator = document.createElement('div');
  separator.className = 'w-24 h-1 bg-pepper-orange rounded-full mt-3 mb-1';

  titleWrapper.appendChild(titleElement);
  titleWrapper.appendChild(separator);

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4';
  grid.setAttribute('data-aos', 'fade-up');
  grid.setAttribute('data-aos-delay', '200');

  items.forEach(item => {
    grid.appendChild(ProductCard(item));
  });

  section.appendChild(titleWrapper);
  section.appendChild(grid);
  return section;
}
