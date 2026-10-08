const products = require('../data/products');

const getProducts = (req, res) => {
  let result = [...products];
  const { category, search, sort, featured } = req.query;

  // Filtro por categoría
  if (category) {
    result = result.filter(p => p.categoryId === parseInt(category));
  }

  // Filtro por búsqueda (nombre o marca)
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.brand.toLowerCase().includes(term)
    );
  }

  // Filtro destacados
  if (featured === 'true') {
    result = result.filter(p => p.featured === true);
  }

  // Ordenamiento
  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'name-asc') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({
    success: true,
    count: result.length,
    data: result
  });
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Producto con ID ${id} no encontrado en el sistema`
    });
  }

  res.json({
    success: true,
    data: product
  });
};

module.exports = {
  getProducts,
  getProductById
};