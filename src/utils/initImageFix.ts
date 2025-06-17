// Script d'initialisation pour corriger les problèmes d'affichage des photos produits
import { fixAllProductImages } from './imageFixUtility';

/**
 * Fonction d'initialisation du correctif d'images
 */
export function initImageFix(): void {
  console.log(' Correctif d\'images temporairement désactivé pour éviter le clignotement');
  
  // TEMPORAIREMENT DÉSACTIVÉ - Le système de correction automatique causait
  // un clignotement des images qui s'affichaient correctement
  // 
  // Pour réactiver, décommenter le code ci-dessous :
  /*
  // Attendre que le DOM soit complètement chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(fixAllProductImages, 100);
    });
  } else {
    // Si le DOM est déjà chargé
    setTimeout(fixAllProductImages, 100);
  }
  
  // Réappliquer après le chargement complet de la page pour les images chargées en différé
  window.addEventListener('load', () => {
    setTimeout(fixAllProductImages, 500);
  });
  */
}

// Exécution automatique du correctif
initImageFix();
