const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController'); // Importação correta do controlador

// Definição da rota
router.get('/', offerController.getFormattedOffers);

module.exports = router;
