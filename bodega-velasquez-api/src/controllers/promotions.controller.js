const {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  nextNumericId,
  updateDocument
} = require('../services/firestore-repository');
const { db } = require('../firebase');

const validatePromotion = (promotion) => {
  if (!promotion || typeof promotion.title !== 'string' || !promotion.title.trim()) return 'El título de la promoción es obligatorio';
  if (typeof promotion.description !== 'string' || !promotion.description.trim()) return 'La descripción es obligatoria';
  if (!Number.isFinite(promotion.discount) || promotion.discount < 0 || promotion.discount > 100) return 'El descuento debe estar entre 0 y 100';
  if (!Array.isArray(promotion.productIds)) return 'La promoción debe incluir una lista de productos';
  if (typeof promotion.active !== 'boolean') return 'Indica si la promoción está activa';
  if (typeof promotion.bannerUrl !== 'string') return 'La imagen de la promoción no es válida';
  return null;
};

const getPromotions = async (req, res) => {
  let promotions = await listDocuments('promotions');
  if (req.query.includeInactive !== 'true') promotions = promotions.filter(promotion => promotion.active);
  res.json({ success: true, count: promotions.length, data: promotions });
};

const getPromotionById = async (req, res) => {
  const promotion = await getDocument('promotions', req.params.id);
  if (!promotion) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
  return res.json({ success: true, data: promotion });
};

const savePromotion = async (req, res, isUpdate) => {
  const error = validatePromotion(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const productIds = [...new Set(req.body.productIds.map(String))];
  for (const productId of productIds) {
    if (!await getDocument('products', productId)) {
      return res.status(400).json({ success: false, message: `Producto ${productId} no existe` });
    }
  }

  const record = {
    ...req.body,
    productIds,
    productRefs: productIds.map(id => `products/${id}`),
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    bannerUrl: req.body.bannerUrl.trim()
  };

  if (!isUpdate) {
    const promotion = await createDocument('promotions', { ...record, legacyId: await nextNumericId('promotions') });
    return res.status(201).json({ success: true, data: promotion });
  }

  const existing = await getDocument('promotions', req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
  const promotion = await updateDocument('promotions', req.params.id, { ...record, legacyId: existing.legacyId });
  return res.json({ success: true, data: promotion });
};

const createPromotion = (req, res) => savePromotion(req, res, false);
const updatePromotion = (req, res) => savePromotion(req, res, true);

const deletePromotion = async (req, res) => {
  const promotion = await deleteDocument('promotions', req.params.id);
  if (!promotion) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
  return res.json({ success: true, data: promotion });
};

module.exports = { getPromotions, getPromotionById, createPromotion, updatePromotion, deletePromotion };
