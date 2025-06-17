const express = require('express');
const { ensureConnection } = require('../utils/database');

const router = express.Router();
router.use(ensureConnection);

// Récupérer les zones de livraison
router.get('/zones', async (req, res) => {
  try {
    const db = req.db;
    const zones = await db.all('SELECT * FROM delivery_zones WHERE is_active = 1 ORDER BY id');
    
    // Parser les communes JSON
    const zonesWithCommunes = zones.map(zone => ({
      ...zone,
      communes: JSON.parse(zone.communes)
    }));

    res.json(zonesWithCommunes);
  } catch (error) {
    console.error('Erreur récupération zones:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des zones' });
  }
});

// Calculer les frais de livraison pour une commune
router.post('/calculate-fee', async (req, res) => {
  try {
    const { commune } = req.body;

    if (!commune) {
      return res.status(400).json({ error: 'Commune requise' });
    }

    const db = req.db;
    const zones = await db.all('SELECT * FROM delivery_zones WHERE is_active = 1');

    let deliveryZone = null;
    let deliveryFee = 0;
    let estimatedTime = { min: 30, max: 60 };

    // Trouver la zone correspondante
    for (const zone of zones) {
      const communes = JSON.parse(zone.communes);
      if (communes.some(c => c.toLowerCase().includes(commune.toLowerCase()) || 
                            commune.toLowerCase().includes(c.toLowerCase()))) {
        deliveryZone = zone;
        deliveryFee = zone.delivery_fee;
        estimatedTime = { min: zone.estimated_time_min, max: zone.estimated_time_max };
        break;
      }
    }

    // Si aucune zone trouvée, utiliser la zone 2 par défaut
    if (!deliveryZone) {
      const defaultZone = zones.find(z => z.id === 2) || zones[0];
      if (defaultZone) {
        deliveryZone = defaultZone;
        deliveryFee = defaultZone.delivery_fee;
        estimatedTime = { min: defaultZone.estimated_time_min, max: defaultZone.estimated_time_max };
      }
    }

    res.json({
      commune,
      zone: deliveryZone ? {
        id: deliveryZone.id,
        name: deliveryZone.name,
        delivery_fee: deliveryFee,
        estimated_time: estimatedTime
      } : null,
      delivery_fee: deliveryFee,
      estimated_time: estimatedTime,
      can_deliver: deliveryZone !== null
    });

  } catch (error) {
    console.error('Erreur calcul frais:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des frais' });
  }
});

// Vérifier si une adresse est dans une zone de livraison
router.post('/check-coverage', async (req, res) => {
  try {
    const { address, commune, wilaya } = req.body;

    if (!commune) {
      return res.status(400).json({ error: 'Commune requise' });
    }

    const db = req.db;
    const zones = await db.all('SELECT * FROM delivery_zones WHERE is_active = 1');

    let coverage = {
      can_deliver: false,
      zone: null,
      delivery_fee: 0,
      estimated_time: { min: 30, max: 60 },
      message: 'Zone non couverte'
    };

    // Vérifier chaque zone
    for (const zone of zones) {
      const communes = JSON.parse(zone.communes);
      const isInZone = communes.some(c => 
        c.toLowerCase().includes(commune.toLowerCase()) || 
        commune.toLowerCase().includes(c.toLowerCase())
      );

      if (isInZone) {
        coverage = {
          can_deliver: true,
          zone: {
            id: zone.id,
            name: zone.name
          },
          delivery_fee: zone.delivery_fee,
          estimated_time: {
            min: zone.estimated_time_min,
            max: zone.estimated_time_max
          },
          message: `Livraison disponible - ${zone.name}`
        };
        break;
      }
    }

    res.json(coverage);

  } catch (error) {
    console.error('Erreur vérification couverture:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification de couverture' });
  }
});

// Récupérer les créneaux de livraison disponibles
router.get('/time-slots', async (req, res) => {
  try {
    const now = new Date();
    const slots = [];

    // Générer les créneaux pour aujourd'hui et demain
    for (let day = 0; day < 2; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      const dayName = day === 0 ? 'Aujourd\'hui' : 'Demain';
      const daySlots = [];

      // Créneaux de 11h à 22h
      for (let hour = 11; hour <= 22; hour++) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, 0, 0, 0);

        // Ne pas proposer les créneaux passés pour aujourd'hui
        if (day === 0 && slotTime <= now) {
          continue;
        }

        daySlots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          label: `${hour.toString().padStart(2, '0')}h00`,
          datetime: slotTime.toISOString(),
          available: true
        });
      }

      if (daySlots.length > 0) {
        slots.push({
          date: date.toISOString().split('T')[0],
          day: dayName,
          slots: daySlots
        });
      }
    }

    res.json(slots);

  } catch (error) {
    console.error('Erreur créneaux:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des créneaux' });
  }
});

module.exports = router;
