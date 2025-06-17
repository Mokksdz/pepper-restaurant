const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ensureConnection } = require('../utils/database');

const router = express.Router();
router.use(ensureConnection);

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Connexion admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const db = req.db;
    const user = await db.get(
      'SELECT * FROM admin_users WHERE username = ? AND is_active = 1',
      [username]
    );

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        shop: user.shop 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        shop: user.shop
      }
    });

  } catch (error) {
    console.error('Erreur connexion admin:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Dashboard - statistiques
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const today = new Date().toISOString().split('T')[0];

    // Statistiques du jour
    const todayStats = await db.get(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing_orders,
        COUNT(CASE WHEN status = 'delivering' THEN 1 END) as delivering_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
      FROM orders 
      WHERE DATE(created_at) = ?
    `, [today]);

    // Commandes récentes
    const recentOrders = await db.all(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Statistiques par magasin
    const shopStats = await db.all(`
      SELECT 
        shop,
        COUNT(*) as orders_count,
        SUM(total) as revenue
      FROM orders 
      WHERE DATE(created_at) = ?
      GROUP BY shop
    `, [today]);

    res.json({
      today: {
        date: today,
        ...todayStats,
        total_revenue: todayStats.total_revenue || 0
      },
      recent_orders: recentOrders,
      shop_stats: shopStats
    });

  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du dashboard' });
  }
});

// Lister toutes les commandes avec filtres
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { 
      status, 
      shop, 
      date_from, 
      date_to, 
      limit = 50, 
      offset = 0,
      search 
    } = req.query;

    const db = req.db;
    let whereClause = '';
    const params = [];

    // Construire les filtres
    const conditions = [];

    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }

    if (shop) {
      conditions.push('o.shop = ?');
      params.push(shop);
    }

    if (date_from) {
      conditions.push('DATE(o.created_at) >= ?');
      params.push(date_from);
    }

    if (date_to) {
      conditions.push('DATE(o.created_at) <= ?');
      params.push(date_to);
    }

    if (search) {
      conditions.push('(o.order_number LIKE ? OR c.name LIKE ? OR c.phone LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const orders = await db.all(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
             da.address_line, da.commune, da.wilaya
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN delivery_addresses da ON o.delivery_address_id = da.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Compter le total pour la pagination
    const countResult = await db.get(`
      SELECT COUNT(*) as total
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ${whereClause}
    `, params);

    res.json({
      orders,
      pagination: {
        total: countResult.total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: countResult.total > parseInt(offset) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur liste commandes admin:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// Détails d'une commande
router.get('/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const db = req.db;

    const order = await db.get(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
             da.address_line, da.commune, da.wilaya, da.landmark, da.postal_code
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN delivery_addresses da ON o.delivery_address_id = da.id
      WHERE o.id = ?
    `, [orderId]);

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const items = await db.all(`
      SELECT * FROM order_items WHERE order_id = ?
    `, [orderId]);

    res.json({
      ...order,
      items
    });

  } catch (error) {
    console.error('Erreur détails commande:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
});

// Mettre à jour le statut d'une commande
router.patch('/orders/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
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
      WHERE id = ?
    `, [status, status, orderId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    res.json({ success: true, message: 'Statut mis à jour' });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

module.exports = router;
