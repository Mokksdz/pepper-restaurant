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
    <div class="flex flex-col items-center justify-center gap-4 mb-8" data-aos="fade-up" data-aos-delay="300">
      <span class="font-semibold text-gray-700">Choisissez votre magasin :</span>
      <div class="flex gap-4">
        <button id="select-shop-ainallah" class="shop-btn bg-pepper-orange/80 hover:bg-pepper-orange text-white font-bold px-6 py-3 rounded-full shadow transition-all border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pepper-orange">Ain Allah</button>
        <button id="select-shop-gardencity" class="shop-btn bg-gray-200 hover:bg-pepper-orange/70 text-black font-bold px-6 py-3 rounded-full shadow transition-all border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pepper-orange">Garden City</button>
      </div>
    </div>
    <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-xl" data-aos="fade-up" data-aos-delay="400">Des burgers premium, des produits frais, une expérience street food unique à Alger.</p>

  `;
  app.appendChild(hero);

  // --- Logique sélection magasin ---
  const defaultShop = localStorage.getItem('shop') || 'ainallah';
  const btnAin = document.getElementById('select-shop-ainallah');
  const btnGarden = document.getElementById('select-shop-gardencity');
  function updateShopButtons(selected: string) {
    if (btnAin && btnGarden) {
      if (selected === 'ainallah') {
        btnAin.classList.add('bg-pepper-orange','text-white');
        btnAin.classList.remove('bg-gray-200','text-black');
        btnGarden.classList.remove('bg-pepper-orange','text-white');
        btnGarden.classList.add('bg-gray-200','text-black');
      } else {
        btnGarden.classList.add('bg-pepper-orange','text-white');
        btnGarden.classList.remove('bg-gray-200','text-black');
        btnAin.classList.remove('bg-pepper-orange','text-white');
        btnAin.classList.add('bg-gray-200','text-black');
      }
    }
  }
  updateShopButtons(defaultShop);
  if (btnAin) btnAin.onclick = () => {
    localStorage.setItem('shop','ainallah');
    updateShopButtons('ainallah');
    window.dispatchEvent(new CustomEvent('shopChanged', { detail: 'ainallah' }));
    window.location.hash = '#menu';
  };
  if (btnGarden) btnGarden.onclick = () => {
    localStorage.setItem('shop','gardencity');
    updateShopButtons('gardencity');
    window.dispatchEvent(new CustomEvent('shopChanged', { detail: 'gardencity' }));
    window.location.hash = '#menu';
  };



  app.appendChild(Footer());
}
