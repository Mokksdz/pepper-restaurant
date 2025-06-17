// Utilitaire pour charger les images correctement avec Vite
interface ImageCache {
  [key: string]: string;
}

// Cache pour ne pas répéter les mêmes corrections
const imageCache: ImageCache = {};

// Fonction d'échappement pour double vérifier les chemins
function ensureValidPath(path: string): string {
  // Supprimer les doubles slashs potentiels
  return path.replace(/\/\//g, '/');
}

// Vérifier si l'image existe réellement
function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => {
      console.error(`🚫 Image introuvable: ${url}`);
      resolve(false);
    };
    img.src = url;
  });
}

export async function preloadImage(imagePath: string): Promise<boolean> {
  const url = getImageUrl(imagePath);
  return await checkImageExists(url);
}

export function getImageUrl(imagePath: string): string {
  console.log(`📦 getImageUrl reçoit le chemin: ${imagePath}`);
  
  // Vérifier le cache
  if (imageCache[imagePath]) {
    return imageCache[imagePath];
  }
  
  // Si aucun chemin n'est fourni, on renvoie une image par défaut
  if (!imagePath) {
    console.warn('⚠️ Chemin d\'image vide détecté');
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  }

  let result = imagePath;

  // 1. Les URLs absolues (http, https, //) sont retournées telles quelles
  if (/^(https?:)?\/\//.test(imagePath)) {
    console.log(`🌐 URL absolue détectée: ${imagePath}`);
    imageCache[imagePath] = imagePath;
    return imagePath;
  }

  // 2. Si le chemin commence déjà par "/assets/", il fait référence au dossier public
  if (imagePath.startsWith('/assets/')) {
    console.log(`💾 Chemin public déjà correct: ${imagePath}`);
    result = imagePath;
  }
  // 3. Supprimer toute référence à /src/assets/ (anciens chemins)
  else if (imagePath.includes('/src/assets/')) {
    result = imagePath.replace('/src/assets/', '/assets/');
    console.log(`📂 Correction du chemin src: ${imagePath} -> ${result}`);
  }
  // 4. Si le chemin commence par "/" (mais pas /assets/), on suppose qu'il pointe vers le dossier assets
  else if (imagePath.startsWith('/')) {
    if (!imagePath.startsWith('/assets/images/')) {
      result = `/assets/images${imagePath}`;
      console.log(`📍 Correction du chemin absolu: ${imagePath} -> ${result}`);
    } else {
      console.log(`📑 Chemin absolu déjà correct: ${imagePath}`);
      result = imagePath;
    }
  }
  // 5. Pour les chemins relatifs qui contiennent déjà le nom d'un sous-dossier d'images (burgers, desserts, etc.)
  else if (/^(burgers|desserts|boissons|sides|sandwichs|Logo)\//i.test(imagePath)) {
    result = `/assets/images/${imagePath}`;
    console.log(`🍔 Chemin de catégorie détecté et corrigé: ${imagePath} -> ${result}`);
  }
  // 6. Pour tous les autres chemins relatifs
  else {
    // Vérifier s'il s'agit d'un fichier image direct sans dossier de catégorie
    const isImageFile = /\.(jpe?g|png|gif|svg|webp)$/i.test(imagePath);
    if (isImageFile) {
      // Essayer de deviner la catégorie à partir du nom de fichier
      let category = 'divers';
      const lowerFileName = imagePath.toLowerCase();
      
      if (lowerFileName.includes('burger') || lowerFileName.includes('blue') || 
          lowerFileName.includes('cheese') || lowerFileName.includes('egg') || 
          lowerFileName.includes('forest') || lowerFileName.includes('rossini') || 
          lowerFileName.includes('smash') || lowerFileName.includes('chicken')) {
        category = 'burgers';
      } else if (lowerFileName.includes('frite') || lowerFileName.includes('side') || 
                lowerFileName.includes('onion') || lowerFileName.includes('nugget')) {
        category = 'sides';
      } else if (lowerFileName.includes('dessert') || lowerFileName.includes('glace') || 
                lowerFileName.includes('cookie') || lowerFileName.includes('brownie')) {
        category = 'desserts';
      } else if (lowerFileName.includes('boisson') || lowerFileName.includes('soda') || 
                lowerFileName.includes('cola') || lowerFileName.includes('drink')) {
        category = 'boissons';
      } else if (lowerFileName.includes('sandwich')) {
        category = 'sandwichs';
      }
      
      result = `/assets/images/${category}/${imagePath}`;
      console.log(`🧠 Image détectée, catégorie devinée: ${category}, chemin: ${result}`);
    } else {
      result = `/assets/images/${imagePath}`;
      console.log(`📓 Chemin relatif corrigé: ${imagePath} -> ${result}`);
    }
  }

  // Nettoyer le chemin final
  result = ensureValidPath(result);
  
  // Mettre en cache
  imageCache[imagePath] = result;
  
  console.log(`🔍 Chemin final: ${result}`);
  return result;
}
