const promotions = require('../data/promotions');

const getPromotions = (req, res) => {
  const activePromos = promotions.filter(p => p.active);
  res.json({ success: true, count: activePromos.length, data: activePromos });
};

const getPromotionById = (req, res) => {
  const id = parseInt(req.params.id);
  const promo = promotions.find(p => p.id === id);
  if (!promo) {
    return res.status(404).json({ success: false, message: "Promoción no encontrada" });
  }
  res.json({ success: true, data: promo });
};

module.exports = { getPromotions, getPromotionById };