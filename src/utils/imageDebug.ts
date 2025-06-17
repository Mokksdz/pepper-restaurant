// Utilitaire de débogage pour les images
import { getImageUrl, preloadImage } from './imageLoader';
import { fixProductImage, generatePossibleImagePaths, normalizeFileName } from './imageFixUtility';

// Variable pour suivre les problèmes d'image
export const imageStats = {
  loaded: 0,
  failed: 0,
  fixed: 0,
  errors: new Map<string, string>()
};

export function checkAllImages(): void {
  console.log(`📊 Statistiques de chargement des images:`);
  console.log(`🟢 Chargées avec succès: ${imageStats.loaded}`);
  console.log(`🔄 Corrigées automatiquement: ${imageStats.fixed}`);
  console.log(`🔴 Échecs de chargement: ${imageStats.failed}`);
  
  if (imageStats.failed > 0) {
    console.log('❌ Images problématiques:');
    imageStats.errors.forEach((error, path) => {
      console.error(`  - ${path}: ${error}`);
    });
  }
}

// Fonction pour forcer le rechargement d'une image
export function forceReloadImage(element: HTMLImageElement): void {
  const originalSrc = element.src;
  element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIj48L3N2Zz4=';
  setTimeout(() => {
    element.src = originalSrc + '?reload=' + new Date().getTime();
  }, 50);
}

export function debugImageLoad(imagePath: string, element: HTMLImageElement) {
  // Nettoyer le chemin pour éviter les problèmes
  const originalPath = imagePath;
  
  console.log(`🔍 Tentative de chargement de l'image: ${imagePath}`);
  console.log(`🔗 URL complète: ${window.location.origin}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`);
  console.log(`🖼️ Image element src actuel: ${element.src}`);
  
  // Vérifier si l'image a déjà échoué précédemment
  if (imageStats.errors.has(imagePath)) {
    console.warn(`⚠️ Cette image a déjà échoué précédemment: ${imageStats.errors.get(imagePath)}`);
  }
  
  // S'assurer que l'URL est correcte et complète
  const correctedPath = getImageUrl(imagePath);
  if (correctedPath !== imagePath) {
    console.log(`🔧 Correction du chemin: ${imagePath} -> ${correctedPath}`);
  }
  
  // Tentative de préchargement pour vérification (sans affecter l'affichage)
  preloadImage(imagePath).then((success) => {
    if (success) {
      console.log(`✨ Préchargement réussi: ${correctedPath}`);
    } else {
      console.warn(`⚠️ Préchargement échoué: ${correctedPath}`);
    }
  });
  
  // Configurations des événements
  element.onload = () => {
    console.log(`✅ Image chargée avec succès: ${imagePath}`);
    console.log(`📏 Dimensions: ${element.naturalWidth}x${element.naturalHeight}`);
    imageStats.loaded++;
    imageStats.errors.delete(imagePath);
    
    // Si l'image a une taille de 0, c'est probablement un problème
    if (element.naturalWidth === 0 || element.naturalHeight === 0) {
      console.warn(`⚠️ Image chargée mais avec des dimensions nulles!`);
      imageStats.errors.set(imagePath, 'Dimensions nulles');
    }
  };
  
  element.onerror = (error) => {
    console.error(`❌ Erreur de chargement de l'image: ${imagePath}`, error);
    console.log(`📂 Vérifiez que le fichier existe bien à l'emplacement: public${imagePath}`);
    imageStats.failed++;
    imageStats.errors.set(imagePath, 'Erreur de chargement');
    
    // Afficher les requêtes réseau pour aider au débogage
    console.log(`🌐 Pour déboguer, ouvrez la console du navigateur et vérifiez l'onglet Réseau (Network) pour voir les 404`);
    
    // Analyse diagnostique améliorée
    if (imagePath.includes(' ')) {
      console.warn(`⚠️ L'URL contient des espaces: ${imagePath}`); 
      console.log(`💡 Suggestion: Remplacer les espaces par des tirets`);
    }
    
    if (imagePath.includes('../')) {
      console.warn(`⚠️ L'URL contient des références au parent: ${imagePath}`);
      console.log(`💡 Suggestion: Utiliser des chemins absolus à partir de /assets/images/`);
    }
    
    // Vérifier les accents et caractères spéciaux
    if (/[éèêëàâäôöùûüç]/i.test(imagePath)) {
      console.warn(`⚠️ L'URL contient des caractères accentués qui peuvent poser problème: ${imagePath}`);
      const normalized = normalizeFileName(imagePath);
      console.log(`💡 Version normalisée suggérée: ${normalized}`);
    }
    
    // Seulement tenter la correction si l'image a vraiment échoué
    if (!imagePath.includes('placeholder') && !imagePath.includes('base64') && !element.src.startsWith('data:image')) {
      console.log(`🔄 Tentative de correction automatique de l'image...`);
      
      // Vérifier si le chemin de l'image est valide pour éviter les boucles infinies
      if (imagePath.includes('base64') || imagePath.includes(';')) {
        console.warn('⚠️ Chemin invalide - ne peut pas être réparé:', imagePath);
        return;
      }
      
      // Générer les chemins possibles pour le diagnostic
      const possiblePaths = generatePossibleImagePaths(imagePath);
      console.log(`🔍 Chemins alternatifs générés: ${possiblePaths.length}`);
      
      // Si aucun chemin n'a été généré, stopper la réparation
      if (possiblePaths.length === 0) {
        console.warn('⚠️ Aucun chemin alternatif valide n\'a pu être généré');
        return;
      }
      
      // Afficher quelques chemins à titre d'exemple
      if (possiblePaths.length > 0) {
        console.log('📋 Exemples de chemins alternatifs:');
        possiblePaths.slice(0, 3).forEach((path, index) => {
          console.log(`  ${index + 1}. ${path}`);
        });
        if (possiblePaths.length > 3) {
          console.log(`  ... et ${possiblePaths.length - 3} autres chemins`);
        }
      }
      
      // Tentative de correction avec notre système amélioré (sans placeholder temporaire)
      fixProductImage(element).then(success => {
        if (success) {
          console.log(`✅ Image corrigée avec succès!`);
          imageStats.fixed++;
          imageStats.failed--;
          imageStats.errors.delete(imagePath);
        } else {
          console.warn(`⚠️ Échec de la correction automatique`);
          // Afficher un placeholder seulement en cas d'échec complet
          element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
        }
      });
    }
  };
}
