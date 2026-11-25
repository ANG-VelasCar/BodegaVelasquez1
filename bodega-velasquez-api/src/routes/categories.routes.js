const express = require('express');
const asyncHandler = require('../utils/async-handler');
const requireAdmin = require('../middleware/require-admin');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories.controller');

const router = express.Router();

router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategoryById));
router.post('/', requireAdmin, asyncHandler(createCategory));
router.put('/:id', requireAdmin, asyncHandler(updateCategory));
router.delete('/:id', requireAdmin, asyncHandler(deleteCategory));

module.exports = router;
