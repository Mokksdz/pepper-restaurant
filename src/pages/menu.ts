import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { menuItems, MenuCategory } from '../data/menuItems';
import { ProductCard } from '../components/ProductCard';
import { TestimonialsSection } from '../components/Testimonials';

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

  // --- Barre sticky d’onglets catégories ---
  const navBar = document.createElement('nav');
  navBar.className = 'sticky top-[68px] z-40 bg-white/80 backdrop-blur border-b border-gray-100 flex overflow-x-auto gap-2 md:gap-4 px-2 md:px-8 py-3 mb-6 shadow-sm animate-fade-in';
  navBar.setAttribute('data-aos', 'fade-down');
  navBar.setAttribute('data-aos-duration', '600');

  categories.forEach(({ key, label }, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-tab whitespace-nowrap px-4 py-2 rounded-full font-bold text-black transition-all duration-200 hover:bg-pepper-orange/10 focus:outline-none focus:ring-2 focus:ring-pepper-orange';
    btn.textContent = label;
    btn.setAttribute('data-category', key);
    btn.addEventListener('click', () => {
      const section = document.getElementById('section-' + key);
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - 90; // Décalage sticky
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
    navBar.appendChild(btn);
  });
  app.appendChild(navBar);


  const main = document.createElement('main');
  main.className = 'py-10 px-2 md:px-4 max-w-6xl mx-auto';

  // Section spéciale Pepper Smash
  const smash = menuItems.find(i => i.id === 'pepper-smash');
  if (smash) {
    const smashSection = document.createElement('section');
    smashSection.className = 'bg-pepper-gray rounded-xl flex flex-col md:flex-row items-center gap-8 p-6 md:p-10 mb-12 shadow-sm border border-gray-100';
    smashSection.setAttribute('data-aos', 'fade-up');
    smashSection.setAttribute('data-aos-duration', '800');
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
  categories.forEach(({ key, label }, index) => {
    const section = document.createElement('section');
    section.className = 'mb-14';
    section.id = 'section-' + key;
    section.setAttribute('data-aos', 'fade-up');
    section.setAttribute('data-aos-delay', (index * 100).toString());
    
    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold mb-6 text-black tracking-tight';
    title.textContent = label;
    title.setAttribute('data-aos', 'fade-right');
    title.setAttribute('data-aos-duration', '600');
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7';
    menuItems.filter(i => i.category === key).forEach(item => {
      grid.appendChild(ProductCard(item));
    });
    section.appendChild(grid);
    main.appendChild(section);
  });

  // Gestion de l’onglet actif selon la section visible
  window.addEventListener('scroll', () => {
    let current = '';
    categories.forEach(({ key }) => {
      const section = document.getElementById('section-' + key);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) {
          current = key;
        }
      }
    });
    document.querySelectorAll('.category-tab').forEach(tab => {
      if (tab instanceof HTMLElement) {
        if (tab.getAttribute('data-category') === current) {
          tab.classList.add('bg-pepper-orange/90', 'text-white', 'shadow', 'scale-105');
          tab.classList.remove('text-black');
        } else {
          tab.classList.remove('bg-pepper-orange/90', 'text-white', 'shadow', 'scale-105');
          tab.classList.add('text-black');
        }
      }
    });
  });

  // Section encart formule
  const formule = document.createElement('div');
  formule.className = 'bg-pepper-orange text-white rounded-xl px-6 py-5 text-lg font-semibold text-center max-w-xl mx-auto shadow mt-10 mb-4';
  formule.innerHTML = 'Rajoutes <span class="font-bold">01 Frite</span> + <span class="font-bold">01 Boisson</span> pour <span class="font-bold">350 DA</span>';
  formule.setAttribute('data-aos', 'zoom-in');
  formule.setAttribute('data-aos-duration', '500');
  main.appendChild(formule);

  app.appendChild(main);

  // Section Avis clients (testimonials)
  app.appendChild(TestimonialsSection());
  app.appendChild(Footer());
}
