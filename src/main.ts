import './assets/styles/global.css';
import { renderPage } from './pages';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { optimizeAllImages } from './utils/imageOptimizer';
import './utils/initImageFix'; // Correctif automatique pour l'affichage des photos produits
import './utils/imageDiagnostic'; // Diagnostic avancé des images

// Initialiser AOS pour les animations
AOS.init({
  duration: 1100, // Animation plus douce
  easing: 'cubic-bezier(.77,0,.18,1)', // Easing naturel
  once: false,
  mirror: true,
  offset: 70, // Décalage plus naturel
  delay: 60 // Légère attente entre les éléments
});

// Simple router (hash-based)
function router() {
  const route = window.location.hash.replace('#', '') || 'index';
  renderPage(route);
  
  // Rafraîchir AOS après le changement de page
  setTimeout(() => {
    AOS.refresh();
    // TEMPORAIREMENT DÉSACTIVÉ - L'optimisation des images causait un clignotement
    // optimizeAllImages();
    console.log('🖼️ Optimisation d\'images temporairement désactivée pour éviter le clignotement');
  }, 100);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// --- Bouton "Retour en haut" flottant ---
function createBackToTopBtn() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top-btn';
  btn.innerHTML = `<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`;
  btn.className = 'fixed z-50 bottom-6 right-6 bg-pepper-orange text-white rounded-full shadow-lg p-3 opacity-0 pointer-events-none scale-90 transition-all duration-300 hover:bg-black hover:text-pepper-orange focus:ring-2 focus:ring-pepper-orange';
  btn.title = 'Retour en haut';
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      btn.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
      btn.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
    } else {
      btn.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      btn.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBackToTopBtn);
} else {
  createBackToTopBtn();
}
