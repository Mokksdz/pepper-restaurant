/**
 * Utilitaire pour optimiser les images
 * Permet de gérer le lazy loading et la conversion WebP
 */

/**
 * Vérifie si le navigateur supporte le format WebP
 */
export async function supportsWebP(): Promise<boolean> {
  if (!window.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  try {
    return createImageBitmap(blob).then(() => true, () => false);
  } catch (e) {
    return false;
  }
}

/**
 * Convertit un chemin d'image JPG en WebP si disponible
 * @param imagePath Chemin de l'image
 */
export function getOptimizedImagePath(imagePath: string): string {
  // Si l'image est déjà en WebP, on la retourne telle quelle
  if (imagePath.endsWith('.webp')) return imagePath;
  
  // Sinon, on essaie de trouver une version WebP
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // On vérifie si l'image WebP existe
  // Note: Cette vérification est simplifiée car nous n'avons pas accès au système de fichiers
  // Dans un environnement réel, il faudrait vérifier l'existence du fichier WebP
  return webpPath;
}

/**
 * Crée un élément img avec lazy loading et optimisation
 * @param src Source de l'image
 * @param alt Texte alternatif
 * @param className Classes CSS
 */
export function createOptimizedImage(src: string, alt: string, className: string): HTMLImageElement {
  const img = document.createElement('img');
  img.src = getOptimizedImagePath(src);
  img.alt = alt;
  img.className = className;
  img.loading = 'lazy'; // Activer le lazy loading natif
  
  // Ajouter des attributs pour améliorer le SEO et l'accessibilité
  img.setAttribute('decoding', 'async');
  
  return img;
}

/**
 * Remplace toutes les images d'une page par des versions optimisées
 */
export function optimizeAllImages(): void {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Ajouter le lazy loading s'il n'est pas déjà présent
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    
    // Optimiser le décodage
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
    
    // Convertir en WebP si possible
    if (img.src && !img.src.includes('data:') && !img.src.endsWith('.webp')) {
      const originalSrc = img.src;
      const webpSrc = getOptimizedImagePath(originalSrc);
      
      // Utiliser un srcset pour fournir à la fois l'original et la version WebP
      img.srcset = `${webpSrc} 1x, ${originalSrc} 1x`;
    }
  });
}
