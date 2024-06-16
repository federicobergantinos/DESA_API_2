const express = require('express');
const router = express.Router();
const { getRateByCurrency, getAllRates } = require('../controllers/exchangeRateController');

router.get('/:currency', getRateByCurrency);
router.get('/', getAllRates);

module.exports = router;
