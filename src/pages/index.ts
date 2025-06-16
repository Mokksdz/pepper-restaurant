import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function renderIndex() {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  const hero = document.createElement('section');
  hero.className = 'flex flex-col items-center justify-center text-center py-20 px-4 bg-white';
  hero.innerHTML = `
    <div data-aos="zoom-in" data-aos-duration="800">
      <img src="/src/assets/images/Logo/Logo Pepper.jpg" alt="Burger PEPPER" class="w-40 h-40 object-cover rounded-full shadow mb-8 bg-pepper-gray" loading="lazy" />
    </div>
    <h1 class="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-black" data-aos="fade-up" data-aos-delay="200">PEPPER</h1>
    <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-xl" data-aos="fade-up" data-aos-delay="400">Des burgers premium, des produits frais, une expérience street food unique à Alger.</p>
    <div data-aos="fade-up" data-aos-delay="600">
      <a href="#menu" class="inline-block px-8 py-3 bg-pepper-orange text-white font-semibold rounded-full text-lg shadow hover:bg-black hover:text-pepper-orange transition">Voir le menu</a>
    </div>
  `;
  app.appendChild(hero);
  app.appendChild(Footer());
}

