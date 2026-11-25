const {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  nextNumericId,
  updateDocument
} = require('../services/firestore-repository');

const validateCategory = (category) => {
  if (!category || typeof category.name !== 'string' || !category.name.trim()) return 'El nombre de la categoría es obligatorio';
  if (typeof category.description !== 'string') return 'La descripción debe ser texto';
  return null;
};

const getCategories = async (req, res) => {
  const categories = await listDocuments('categories');
  res.json({ success: true, count: categories.length, data: categories });
};

const getCategoryById = async (req, res) => {
  const category = await getDocument('categories', req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
  return res.json({ success: true, data: category });
};

const createCategory = async (req, res) => {
  const error = validateCategory(req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  const category = await createDocument('categories', {
    ...req.body,
    legacyId: await nextNumericId('categories'),
    name: req.body.name.trim(),
    description: req.body.description.trim()
  });
  return res.status(201).json({ success: true, data: category });
};

const updateCategory = async (req, res) => {
  const error = validateCategory(req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  const existing = await getDocument('categories', req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
  const category = await updateDocument('categories', req.params.id, {
    ...req.body,
    legacyId: existing.legacyId,
    name: req.body.name.trim(),
    description: req.body.description.trim()
  });
  return res.json({ success: true, data: category });
};

const deleteCategory = async (req, res) => {
  const category = await getDocument('categories', req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
  const products = await listDocuments('products');
  if (products.some(product => String(product.categoryId) === String(category.id))) {
    return res.status(409).json({ success: false, message: 'No puedes eliminar una categoría que todavía tiene productos' });
  }
  await deleteDocument('categories', req.params.id);
  return res.json({ success: true, data: category });
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
