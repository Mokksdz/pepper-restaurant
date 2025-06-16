import { renderIndex } from './pages/index';
import { renderMenu } from './pages/menu';
import { renderCommander } from './pages/commander';
import { renderApropos } from './pages/apropos';
import { renderContact } from './pages/contact';

export function renderPage(route: string) {
  switch (route) {
    case 'menu':
      renderMenu();
      break;
    case 'commander':
      renderCommander();
      break;
    case 'apropos':
      renderApropos();
      break;
    case 'contact':
      renderContact();
      break;
    case 'index':
    default:
      renderIndex();
      break;
  }
}
