const express = require('express');
const asyncHandler = require('../utils/async-handler');
const requireAdmin = require('../middleware/require-admin');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customers.controller');

const router = express.Router();

router.get('/', requireAdmin, asyncHandler(getCustomers));
router.get('/:id', requireAdmin, asyncHandler(getCustomerById));
router.post('/', requireAdmin, asyncHandler(createCustomer));
router.put('/:id', requireAdmin, asyncHandler(updateCustomer));
router.delete('/:id', requireAdmin, asyncHandler(deleteCustomer));

module.exports = router;
