import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function renderContact() {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(Header());

  const main = document.createElement('main');
  main.className = 'py-14 px-4 max-w-xl mx-auto';
  main.innerHTML = `
    <h1 class="text-3xl font-bold mb-8 text-black">Contact</h1>
    <form class="flex flex-col gap-6 mb-8" autocomplete="off">
      <div>
        <label class="block text-sm font-semibold mb-1" for="nom">Nom</label>
        <input type="text" id="nom" name="nom" class="w-full border border-gray-200 rounded px-4 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1" for="email">Email</label>
        <input type="email" id="email" name="email" class="w-full border border-gray-200 rounded px-4 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1" for="message">Message</label>
        <textarea id="message" name="message" rows="4" class="w-full border border-gray-200 rounded px-4 py-2" required></textarea>
      </div>
      <button type="submit" class="bg-pepper-orange text-white font-semibold rounded-full px-8 py-3 text-lg shadow hover:bg-black hover:text-pepper-orange transition">Envoyer</button>
    </form>
    <div class="mb-4 text-gray-600">
      <div class="mb-2"><strong>Adresse :</strong> 12, Rue des Frères Bouadou, El Madania, Alger</div>
      <div class="mb-2"><strong>Téléphone :</strong> <a href="tel:+213555123456" class="text-pepper-orange">+213 555 12 34 56</a></div>
    </div>
    <iframe class="w-full h-56 rounded border border-gray-200" src="https://www.google.com/maps?q=36.752778,3.042222&hl=fr&z=16&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  `;
  app.appendChild(main);
  app.appendChild(Footer());
}

