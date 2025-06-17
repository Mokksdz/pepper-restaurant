const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { ensureConnection } = require('../utils/database');

const router = express.Router();

// Middleware pour toutes les routes
router.use(ensureConnection);

// Créer une nouvelle commande
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      deliveryAddress,
      items,
      shop = 'ainallah',
      deliveryTimeRequested,
      deliveryNotes
    } = req.body;

    // Validation des données
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ error: 'Informations client manquantes' });
    }

    if (!deliveryAddress || !deliveryAddress.address_line || !deliveryAddress.commune) {
      return res.status(400).json({ error: 'Adresse de livraison manquante' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Aucun article dans la commande' });
    }

    const db = req.db;
    const orderNumber = `PEP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const result = await db.transaction(async (db) => {
      // 1. Créer ou récupérer le client
      let customerId;
      const existingCustomer = await db.get(
        'SELECT id FROM customers WHERE phone = ?',
        [customer.phone]
      );

      if (existingCustomer) {
        customerId = existingCustomer.id;
        // Mettre à jour les infos si nécessaire
        await db.run(
          'UPDATE customers SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [customer.name, customer.email || null, customerId]
        );
      } else {
        const customerResult = await db.run(
          'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)',
          [customer.name, customer.phone, customer.email || null]
        );
        customerId = customerResult.lastID;
      }

      // 2. Créer l'adresse de livraison
      const addressResult = await db.run(
        `INSERT INTO delivery_addresses 
         (customer_id, address_line, commune, wilaya, postal_code, landmark, delivery_zone) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          deliveryAddress.address_line,
          deliveryAddress.commune,
          deliveryAddress.wilaya || 'Alger',
          deliveryAddress.postal_code || null,
          deliveryAddress.landmark || null,
          deliveryAddress.delivery_zone || 1
        ]
      );
      const deliveryAddressId = addressResult.lastID;

      // 3. Calculer les montants
      let subtotal = 0;
      for (const item of items) {
        subtotal += item.unit_price * item.quantity;
      }

      // 4. Calculer les frais de livraison selon la zone
      const zone = await db.get(
        'SELECT delivery_fee FROM delivery_zones WHERE id = ?',
        [deliveryAddress.delivery_zone || 1]
      );
      const deliveryFee = zone ? zone.delivery_fee : 200;
      const total = subtotal + deliveryFee;

      // 5. Créer la commande
      const orderResult = await db.run(
        `INSERT INTO orders 
         (order_number, customer_id, delivery_address_id, shop, subtotal, delivery_fee, total, 
          delivery_time_requested, delivery_notes, estimated_delivery) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+45 minutes'))`,
        [
          orderNumber,
          customerId,
          deliveryAddressId,
          shop,
          subtotal,
          deliveryFee,
          total,
          deliveryTimeRequested || null,
          deliveryNotes || null
        ]
      );
      const orderId = orderResult.lastID;

      // 6. Ajouter les articles
      for (const item of items) {
        await db.run(
          `INSERT INTO order_items 
           (order_id, product_id, product_name, size, quantity, unit_price, total_price, special_instructions) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.product_id,
            item.product_name,
            item.size || 'normal',
            item.quantity,
            item.unit_price,
            item.unit_price * item.quantity,
            item.special_instructions || null
          ]
        );
      }

      return { orderId, orderNumber, total, deliveryFee };
    });

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order: {
        id: result.orderId,
        orderNumber: result.orderNumber,
        total: result.total,
        deliveryFee: result.deliveryFee,
        estimatedDelivery: '45 minutes'
      }
    });

  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

// Récupérer une commande par numéro
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const db = req.db;

    const order = await db.get(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone,
             da.address_line, da.commune, da.wilaya, da.landmark
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN delivery_addresses da ON o.delivery_address_id = da.id
      WHERE o.order_number = ?
    `, [orderNumber]);

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const items = await db.all(`
      SELECT * FROM order_items WHERE order_id = ?
    `, [order.id]);

    res.json({
      ...order,
      items
    });

  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
});

// Mettre à jour le statut d'une commande
router.patch('/:orderNumber/status', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const db = req.db;
    const result = await db.run(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP,
          delivered_at = CASE WHEN ? = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END
      WHERE order_number = ?
    `, [status, status, orderNumber]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    res.json({ success: true, message: 'Statut mis à jour' });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

// Lister les commandes (pour admin)
router.get('/', async (req, res) => {
  try {
    const { status, shop, limit = 50, offset = 0 } = req.query;
    const db = req.db;

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause += ' WHERE o.status = ?';
      params.push(status);
    }

    if (shop) {
      whereClause += (whereClause ? ' AND' : ' WHERE') + ' o.shop = ?';
      params.push(shop);
    }

    const orders = await db.all(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    res.json(orders);

  } catch (error) {
    console.error('Erreur liste commandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

module.exports = router;
