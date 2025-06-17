-- Base de données Pepper Restaurant
-- Tables pour gérer les commandes, clients et livraisons

-- Table des clients
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des adresses de livraison
CREATE TABLE IF NOT EXISTS delivery_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    address_line TEXT NOT NULL,
    wilaya TEXT NOT NULL DEFAULT 'Alger',
    commune TEXT NOT NULL,
    postal_code TEXT,
    landmark TEXT,
    delivery_zone INTEGER DEFAULT 1, -- 1=proche, 2=moyen, 3=loin
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    delivery_address_id INTEGER NOT NULL,
    shop TEXT NOT NULL DEFAULT 'ainallah', -- ainallah ou gardencity
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, preparing, ready, delivering, delivered, cancelled
    payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
    payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed
    
    -- Montants
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Informations livraison
    delivery_time_requested TEXT, -- créneau souhaité
    delivery_notes TEXT,
    estimated_delivery DATETIME,
    delivered_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (delivery_address_id) REFERENCES delivery_addresses(id)
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id TEXT NOT NULL, -- ID du produit depuis menuItems.ts
    product_name TEXT NOT NULL,
    size TEXT NOT NULL DEFAULT 'normal', -- normal, xl, xxl
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Table des zones de livraison
CREATE TABLE IF NOT EXISTS delivery_zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    communes TEXT NOT NULL, -- JSON array des communes
    delivery_fee DECIMAL(10,2) NOT NULL,
    estimated_time_min INTEGER NOT NULL, -- temps minimum en minutes
    estimated_time_max INTEGER NOT NULL, -- temps maximum en minutes
    is_active BOOLEAN DEFAULT 1
);

-- Table des utilisateurs admin
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin', -- admin, manager, staff
    shop TEXT, -- ainallah, gardencity, ou NULL pour tous
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Insertion des zones de livraison par défaut
INSERT OR IGNORE INTO delivery_zones (id, name, communes, delivery_fee, estimated_time_min, estimated_time_max) VALUES
(1, 'Zone 1 - Proche', '["Hydra", "Ben Aknoun", "Dely Ibrahim", "Cheraga", "Ain Allah"]', 200, 20, 35),
(2, 'Zone 2 - Moyenne', '["Alger Centre", "Bab Ezzouar", "Kouba", "Birtouta", "Zeralda"]', 300, 35, 50),
(3, 'Zone 3 - Éloignée', '["Blida", "Boumerdes", "Tipaza", "Boufarik"]', 400, 45, 70);

-- Insertion d'un utilisateur admin par défaut (mot de passe: admin123)
INSERT OR IGNORE INTO admin_users (id, username, password_hash, role) VALUES
(1, 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
