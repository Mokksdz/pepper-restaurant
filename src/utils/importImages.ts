// Fichier d'importation d'images dynamiques pour Vite
// Cette approche garantit que Vite va correctement traiter les images en tant qu'assets

// Fonction pour obtenir l'URL d'une image
export function getImage(path: string): string {
  if (!path) {
    return '';
  }
  // URLs absolues
  if (/^(https?:)?\/\//.test(path)) {
    return path;
  }
  // Chemin déjà vers public/assets
  if (path.startsWith('/assets/')) {
    return path;
  }
  // Chemin absolu quelconque
  if (path.startsWith('/')) {
    return path;
  }
  // Chemin relatif => supposé dans assets/images
  return `/assets/images/${path}`;
}
