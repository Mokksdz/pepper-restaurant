// Utilitaire spécifique pour résoudre les problèmes d'affichage des photos produits
import { getImageUrl } from './imageLoader';

// Types de catégories d'images
export type ImageCategory = 'burgers' | 'desserts' | 'boissons' | 'sides' | 'sandwichs' | 'logo' | 'divers';

// Interface pour les statistiques d'images
interface ImageStats {
  loaded: number;
  failed: number;
  errors: Map<string, string>;
  fixed: number;
}

// Statistiques globales
export const productImageStats: ImageStats = {
  loaded: 0,
  failed: 0,
  errors: new Map<string, string>(),
  fixed: 0
};

/**
 * Détecte la catégorie d'une image en fonction de son nom de fichier
 */
export function detectImageCategory(filename: string): ImageCategory {
  const lowerFileName = filename.toLowerCase();
  
  if (lowerFileName.includes('burger') || lowerFileName.includes('blue') || 
      lowerFileName.includes('cheese') || lowerFileName.includes('egg') || 
      lowerFileName.includes('forest') || lowerFileName.includes('rossini') || 
      lowerFileName.includes('smash') || lowerFileName.includes('chicken')) {
    return 'burgers';
  } else if (lowerFileName.includes('frite') || lowerFileName.includes('side') || 
            lowerFileName.includes('onion') || lowerFileName.includes('nugget')) {
    return 'sides';
  } else if (lowerFileName.includes('dessert') || lowerFileName.includes('glace') || 
            lowerFileName.includes('cookie') || lowerFileName.includes('brownie')) {
    return 'desserts';
  } else if (lowerFileName.includes('boisson') || lowerFileName.includes('soda') || 
            lowerFileName.includes('cola') || lowerFileName.includes('drink')) {
    return 'boissons';
  } else if (lowerFileName.includes('sandwich')) {
    return 'sandwichs';
  } else if (lowerFileName.includes('logo')) {
    return 'logo';
  }
  
  return 'divers';
}

/**
 * Normalise un nom de fichier en enlevant les accents et en remplacant les espaces
 */
export function normalizeFileName(fileName: string): string {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les signes diacritiques
    .replace(/\s+/g, '-'); // Remplacer les espaces par des tirets
}

/**
 * Génère toutes les alternatives possibles pour un chemin d'image
 */
export function generatePossibleImagePaths(imagePath: string): string[] {
  // Vérification de sécurité pour éviter les chemins base64
  if (!imagePath || imagePath.includes('base64') || imagePath.includes(';')) {
    console.warn('⚠️ Chemin d\'image invalide ignoré:', imagePath);
    return [];
  }
  
  const paths: string[] = [];
  const fileName = imagePath.split('/').pop() || '';
  const category = detectImageCategory(fileName);
  
  // Normaliser les noms de fichiers avec des accents
  const normalizedFileName = normalizeFileName(fileName);
  
  const hasAccents = fileName !== normalizedFileName;
  
  // Ajouter le chemin original
  paths.push(imagePath);
  
  // Si c'est un chemin absolu commençant par /, essayer aussi sans le /
  if (imagePath.startsWith('/')) {
    paths.push(imagePath.substring(1));
  }
  
  // Si c'est juste un nom de fichier, essayer avec les différentes catégories
  if (!imagePath.includes('/')) {
    // Avec public/assets
    paths.push(`/assets/images/${category}/${fileName}`);
    paths.push(`/assets/images/${fileName}`);
    
    // Avec src/assets
    paths.push(`/src/assets/images/${category}/${fileName}`);
    paths.push(`/src/assets/images/${fileName}`);
    
    // Tester toutes les catégories possibles
    const allCategories: ImageCategory[] = ['burgers', 'desserts', 'boissons', 'sides', 'sandwichs', 'logo', 'divers'];
    for (const cat of allCategories) {
      paths.push(`/assets/images/${cat}/${fileName}`);
      paths.push(`/src/assets/images/${cat}/${fileName}`);
    }
  }
  
  // Si c'est un chemin relatif à assets
  if (imagePath.startsWith('assets/')) {
    paths.push(`/${imagePath}`);
    // Essayer aussi avec src/
    paths.push(`/src/${imagePath}`);
  }
  
  // Si c'est un chemin sans /assets/ mais avec une catégorie
  if (!imagePath.includes('/assets/') && !imagePath.startsWith('/')) {
    const categoryMatch = imagePath.match(/^(burgers|desserts|boissons|sides|sandwichs)\/(.+)$/i);
    if (categoryMatch) {
      const [_, detectedCategory, file] = categoryMatch;
      paths.push(`/assets/images/${detectedCategory}/${file}`);
      paths.push(`/src/assets/images/${detectedCategory}/${file}`);
    }
  }
  
  // Si le chemin inclut src/, remplacer par le chemin public et vice versa
  if (imagePath.includes('/src/assets/')) {
    paths.push(imagePath.replace('/src/assets/', '/assets/'));
  } else if (imagePath.includes('/assets/')) {
    paths.push(imagePath.replace('/assets/', '/src/assets/'));
  }
  
  // Pour les noms avec accents, ajouter des versions sans accents
  if (hasAccents) {
    const basePathWithoutExt = imagePath.substring(0, imagePath.lastIndexOf('.'));
    const extension = imagePath.substring(imagePath.lastIndexOf('.'));
    const normalizedPath = basePathWithoutExt.normalize('NFD').replace(/[\u0300-\u036f]/g, '') + extension;
    paths.push(normalizedPath);
    
    // Refaire les mêmes tests avec le nom normalisé
    const normalizedPaths = generatePossibleImagePaths(normalizedPath);
    paths.push(...normalizedPaths);
  }
  
  // Enlever les doublons
  return [...new Set(paths)];
}

