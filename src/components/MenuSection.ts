import { menuItems, MenuCategory } from '../data/menuItems';
import { ProductCard } from './ProductCard';
import type { MenuItem } from '../data/menuItems';

export function MenuSection(title: string, items: MenuItem[]): HTMLElement {
  const section = document.createElement('section');
  section.className = 'py-8';
  
  const titleElement = document.createElement('h2');
  titleElement.className = 'text-2xl font-bold mb-6 text-black';
  titleElement.textContent = title;
  titleElement.setAttribute('data-aos', 'fade-right');
  titleElement.setAttribute('data-aos-duration', '600');
  
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
  grid.setAttribute('data-aos', 'fade-up');
  grid.setAttribute('data-aos-delay', '200');
  
  items.forEach(item => {
    grid.appendChild(ProductCard(item));
  });
  
  section.appendChild(titleElement);
  section.appendChild(grid);
  return section;
}
