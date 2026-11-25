const {
  collection,
  createDocument,
  getDocument,
  listDocuments,
  nextNumericId,
  updateDocument
} = require('../services/firestore-repository');

const validateCustomer = (customer) => {
  if (!customer || typeof customer.name !== 'string' || !customer.name.trim()) return 'El nombre del cliente es obligatorio';
  if (typeof customer.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return 'Ingresa un correo válido';
  if (typeof customer.phone !== 'string' || !customer.phone.trim()) return 'El teléfono es obligatorio';
  if (typeof customer.address !== 'string') return 'La dirección debe ser texto';
  return null;
};

const getCustomers = async (req, res) => {
  const customers = await listDocuments('customers');
  res.json({ success: true, count: customers.length, data: customers });
};

const getCustomerById = async (req, res) => {
  const customer = await getDocument('customers', req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  return res.json({ success: true, data: customer });
};

const createCustomer = async (req, res) => {
  const error = validateCustomer(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const existing = await collection('customers').where('emailNormalized', '==', req.body.email.trim().toLocaleLowerCase()).limit(1).get();
  if (!existing.empty) return res.status(409).json({ success: false, message: 'Ya existe un cliente con ese correo' });

  const customer = await createDocument('customers', {
    ...req.body,
    legacyId: await nextNumericId('customers'),
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    emailNormalized: req.body.email.trim().toLocaleLowerCase(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
    active: true,
    createdAt: new Date().toISOString()
  });
  return res.status(201).json({ success: true, data: customer });
};

const updateCustomer = async (req, res) => {
  const error = validateCustomer(req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  const existing = await getDocument('customers', req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });

  const duplicate = await collection('customers').where('emailNormalized', '==', req.body.email.trim().toLocaleLowerCase()).limit(2).get();
  if (duplicate.docs.some(document => document.id !== String(req.params.id))) {
    return res.status(409).json({ success: false, message: 'Ya existe otro cliente con ese correo' });
  }

  const customer = await updateDocument('customers', req.params.id, {
    ...req.body,
    legacyId: existing.legacyId,
    emailNormalized: req.body.email.trim().toLocaleLowerCase(),
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
    active: existing.active !== false
  });
  return res.json({ success: true, data: customer });
};

const deleteCustomer = async (req, res) => {
  const customer = await getDocument('customers', req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  const orders = await listDocuments('orders');

  if (orders.some(order => String(order.customerId) === String(customer.id))) {
    const updated = await updateDocument('customers', req.params.id, { ...customer, active: false });
    return res.json({ success: true, data: updated, message: 'Cliente desactivado; se conserva su historial de pedidos' });
  }

  await collection('customers').doc(String(req.params.id)).delete();
  return res.json({ success: true, data: customer });
};

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
