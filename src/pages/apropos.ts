import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function renderApropos() {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  const main = document.createElement('main');
  main.className = 'py-14 px-4 max-w-2xl mx-auto';
  main.innerHTML = `
    <h1 class="text-3xl font-bold mb-8 text-black">À propos</h1>
    <p class="mb-6 text-lg text-gray-600">PEPPER est né d'une passion pour le burger premium et la street food. Nous sélectionnons des ingrédients frais et locaux pour garantir une qualité irréprochable à chaque bouchée. Notre mission : offrir une expérience gourmande, conviviale et authentique, dans un cadre moderne et chaleureux au cœur d'Alger.</p>
    <ul class="list-disc pl-6 text-gray-600 text-base mb-6">
      <li>Viandes 100% fraîches, pain artisanal</li>
      <li>Sauces maison, recettes originales</li>
      <li>Ambiance urbaine, service rapide</li>
    </ul>
    <p class="text-base text-gray-500">Venez découvrir la différence PEPPER : le goût, la qualité et l'accueil.</p>
  `;
  app.appendChild(main);
  app.appendChild(Footer());
}

