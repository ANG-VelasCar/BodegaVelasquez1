const express = require('express');
const asyncHandler = require('../utils/async-handler');
const requireAdmin = require('../middleware/require-admin');
const {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion
} = require('../controllers/promotions.controller');

const router = express.Router();

router.get('/', asyncHandler(getPromotions));
router.get('/:id', asyncHandler(getPromotionById));
router.post('/', requireAdmin, asyncHandler(createPromotion));
router.put('/:id', requireAdmin, asyncHandler(updatePromotion));
router.delete('/:id', requireAdmin, asyncHandler(deletePromotion));

module.exports = router;
