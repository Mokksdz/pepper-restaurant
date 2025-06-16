import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { menuItems, MenuCategory } from '../data/menuItems';
import { ProductCard } from '../components/ProductCard';

const categories: { key: MenuCategory; label: string }[] = [
  { key: 'Burgers', label: 'Nos Burgers' },
  { key: 'Sandwichs orientaux', label: 'Nos Sandwichs' },
  { key: 'Accompagnements', label: 'Nos Sides' },
  { key: 'Desserts', label: 'Nos Desserts' },
  { key: 'Boissons', label: 'Nos Boissons' },
];

export function renderMenu() {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  const main = document.createElement('main');
  main.className = 'py-10 px-2 md:px-4 max-w-6xl mx-auto';

  // Section spéciale Pepper Smash
  const smash = menuItems.find(i => i.id === 'pepper-smash');
  if (smash) {
    const smashSection = document.createElement('section');
    smashSection.className = 'bg-pepper-gray rounded-xl flex flex-col md:flex-row items-center gap-8 p-6 md:p-10 mb-12 shadow-sm border border-gray-100';
    smashSection.innerHTML = `
      <div class="flex-1 flex flex-col items-center md:items-start">
        <div class="inline-block bg-pepper-orange text-white text-xs font-bold rounded-full px-3 py-1 mb-2 uppercase tracking-wide">New</div>
        <h2 class="text-2xl md:text-3xl font-extrabold text-black mb-2">PEPPER SMASH</h2>
        <div class="text-base md:text-lg font-semibold text-black mb-2">Double Smash Double Cheese House Sauce</div>
        <div class="flex gap-4 mb-1 text-pepper-orange font-bold text-lg">
          <span>700 DA</span>
          <span>XL 900 DA</span>
          <span>XXL 1000 DA</span>
        </div>
        <div class="text-gray-600 text-sm md:text-base mb-2">Tu peux mettre des oignons caramélisés ou des pickles si tu veux</div>
      </div>
      <img src="${smash.image}" alt="Pepper Smash" class="w-40 h-40 object-cover rounded-full shadow bg-white border border-gray-200" loading="lazy" />
    `;
    main.appendChild(smashSection);
  }

  // Affichage des catégories et produits
  categories.forEach(({ key, label }) => {
    const section = document.createElement('section');
    section.className = 'mb-14';
    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold mb-6 text-black tracking-tight';
    title.textContent = label;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7';
    menuItems.filter(i => i.category === key && i.id !== 'pepper-smash').forEach(item => {
      grid.appendChild(ProductCard(item));
    });
    section.appendChild(grid);
    main.appendChild(section);
  });

  // Section encart formule
  const formule = document.createElement('div');
  formule.className = 'bg-pepper-orange text-white rounded-xl px-6 py-5 text-lg font-semibold text-center max-w-xl mx-auto shadow mt-10 mb-4';
  formule.innerHTML = 'Rajoutes <span class="font-bold">01 Frite</span> + <span class="font-bold">01 Boisson</span> pour <span class="font-bold">350 DA</span>';
  main.appendChild(formule);

  app.appendChild(main);
  app.appendChild(Footer());
}
