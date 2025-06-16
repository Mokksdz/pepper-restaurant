import { renderIndex } from './pages/index';
import { renderMenu } from './pages/menu';
import { renderCommander } from './pages/commander';
import { renderApropos } from './pages/apropos';
import { renderContact } from './pages/contact';
import { renderProduct } from './pages/product';
import { renderFavoris } from './pages/favoris';

export function renderPage(route: string = '') {
  // Vérifier si c'est une page produit
  if (route.startsWith('product/')) {
    const productId = route.split('/')[1];
    renderProduct(productId);
    return;
  }
  
  switch (route) {
    case 'menu':
      renderMenu();
      break;
    case 'commander':
      renderCommander();
      break;
    case 'favoris':
      renderFavoris();
      break;
    case 'apropos':
      renderApropos();
      break;
    case 'contact':
      renderContact();
      break;
    case 'index':
    case '':
      renderIndex();
      break;
    default:
      renderIndex();
      break;
  }
}
