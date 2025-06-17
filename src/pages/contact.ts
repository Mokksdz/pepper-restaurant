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
    <div class="mb-8 text-gray-800">
      <div class="mb-6">
        <div class="font-bold text-lg">315 Coopérative El Moustakbel<br>Ain Allah, Dely Ibrahim</div>
        <div class="text-pepper-orange text-2xl font-extrabold mb-1">
          <a href="tel:0561780036" class="hover:underline">0561 78 00 36</a>
        </div>
        <a href="https://maps.app.goo.gl/asyvuvtwMqjYhKZy5?g_st=com.google.maps.preview.copy" target="_blank" class="text-pepper-orange underline hover:text-black">Voir sur Google Maps</a>
      </div>
      <div class="mb-6">
        <div class="font-bold text-lg">Garden City 3ème étage<br>au Food Court</div>
        <div class="text-pepper-orange text-2xl font-extrabold mb-1">
          <a href="tel:0542063443" class="hover:underline">0542 06 34 43</a>
        </div>
        <a href="https://maps.app.goo.gl/LjBKW4ot89rjMfK66?g_st=com.google.maps.preview.copy" target="_blank" class="text-pepper-orange underline hover:text-black">Voir sur Google Maps</a>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <iframe class="w-full h-56 rounded border border-gray-200" src="https://www.google.com/maps?q=36.745133,2.993597&hl=fr&z=16&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <iframe class="w-full h-56 rounded border border-gray-200" src="https://www.google.com/maps?q=36.740532,2.981194&hl=fr&z=16&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  `;
  app.appendChild(main);
  app.appendChild(Footer());
}

