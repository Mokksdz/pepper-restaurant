const { getDatabase } = require('../utils/database');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database');
const schemaPath = path.join(__dirname, '../database/schema.sql');

// Créer le dossier database s'il n'existe pas
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Initialiser la base de données
async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données JSON...');
    
    const db = getDatabase();
    await db.connect();
    console.log('✅ Connexion à la base de données établie');

    // Initialiser les données par défaut
    await db.initDefaultData();
    
    console.log('✅ Base de données initialisée avec succès');
    console.log('📊 Fichiers créés:');
    console.log('  - customers.json (clients)');
    console.log('  - orders.json (commandes)');
    console.log('  - order-items.json (articles de commande)');
    console.log('  - delivery-addresses.json (adresses de livraison)');
    console.log('  - delivery-zones.json (zones de livraison)');
    console.log('  - admin-users.json (utilisateurs admin)');
    console.log('');
    console.log('👤 Utilisateur admin par défaut:');
    console.log('  - Username: admin');
    console.log('  - Password: admin123');
    
    await db.close();
    console.log('✅ Base de données fermée');
    
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return Promise.reject(error);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Initialisation terminée avec succès!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Échec de l\'initialisation:', err);
      process.exit(1);
    });
}

module.exports = { initDatabase };
