/**
 * Utilitaire de diagnostic avancé pour les problèmes d'images
 */

import { menuItems } from '../data/menuItems';

interface DiagnosticResult {
  path: string;
  exists: boolean;
  error?: string;
  encodedPath?: string;
  encodedExists?: boolean;
}

/**
 * Teste si une image existe en essayant différentes variantes
 */
export async function testImagePath(imagePath: string): Promise<DiagnosticResult> {
  const result: DiagnosticResult = {
    path: imagePath,
    exists: false
  };

  try {
    // Test du chemin original
    const response = await fetch(imagePath, { method: 'HEAD' });
    result.exists = response.ok;
    
    if (!result.exists) {
      result.error = `HTTP ${response.status}`;
      
      // Essayer avec l'encodage URL pour les caractères accentués
      const encodedPath = encodeURI(imagePath);
      if (encodedPath !== imagePath) {
        result.encodedPath = encodedPath;
        const encodedResponse = await fetch(encodedPath, { method: 'HEAD' });
        result.encodedExists = encodedResponse.ok;
      }
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Erreur inconnue';
  }

  return result;
}

/**
 * Diagnostique toutes les images du menu
 */
export async function diagnoseAllMenuImages(): Promise<DiagnosticResult[]> {
  console.log('🔍 Démarrage du diagnostic des images du menu...');
  
  const imagePaths = menuItems.map(item => item.image);
  const uniquePaths = [...new Set(imagePaths)];
  
  console.log(`📊 ${uniquePaths.length} images uniques à tester`);
  
  const results: DiagnosticResult[] = [];
  
  for (const imagePath of uniquePaths) {
    console.log(`🧪 Test de: ${imagePath}`);
    const result = await testImagePath(imagePath);
    results.push(result);
    
    if (result.exists) {
      console.log(`✅ ${imagePath} - OK`);
    } else if (result.encodedExists) {
      console.log(`⚠️ ${imagePath} - OK avec encodage: ${result.encodedPath}`);
    } else {
      console.log(`❌ ${imagePath} - ÉCHEC: ${result.error}`);
    }
  }
  
  return results;
}

/**
 * Affiche un rapport détaillé des résultats
 */
export function displayDiagnosticReport(results: DiagnosticResult[]): void {
  const successful = results.filter(r => r.exists);
  const encodingNeeded = results.filter(r => !r.exists && r.encodedExists);
  const failed = results.filter(r => !r.exists && !r.encodedExists);
  
  console.log('\n📋 RAPPORT DE DIAGNOSTIC DES IMAGES');
  console.log('=====================================');
  console.log(`✅ Images OK: ${successful.length}`);
  console.log(`⚠️ Images nécessitant un encodage: ${encodingNeeded.length}`);
  console.log(`❌ Images introuvables: ${failed.length}`);
  
  if (encodingNeeded.length > 0) {
    console.log('\n⚠️ IMAGES NÉCESSITANT UN ENCODAGE:');
    encodingNeeded.forEach(result => {
      console.log(`  - ${result.path} → ${result.encodedPath}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ IMAGES INTROUVABLES:');
    failed.forEach(result => {
      console.log(`  - ${result.path} (${result.error})`);
    });
  }
}

/**
 * Fonction principale de diagnostic à appeler depuis la console
 */
export async function runImageDiagnostic(): Promise<void> {
  try {
    const results = await diagnoseAllMenuImages();
    displayDiagnosticReport(results);
    
    // Stocker les résultats dans une variable globale pour inspection
    (window as any).imageDiagnosticResults = results;
    console.log('\n💡 Résultats stockés dans window.imageDiagnosticResults');
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
}

// Exposer la fonction globalement pour utilisation dans la console
(window as any).runImageDiagnostic = runImageDiagnostic;
