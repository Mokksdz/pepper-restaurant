const express = require('express');
const { ensureConnection } = require('../utils/database');

const router = express.Router();
router.use(ensureConnection);

// Récupérer un client par téléphone
router.get('/phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const db = req.db;

    const customer = await db.get(
      'SELECT * FROM customers WHERE phone = ?',
      [phone]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    // Récupérer les adresses du client
    const addresses = await db.all(
      'SELECT * FROM delivery_addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC',
      [customer.id]
    );

    // Récupérer l'historique des commandes
    const orders = await db.all(`
      SELECT order_number, status, total, created_at 
      FROM orders 
      WHERE customer_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `, [customer.id]);

    res.json({
      ...customer,
      addresses,
      recent_orders: orders
    });

  } catch (error) {
    console.error('Erreur récupération client:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du client' });
  }
});

// Créer ou mettre à jour un client
router.post('/', async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Nom et téléphone requis' });
    }

    const db = req.db;

    // Vérifier si le client existe déjà
    const existingCustomer = await db.get(
      'SELECT id FROM customers WHERE phone = ?',
      [phone]
    );

    let customerId;
    if (existingCustomer) {
      // Mettre à jour
      await db.run(
        'UPDATE customers SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE phone = ?',
        [name, email || null, phone]
      );
      customerId = existingCustomer.id;
    } else {
      // Créer nouveau
      const result = await db.run(
        'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email || null]
      );
      customerId = result.lastID;
    }

    const customer = await db.get('SELECT * FROM customers WHERE id = ?', [customerId]);
    res.json(customer);

  } catch (error) {
    console.error('Erreur création/mise à jour client:', error);
    res.status(500).json({ error: 'Erreur lors de la gestion du client' });
  }
});

// Ajouter une adresse de livraison
router.post('/:customerId/addresses', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { address_line, commune, wilaya, postal_code, landmark, delivery_zone, is_default } = req.body;

    if (!address_line || !commune) {
      return res.status(400).json({ error: 'Adresse et commune requises' });
    }

    const db = req.db;

    // Si cette adresse est définie comme par défaut, retirer le défaut des autres
    if (is_default) {
      await db.run(
        'UPDATE delivery_addresses SET is_default = 0 WHERE customer_id = ?',
        [customerId]
      );
    }

    const result = await db.run(`
      INSERT INTO delivery_addresses 
      (customer_id, address_line, commune, wilaya, postal_code, landmark, delivery_zone, is_default) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      customerId,
      address_line,
      commune,
      wilaya || 'Alger',
      postal_code || null,
      landmark || null,
      delivery_zone || 1,
      is_default ? 1 : 0
    ]);

    const address = await db.get('SELECT * FROM delivery_addresses WHERE id = ?', [result.lastID]);
    res.status(201).json(address);

  } catch (error) {
    console.error('Erreur ajout adresse:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'adresse' });
  }
});

module.exports = router;
