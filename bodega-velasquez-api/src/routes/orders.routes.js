const express = require('express');
const asyncHandler = require('../utils/async-handler');
const requireAdmin = require('../middleware/require-admin');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} = require('../controllers/orders.controller');

const router = express.Router();

router.get('/', requireAdmin, asyncHandler(getOrders));
router.get('/:id', requireAdmin, asyncHandler(getOrderById));
router.post('/', asyncHandler(createOrder));
router.patch('/:id/status', requireAdmin, asyncHandler(updateOrderStatus));

module.exports = router;
