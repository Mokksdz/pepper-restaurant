import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function renderIndex() {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  const hero = document.createElement('section');
  hero.className = 'relative flex flex-col items-center justify-center text-center py-20 px-4 overflow-hidden';
  hero.innerHTML = `
    <div class="absolute inset-0 -z-10 flex items-center justify-center">
      <img src="/assets/images/BG accueil copie.jpg" alt="Fond Pepper" class="w-full h-full object-cover opacity-20 blur-sm" style="max-width:none; max-height:none;" loading="lazy" />
    </div>
    <div data-aos="zoom-in" data-aos-duration="800">
      <img src="/Pepper Logo.svg" alt="Burger PEPPER" class="w-[60vw] h-[60vw] max-w-[320px] md:w-[840px] md:h-[840px] md:max-w-[840px] object-contain mb-8 animate-bounce-in" loading="lazy" />
    </div>
    <style>
      @keyframes bounce-in {
        0% { transform: scale(0.7); opacity: 0; }
        60% { transform: scale(1.15); opacity: 1; }
        80% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
      .animate-bounce-in {
        animation: bounce-in 1.1s cubic-bezier(.7,-0.3,.5,1.5) both;
      }
    </style>
    <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-xl" data-aos="fade-up" data-aos-delay="400">Des burgers premium, des produits frais, une expérience street food unique à Alger.</p>
    <div data-aos="fade-up" data-aos-delay="600">
      <a href="#menu" class="inline-block px-8 py-3 bg-pepper-orange text-white font-semibold rounded-full text-lg shadow hover:bg-black hover:text-pepper-orange transition">Voir le menu</a>
    </div>
  `;
  app.appendChild(hero);
  app.appendChild(Footer());
}
