import './assets/styles/global.css';
import { renderPage } from './pages';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { optimizeAllImages } from './utils/imageOptimizer';

// Initialiser AOS pour les animations
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false,
  mirror: true,
  offset: 50
});

// Simple router (hash-based)
function router() {
  const route = window.location.hash.replace('#', '') || 'index';
  renderPage(route);
  
  // Rafraîchir AOS après le changement de page
  setTimeout(() => {
    AOS.refresh();
    // Optimiser toutes les images après le chargement de la page
    optimizeAllImages();
  }, 100);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
