const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, createOrder } = require('../controllers/orders.controller');

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);

module.exports = router;