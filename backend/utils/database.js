const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const dbFiles = {
  customers: path.join(dataDir, 'customers.json'),
  orders: path.join(dataDir, 'orders.json'),
  orderItems: path.join(dataDir, 'order-items.json'),
  deliveryAddresses: path.join(dataDir, 'delivery-addresses.json'),
  deliveryZones: path.join(dataDir, 'delivery-zones.json'),
  adminUsers: path.join(dataDir, 'admin-users.json')
};

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Classe pour gérer la base de données JSON
class DatabaseManager {
  constructor() {
    this.data = {};
    this.nextIds = {};
  }

  // Connexion à la base de données (charger les fichiers)
  async connect() {
    try {
      for (const [table, filePath] of Object.entries(dbFiles)) {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          this.data[table] = JSON.parse(content);
        } else {
          this.data[table] = [];
        }
        
        // Calculer le prochain ID
        this.nextIds[table] = this.data[table].length > 0 
          ? Math.max(...this.data[table].map(item => item.id || 0)) + 1 
          : 1;
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Sauvegarder une table
  _saveTable(table) {
    const filePath = dbFiles[table];
    fs.writeFileSync(filePath, JSON.stringify(this.data[table], null, 2));
  }

  // Fermer la connexion
  close() {
    return Promise.resolve();
  }

  // Simuler une requête SELECT (une ligne)
  async get(sql, params = []) {
    // Parser simple pour les requêtes de base
    const sqlLower = sql.toLowerCase();
    
    if (sqlLower.includes('from customers')) {
      const customers = this.data.customers || [];
      if (sqlLower.includes('where phone = ?')) {
        return customers.find(c => c.phone === params[0]) || null;
      }
      if (sqlLower.includes('where id = ?')) {
        return customers.find(c => c.id === parseInt(params[0])) || null;
      }
    }
    
    if (sqlLower.includes('from orders')) {
      const orders = this.data.orders || [];
      if (sqlLower.includes('where order_number = ?')) {
        return orders.find(o => o.order_number === params[0]) || null;
      }
      if (sqlLower.includes('where id = ?')) {
        return orders.find(o => o.id === parseInt(params[0])) || null;
      }
    }
    
    if (sqlLower.includes('from admin_users')) {
      const users = this.data.adminUsers || [];
      if (sqlLower.includes('where username = ?')) {
        return users.find(u => u.username === params[0] && u.is_active) || null;
      }
    }
    
    if (sqlLower.includes('from delivery_zones')) {
      const zones = this.data.deliveryZones || [];
      if (sqlLower.includes('where id = ?')) {
        return zones.find(z => z.id === parseInt(params[0])) || null;
      }
    }
    
    return null;
  }

  // Simuler une requête SELECT (plusieurs lignes)
  async all(sql, params = []) {
    const sqlLower = sql.toLowerCase();
    
    if (sqlLower.includes('from delivery_zones')) {
      return this.data.deliveryZones || [];
    }
    
    if (sqlLower.includes('from orders')) {
      let orders = this.data.orders || [];
      
      // Filtres simples
      if (sqlLower.includes('where status = ?')) {
        orders = orders.filter(o => o.status === params[0]);
      }
      
      // Tri par date
      if (sqlLower.includes('order by created_at desc')) {
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      
      // Limite
      if (sqlLower.includes('limit')) {
        const limitMatch = sql.match(/limit\s+(\d+)/i);
        if (limitMatch) {
          orders = orders.slice(0, parseInt(limitMatch[1]));
        }
      }
      
      return orders;
    }
    
    if (sqlLower.includes('from order_items')) {
      const orderItems = this.data.orderItems || [];
      if (sqlLower.includes('where order_id = ?')) {
        return orderItems.filter(item => item.order_id === parseInt(params[0]));
      }
    }
    
    if (sqlLower.includes('from delivery_addresses')) {
      const addresses = this.data.deliveryAddresses || [];
      if (sqlLower.includes('where customer_id = ?')) {
        return addresses.filter(addr => addr.customer_id === parseInt(params[0]));
      }
    }
    
    return [];
  }

  // Simuler une requête INSERT/UPDATE/DELETE
  async run(sql, params = []) {
    const sqlLower = sql.toLowerCase();
    
    if (sqlLower.startsWith('insert into customers')) {
      const customer = {
        id: this.nextIds.customers++,
        name: params[0],
        phone: params[1],
        email: params[2],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.data.customers.push(customer);
      this._saveTable('customers');
      return { lastID: customer.id, changes: 1 };
    }
    
    if (sqlLower.startsWith('insert into orders')) {
      const order = {
        id: this.nextIds.orders++,
        order_number: params[0],
        customer_id: params[1],
        delivery_address_id: params[2],
        shop: params[3],
        status: 'pending',
        payment_method: 'cash_on_delivery',
        payment_status: 'pending',
        subtotal: params[4],
        delivery_fee: params[5],
        total: params[6],
        delivery_time_requested: params[7],
        delivery_notes: params[8],
        estimated_delivery: params[9],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.data.orders.push(order);
      this._saveTable('orders');
      return { lastID: order.id, changes: 1 };
    }
    
    if (sqlLower.startsWith('insert into order_items')) {
      const item = {
        id: this.nextIds.orderItems++,
        order_id: params[0],
        product_id: params[1],
        product_name: params[2],
        size: params[3],
        quantity: params[4],
        unit_price: params[5],
        total_price: params[6],
        special_instructions: params[7]
      };
      this.data.orderItems.push(item);
      this._saveTable('orderItems');
      return { lastID: item.id, changes: 1 };
    }
    
    if (sqlLower.startsWith('insert into delivery_addresses')) {
      const address = {
        id: this.nextIds.deliveryAddresses++,
        customer_id: params[0],
        address_line: params[1],
        commune: params[2],
        wilaya: params[3],
        postal_code: params[4],
        landmark: params[5],
        delivery_zone: params[6],
        is_default: 0,
        created_at: new Date().toISOString()
      };
      this.data.deliveryAddresses.push(address);
      this._saveTable('deliveryAddresses');
      return { lastID: address.id, changes: 1 };
    }
    
    if (sqlLower.startsWith('update orders')) {
      const orders = this.data.orders || [];
      let changes = 0;
      
      if (sqlLower.includes('where order_number = ?')) {
        const orderNumber = params[params.length - 1];
        const order = orders.find(o => o.order_number === orderNumber);
        if (order) {
          if (sqlLower.includes('set status = ?')) {
            order.status = params[0];
            order.updated_at = new Date().toISOString();
            if (params[0] === 'delivered') {
              order.delivered_at = new Date().toISOString();
            }
            changes = 1;
          }
        }
      }
      
      if (changes > 0) {
        this._saveTable('orders');
      }
      return { changes };
    }
    
    return { lastID: 0, changes: 0 };
  }

  // Transaction simple
  async transaction(callback) {
    try {
      return await callback(this);
    } catch (error) {
      throw error;
    }
  }

  // Initialiser les données par défaut
  async initDefaultData() {
    // Zones de livraison par défaut
    if (!this.data.deliveryZones || this.data.deliveryZones.length === 0) {
      this.data.deliveryZones = [
        {
          id: 1,
          name: 'Zone 1 - Proche',
          communes: ["Hydra", "Ben Aknoun", "Dely Ibrahim", "Cheraga", "Ain Allah"],
          delivery_fee: 200,
          estimated_time_min: 20,
          estimated_time_max: 35,
          is_active: true
        },
        {
          id: 2,
          name: 'Zone 2 - Moyenne',
          communes: ["Alger Centre", "Bab Ezzouar", "Kouba", "Birtouta", "Zeralda"],
          delivery_fee: 300,
          estimated_time_min: 35,
          estimated_time_max: 50,
          is_active: true
        },
        {
          id: 3,
          name: 'Zone 3 - Éloignée',
          communes: ["Blida", "Boumerdes", "Tipaza", "Boufarik"],
          delivery_fee: 400,
          estimated_time_min: 45,
          estimated_time_max: 70,
          is_active: true
        }
      ];
      this._saveTable('deliveryZones');
    }
    
    // Utilisateur admin par défaut
    if (!this.data.adminUsers || this.data.adminUsers.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      this.data.adminUsers = [
        {
          id: 1,
          username: 'admin',
          password_hash: hashedPassword,
          role: 'admin',
          shop: null,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      this._saveTable('adminUsers');
    }
  }
}

// Instance singleton
let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
  }
  return dbInstance;
}

// Middleware pour s'assurer que la DB est connectée
async function ensureConnection(req, res, next) {
  try {
    const db = getDatabase();
    if (!db.data.customers) {
      await db.connect();
    }
    req.db = db;
    next();
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    res.status(500).json({ error: 'Erreur de base de données' });
  }
}

module.exports = {
  DatabaseManager,
  getDatabase,
  ensureConnection
};