/**
 * Fonction pour fixer automatiquement les images qui ne s'affichent pas
 * @returns Promise<boolean> - true si l'image a été corrigée avec succès, false sinon
 */
export function fixProductImage(element: HTMLImageElement): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // 1. Récupérer le chemin actuel de l'image
    const currentSrc = element.src;
    
    // Vérifier si l'image est déjà un placeholder base64 - dans ce cas, ne pas essayer de la réparer
    if (currentSrc.startsWith('data:image') || currentSrc.includes('base64')) {
      console.log('👻 Image déjà un placeholder, pas de réparation nécessaire');
      resolve(false);
      return;
    }
    
    // Extraire le chemin et le nom de fichier
    const urlPath = new URL(currentSrc).pathname; // Extraction du chemin sans le domaine
    const imageName = currentSrc.split('/').pop() || '';
    
    console.log(`🔄 Tentative de réparation pour l'image: ${currentSrc}`);
    
    // 2. Générer différentes alternatives de chemins
    // Utiliser à la fois le nom du fichier et le chemin complet pour avoir plus d'options
    const possiblePaths: string[] = [];
    
    // S'assurer que le nom de fichier est valide avant de générer des chemins
    if (imageName && !imageName.includes('base64') && !imageName.includes(';')) {
      const nameBasedPaths = generatePossibleImagePaths(imageName);
      possiblePaths.push(...nameBasedPaths);
    }
    
    // S'assurer que le chemin d'URL est valide avant de générer des chemins
    if (urlPath && !urlPath.includes('base64') && !urlPath.includes(';')) {
      const urlBasedPaths = generatePossibleImagePaths(urlPath);
      possiblePaths.push(...urlBasedPaths);
    }
    
    // Si aucun chemin n'a été généré, arrêter la réparation
    if (possiblePaths.length === 0) {
      console.log('⚠️ Impossible de générer des chemins alternatifs valides');
      element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIGludmFsaWRlPC90ZXh0Pjwvc3ZnPg==';
      resolve(false);
      return;
    }
    
    console.log(`🔍 ${possiblePaths.length} chemins alternatifs générés`);
    
    // 3. Variables pour tester les alternatives
    let currentPathIndex = 0;
    
    // 4. Fonction de test récursive
    const tryNextPath = () => {
      if (currentPathIndex >= possiblePaths.length) {
        console.error(`❌ Échec: Impossible de charger l'image ${imageName} après ${possiblePaths.length} tentatives`);
        
        // Dernière chance: image placeholder
        element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFByb2R1aXQ8L3RleHQ+PC9zdmc+';
        productImageStats.errors.set(imageName, 'Échec de toutes les tentatives');
        productImageStats.failed++;
        resolve(false);
        return;
      }
      
      const path = possiblePaths[currentPathIndex];
      const fullPath = getImageUrl(path);
      console.log(`🔍 Essai #${currentPathIndex + 1}: ${fullPath}`);
      
      // Tester cette alternative
      const tempImg = new Image();
      
      tempImg.onload = () => {
        console.log(`✅ Succès avec le chemin: ${fullPath}`);
        element.src = fullPath;
        productImageStats.loaded++;
        productImageStats.fixed++;
        resolve(true);
      };
      
      tempImg.onerror = () => {
        console.log(`❌ Échec avec le chemin: ${fullPath}`);
        currentPathIndex++;
        tryNextPath();
      };
      
      tempImg.src = fullPath;
    };
    
    // 5. Démarrer la tentative de réparation
    tryNextPath();
  });
}

