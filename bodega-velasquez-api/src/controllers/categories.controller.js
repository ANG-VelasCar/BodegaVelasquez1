const categories = require('../data/categories');

const getCategories = (req, res) => {
  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
};

const getCategoryById = (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: `Categoría con ID ${id} no encontrada`
    });
  }

  res.json({
    success: true,
    data: category
  });
};

module.exports = { getCategories, getCategoryById };