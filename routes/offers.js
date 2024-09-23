const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Rota para obter ofertas com filtros e ordenação
router.get('/', offerController.getFormattedOffers);

module.exports = router;
