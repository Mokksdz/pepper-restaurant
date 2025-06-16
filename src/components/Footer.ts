export function Footer(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'bg-white border-t border-gray-100 py-6 mt-12 text-center text-gray-500 text-sm';
  footer.innerHTML = `
    <div>© 2025 PEPPER. Tous droits réservés.</div>
    <div class="mt-1">Made with <span class="text-pepper-orange">♥</span> in Alger</div>
  `;
  return footer;
}

