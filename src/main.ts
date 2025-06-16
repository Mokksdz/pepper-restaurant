import './assets/styles/global.css';
import { renderPage } from './pages';

// Simple router (hash-based)
function router() {
  const route = window.location.hash.replace('#', '') || 'index';
  renderPage(route);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

