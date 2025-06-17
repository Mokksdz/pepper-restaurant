export function Footer(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'bg-white border-t border-gray-100 py-10 mt-16 text-center text-gray-600 text-base';
  footer.innerHTML = `
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">
      <div class="flex flex-col items-center md:items-start gap-2">
        <div class="font-extrabold text-pepper-orange text-xl mb-1">PEPPER</div>
        <div class="flex gap-3 mb-1">
          <a href="https://www.instagram.com/pepperburgerdz/" target="_blank" rel="noopener" class="group">
            <svg class="w-7 h-7 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
          </a>
          <a href="https://www.facebook.com/pepperburgerdz/" target="_blank" rel="noopener" class="group">
            <svg class="w-7 h-7 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37V9.5a2 2 0 0 0-2-2h-1.5A2.5 2.5 0 0 0 10 10v1.37H8v2.26h2V19h2.5v-5.37h2l.5-2.26h-2.5z"/></svg>
          </a>
          <a href="https://goo.gl/maps/8QvF7JvK4XyKf8Uq5" target="_blank" rel="noopener" class="group">
            <svg class="w-7 h-7 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
          </a>
        </div>
        <div class="text-sm text-gray-700 mb-1 text-left w-full">
          <div class="font-bold">315 Coopérative El Moustakbel<br>Ain Allah, Dely Ibrahim</div>
          <span class="text-pepper-orange font-extrabold text-base">
            <a href="tel:0561780036" class="hover:underline">0561 78 00 36</a>
          </span>
          <a href="https://maps.app.goo.gl/asyvuvtwMqjYhKZy5?g_st=com.google.maps.preview.copy" target="_blank" rel="noopener" class="ml-2 text-pepper-orange underline hover:text-black">Maps</a>
        </div>
        <div class="text-sm text-gray-700 mb-1 text-left w-full">
          <div class="font-bold">Garden City 3ème étage, Food Court</div>
          <span class="text-pepper-orange font-extrabold text-base">
            <a href="tel:0542063443" class="hover:underline">0542 06 34 43</a>
          </span>
          <a href="https://maps.app.goo.gl/LjBKW4ot89rjMfK66?g_st=com.google.maps.preview.copy" target="_blank" rel="noopener" class="ml-2 text-pepper-orange underline hover:text-black">Maps</a>
        </div>
      </div>
      <div class="flex flex-col items-center gap-2">
        <div class="font-semibold text-black">Horaires</div>
        <div class="text-sm">Lun - Jeu : 12h00 - 23h00</div>
        <div class="text-sm">Ven - Dim : 12h00 - 00h00</div>
      </div>
      <div class="flex flex-col items-center gap-2">
        <div>© 2025 PEPPER. Tous droits réservés.</div>
        <div class="mt-1">Made with <span class="text-pepper-orange">♥</span> in Alger</div>
      </div>
    </div>
  `;
  return footer;
}

