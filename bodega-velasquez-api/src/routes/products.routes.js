const express = require('express');
const asyncHandler = require('../utils/async-handler');
const requireAdmin = require('../middleware/require-admin');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products.controller');

const router = express.Router();

router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProductById));
router.post('/', requireAdmin, asyncHandler(createProduct));
router.put('/:id', requireAdmin, asyncHandler(updateProduct));
router.delete('/:id', requireAdmin, asyncHandler(deleteProduct));

module.exports = router;
