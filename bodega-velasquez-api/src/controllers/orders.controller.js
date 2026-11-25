const { db } = require('../firebase');
const {
  collection,
  getDocument,
  listDocuments
} = require('../services/firestore-repository');

const orderStatuses = ['Pendiente', 'Confirmado', 'En preparación', 'En camino', 'Entregado', 'Cancelado'];

const getOrders = async (req, res) => {
  const orders = await listDocuments('orders');
  orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  res.json({ success: true, count: orders.length, data: orders });
};

const getOrderById = async (req, res) => {
  const order = await getDocument('orders', req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  return res.json({ success: true, data: order });
};

const createOrder = async (req, res) => {
  const { customerName, customerEmail, customerPhone, products } = req.body || {};
  const normalizedEmail = typeof customerEmail === 'string' ? customerEmail.trim().toLocaleLowerCase() : '';
  if (typeof customerName !== 'string' || !customerName.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      typeof customerPhone !== 'string' || !customerPhone.trim() ||
      !Array.isArray(products) || !products.length) {
    return res.status(400).json({ success: false, message: 'Completa los datos del cliente y agrega productos al pedido' });
  }
  if (products.some(item => !item || typeof item !== 'object' ||
      !['string', 'number'].includes(typeof item.productId) || !String(item.productId).trim() ||
      !Number.isInteger(item.quantity) || item.quantity < 1)) {
    return res.status(400).json({ success: false, message: 'Cada producto requiere un ID y una cantidad válida' });
  }

  const productQuantities = new Map();
  for (const item of products) {
    const productId = String(item.productId);
    productQuantities.set(productId, (productQuantities.get(productId) || 0) + item.quantity);
  }

  const customerQuery = collection('customers').where('emailNormalized', '==', normalizedEmail).limit(1);
  const newCustomerReference = collection('customers').doc();
  const productReferences = [...productQuantities.keys()].map(id => collection('products').doc(id));
  const orderReference = collection('orders').doc();
  const now = new Date().toISOString();

  const order = await db.runTransaction(async (transaction) => {
    const customerMatches = await transaction.get(customerQuery);
    const customerReference = customerMatches.empty ? newCustomerReference : customerMatches.docs[0].ref;
    const customerSnapshot = customerMatches.empty ? null : customerMatches.docs[0];
    const productSnapshots = await transaction.getAll(...productReferences);
    const productLines = [];
    let total = 0;

    productSnapshots.forEach((snapshot, index) => {
      if (!snapshot.exists) {
        const error = new Error(`El producto ${productReferences[index].id} ya no está disponible`);
        error.status = 409;
        throw error;
      }

      const currentProduct = snapshot.data();
      if (currentProduct.active === false) {
        const error = new Error(`El producto ${currentProduct.name} ya no está disponible`);
        error.status = 409;
        throw error;
      }
      const quantity = productQuantities.get(snapshot.id);
      if (currentProduct.stock < quantity) {
        const error = new Error(`Stock insuficiente para ${currentProduct.name}`);
        error.status = 409;
        throw error;
      }

      productLines.push({
        productId: snapshot.id,
        productName: currentProduct.name,
        image: currentProduct.image || '',
        quantity,
        unitPrice: currentProduct.price
      });
      total += currentProduct.price * quantity;
    });

    const customer = customerSnapshot
      ? {
          ...customerSnapshot.data(),
          id: customerSnapshot.id,
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          address: typeof req.body.address === 'string' ? req.body.address.trim() : customerSnapshot.data().address || '',
          active: true
        }
      : {
          id: customerReference.id,
          name: customerName.trim(),
          email: customerEmail.trim(),
          emailNormalized: normalizedEmail,
          phone: customerPhone.trim(),
          address: typeof req.body.address === 'string' ? req.body.address.trim() : '',
          active: true,
          createdAt: now
        };

    transaction.set(customerReference, customer);
    productSnapshots.forEach((snapshot, index) => {
      const productId = snapshot.id;
      transaction.update(productReferences[index], {
        stock: snapshot.data().stock - productQuantities.get(productId)
      });
    });

    const newOrder = {
      id: orderReference.id,
      customerId: customerReference.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      products: productLines,
      total: Number(total.toFixed(2)),
      status: 'Pendiente',
      createdAt: now
    };
    transaction.create(orderReference, {
      ...newOrder,
      customerRef: `customers/${customerReference.id}`,
      products: productLines.map(line => ({
        ...line,
        productRef: `products/${line.productId}`
      }))
    });
    return newOrder;
  });

  return res.status(201).json({
    success: true,
    message: 'Pedido registrado con éxito en Bodega Velasquez',
    data: order
  });
};

const updateOrderStatus = async (req, res) => {
  if (!orderStatuses.includes(req.body.status)) {
    return res.status(400).json({ success: false, message: `El estado debe ser uno de: ${orderStatuses.join(', ')}` });
  }
  const orderReference = collection('orders').doc(String(req.params.id));
  const updated = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(orderReference);
    if (!snapshot.exists) return null;

    const order = snapshot.data();
    if (order.status === req.body.status) return order;
    if (order.status === 'Cancelado') {
      const error = new Error('Un pedido cancelado no puede cambiar de estado');
      error.status = 409;
      throw error;
    }

    const restoringStock = req.body.status === 'Cancelado';
    if (restoringStock && !['Pendiente', 'Confirmado'].includes(order.status)) {
      const error = new Error('Solo se pueden cancelar pedidos pendientes o confirmados');
      error.status = 409;
      throw error;
    }
    const restockQuantities = new Map();
    if (restoringStock) {
      for (const item of order.products) {
        const productId = String(item.productId);
        restockQuantities.set(productId, (restockQuantities.get(productId) || 0) + item.quantity);
      }
    }
    const productReferences = restoringStock
      ? [...restockQuantities.keys()].map(id => collection('products').doc(id))
      : [];
    const productSnapshots = restoringStock ? await transaction.getAll(...productReferences) : [];

    if (restoringStock) {
      productSnapshots.forEach((productSnapshot, index) => {
        if (productSnapshot.exists) {
          transaction.update(productReferences[index], {
            stock: productSnapshot.data().stock + restockQuantities.get(productSnapshot.id)
          });
        }
      });
    }

    const changedOrder = { ...order, status: req.body.status, updatedAt: new Date().toISOString() };
    transaction.update(orderReference, changedOrder);
    return changedOrder;
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  return res.json({ success: true, data: updated });
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };
