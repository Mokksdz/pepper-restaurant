# 🍔 Pepper Restaurant - Backend API

Backend pour la gestion des commandes et livraisons du restaurant Pepper.

## 🚀 Installation

```bash
cd backend
npm install
```

## ⚙️ Configuration

1. Copiez le fichier de configuration :
```bash
cp .env.example .env
```

2. Modifiez les variables dans `.env` selon vos besoins.

## 📦 Initialisation de la base de données

```bash
npm run init-db
```

Cela créera la base de données SQLite avec toutes les tables nécessaires.

## 🏃‍♂️ Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:3001`

## 📋 API Endpoints

### 🛍️ Commandes (`/api/orders`)

- `POST /api/orders` - Créer une nouvelle commande
- `GET /api/orders/:orderNumber` - Récupérer une commande
- `PATCH /api/orders/:orderNumber/status` - Mettre à jour le statut
- `GET /api/orders` - Lister les commandes (admin)

### 👥 Clients (`/api/customers`)

- `GET /api/customers/phone/:phone` - Récupérer un client par téléphone
- `POST /api/customers` - Créer/mettre à jour un client
- `POST /api/customers/:id/addresses` - Ajouter une adresse

### 🚚 Livraison (`/api/delivery`)

- `GET /api/delivery/zones` - Récupérer les zones de livraison
- `POST /api/delivery/calculate-fee` - Calculer les frais de livraison
- `POST /api/delivery/check-coverage` - Vérifier la couverture
- `GET /api/delivery/time-slots` - Créneaux de livraison

### 👨‍💼 Administration (`/api/admin`)

- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/dashboard` - Statistiques
- `GET /api/admin/orders` - Gestion des commandes
- `PATCH /api/admin/orders/:id/status` - Changer statut commande

## 📊 Structure de données

### Commande
```json
{
  "customer": {
    "name": "John Doe",
    "phone": "0555123456",
    "email": "john@example.com"
  },
  "deliveryAddress": {
    "address_line": "123 Rue Example",
    "commune": "Hydra",
    "wilaya": "Alger",
    "delivery_zone": 1
  },
  "items": [
    {
      "product_id": "burger-classic",
      "product_name": "Burger Classic",
      "size": "normal",
      "quantity": 2,
      "unit_price": 800
    }
  ],
  "shop": "ainallah",
  "deliveryNotes": "Sonner à l'interphone"
}
```

## 🔐 Authentification Admin

Utilisateur par défaut :
- **Username:** `admin`
- **Password:** `admin123`

## 🗃️ Base de données

Le backend utilise SQLite avec les tables suivantes :
- `customers` - Informations clients
- `delivery_addresses` - Adresses de livraison
- `orders` - Commandes
- `order_items` - Articles des commandes
- `delivery_zones` - Zones de livraison
- `admin_users` - Utilisateurs admin

## 🔧 Zones de livraison par défaut

1. **Zone 1** (200 DA) : Hydra, Ben Aknoun, Dely Ibrahim, Cheraga, Ain Allah
2. **Zone 2** (300 DA) : Alger Centre, Bab Ezzouar, Kouba, Birtouta, Zeralda
3. **Zone 3** (400 DA) : Blida, Boumerdes, Tipaza, Boufarik

## 📱 Intégration Frontend

Pour connecter le frontend au backend, utilisez l'URL de base :
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 🛡️ Sécurité

- Rate limiting (100 requêtes/15min)
- Helmet.js pour les headers de sécurité
- CORS configuré
- JWT pour l'authentification admin
- Validation des données d'entrée

## 📝 Logs

Les erreurs sont loggées dans la console. En production, configurez un système de logs approprié.

## 🚀 Déploiement

Pour déployer en production :

1. Configurez les variables d'environnement
2. Utilisez un reverse proxy (nginx)
3. Configurez HTTPS
4. Sauvegardez régulièrement la base de données

## 📞 Support

Pour toute question, contactez l'équipe de développement Pepper.