/**
 * Fonction pour scanner la page et réparer toutes les images de produits
 */
export function repairAllProductImages(): void {
  console.log('🔍 Recherche et réparation des images de produits...');
  
  // Sélectionner toutes les images qui pourraient être des produits
  const productImages = document.querySelectorAll('img[src*="burger"], img[src*="dessert"], img[src*="boisson"], img[src*="sandwich"], img[src*="side"], img[alt*="produit"], .product-image');
  
  console.log(`🔢 ${productImages.length} images de produits trouvées`);
  
  // Appliquer la réparation à chaque image
  productImages.forEach((img) => {
    fixProductImage(img as HTMLImageElement);
  });
  
  // Réparer également toutes les images qui ont une source cassée
  const allImages = document.querySelectorAll('img');
  allImages.forEach((img) => {
    if (img instanceof HTMLImageElement) {
      img.onerror = function() {
        console.log(`🔄 Image détectée avec erreur de chargement: ${img.src}`);
        fixProductImage(img);
        return true;
      };
      
      // Si l'image est déjà cassée (erreur déjà déclenchée), la réparer immédiatement
      if (!img.complete || img.naturalWidth === 0) {
        fixProductImage(img);
      }
    }
  });
  
  // Également rechercher les images qui ont échoué
  const failedImages = document.querySelectorAll('img[src=""]');
  failedImages.forEach((img) => {
    console.log('🚨 Image avec src vide détectée');
    if (img.getAttribute('data-src')) {
      // Essayer d'utiliser le data-src si disponible
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        (img as HTMLImageElement).src = dataSrc;
        fixProductImage(img as HTMLImageElement);
      }
    }
  });
}

/**
 * Observer pour réparer automatiquement les images quand elles sont ajoutées ou modifiées
 */
export function setupImageRepairObserver(): void {
  // Observer les changements dans le DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const target = mutation.target as HTMLElement;
        if (target.tagName === 'IMG' && target instanceof HTMLImageElement) {
          // Si l'image a un src vide ou qui contient "undefined"
          if (!target.src || target.src.includes('undefined') || target.src.includes('null')) {
            fixProductImage(target);
          }
        }
      } else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            fixProductImage(node);
          } else if (node instanceof HTMLElement) {
            // Chercher les images dans le nœud ajouté
            const images = node.querySelectorAll('img');
            images.forEach((img) => fixProductImage(img));
          }
        });
      }
    });
  });
  
  // Observer tout le document pour les changements d'attributs src et les nouveaux nœuds
  observer.observe(document.body, { 
    attributes: true,
    attributeFilter: ['src'],
    childList: true,
    subtree: true
  });
  
  console.log('🔄 Observateur de réparation d\'images installé');
}

/**
 * Fonction principale à appeler pour fixer les problèmes d'images
 */
export function fixAllProductImages(): void {
  console.log('🛠️ Démarrage de la correction des images de produits');
  
  // 1. Réparer les images existantes
  repairAllProductImages();
  
  // 2. Installer l'observateur pour les futures images
  setupImageRepairObserver();
  
  // 3. Afficher les résultats après un court délai
  setTimeout(() => {
    console.log(`📊 Statistiques de réparation d'images:`);
    console.log(`✅ Images chargées: ${productImageStats.loaded}`);
    console.log(`🔄 Images réparées: ${productImageStats.fixed}`);
    console.log(`❌ Échecs: ${productImageStats.failed}`);
    
    if (productImageStats.failed > 0) {
      console.log('❗ Images problématiques:');
      productImageStats.errors.forEach((error, path) => {
        console.error(`  - ${path}: ${error}`);
      });
    }
  }, 2000);
}
