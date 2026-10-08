const express = require('express');
const router = express.Router();
const { getPromotions, getPromotionById } = require('../controllers/promotions.controller');

router.get('/', getPromotions);
router.get('/:id', getPromotionById);

module.exports = router;