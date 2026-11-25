const {
  createDocument,
  getDocument,
  listDocuments,
  nextNumericId,
  updateDocument
} = require('../services/firestore-repository');

const validateProduct = async (product) => {
  const errors = [];
  if (!product || typeof product !== 'object' || Array.isArray(product)) return ['El cuerpo debe ser un objeto'];
  if (typeof product.name !== 'string' || !product.name.trim()) errors.push('El nombre es obligatorio');
  if (typeof product.description !== 'string' || !product.description.trim()) errors.push('La descripción es obligatoria');
  if (!Number.isFinite(product.price) || product.price < 0) errors.push('El precio debe ser mayor o igual a 0');
  if (!Number.isInteger(product.stock) || product.stock < 0) errors.push('El stock debe ser un entero mayor o igual a 0');
  if (typeof product.categoryId !== 'string' && !Number.isInteger(product.categoryId)) errors.push('La categoría no es válida');
  if (!product.categoryId || !await getDocument('categories', product.categoryId)) errors.push('Selecciona una categoría válida');
  if (typeof product.brand !== 'string' || !product.brand.trim()) errors.push('La marca es obligatoria');
  if (typeof product.image !== 'string') errors.push('La imagen debe ser una URL o una cadena vacía');
  if (typeof product.featured !== 'boolean') errors.push('El campo destacado debe ser verdadero o falso');
  return errors;
};

const getProducts = async (req, res) => {
  let result = (await listDocuments('products')).filter(product => product.active !== false);
  const { category, search, sort, featured } = req.query;

  if (category) result = result.filter(product => String(product.categoryId) === String(category));
  if (search) {
    const term = String(search).toLocaleLowerCase();
    result = result.filter(product =>
      product.name.toLocaleLowerCase().includes(term) ||
      product.brand.toLocaleLowerCase().includes(term)
    );
  }
  if (featured === 'true') result = result.filter(product => product.featured === true);
  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

  res.json({ success: true, count: result.length, data: result });
};

const getProductById = async (req, res) => {
  const product = await getDocument('products', req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: `Producto con ID ${req.params.id} no encontrado` });
  }
  return res.json({ success: true, data: product });
};

const createProduct = async (req, res) => {
  const errors = await validateProduct(req.body);
  if (errors.length) return res.status(400).json({ success: false, message: errors.join('. ') });

  const id = await nextNumericId('products');
  const product = {
    ...req.body,
    legacyId: id,
    active: true,
    categoryId: String(req.body.categoryId),
    categoryRef: `categories/${req.body.categoryId}`,
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    brand: req.body.brand.trim(),
    image: req.body.image.trim()
  };
  const created = await createDocument('products', product);
  return res.status(201).json({ success: true, data: created });
};

const updateProduct = async (req, res) => {
  const errors = await validateProduct(req.body);
  if (errors.length) return res.status(400).json({ success: false, message: errors.join('. ') });

  const current = await getDocument('products', req.params.id);
  if (!current) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  const product = {
    ...req.body,
    legacyId: current.legacyId ?? (Number.isInteger(Number(req.params.id)) ? Number(req.params.id) : undefined),
    active: current.active !== false,
    categoryId: String(req.body.categoryId),
    categoryRef: `categories/${req.body.categoryId}`,
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    brand: req.body.brand.trim(),
    image: req.body.image.trim()
  };
  const updated = await updateDocument('products', req.params.id, product);
  return res.json({ success: true, data: updated });
};

const deleteProduct = async (req, res) => {
  const product = await getDocument('products', req.params.id);
  if (!product || product.active === false) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  const deleted = await updateDocument('products', req.params.id, { ...product, active: false });
  return res.json({ success: true, data: deleted });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
