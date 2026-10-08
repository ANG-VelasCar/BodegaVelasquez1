const orders = require('../data/orders');

const getOrders = (req, res) => {
  res.json({ success: true, count: orders.length, data: orders });
};

const getOrderById = (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Pedido no encontrado" });
  }
  res.json({ success: true, data: order });
};

const createOrder = (req, res) => {
  const { customerName, customerEmail, customerPhone, products, total } = req.body;

  if (!customerName || !products || products.length === 0 || !total) {
    return res.status(400).json({
      success: false,
      message: "Por favor complete los datos obligatorios del pedido"
    });
  }

  const newOrder = {
    id: orders.length + 1,
    customerName,
    customerEmail,
    customerPhone,
    products,
    total,
    status: "Pendiente",
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  res.status(201).json({
    success: true,
    message: "Pedido registrado con éxito en Bodega Velasquez",
    data: newOrder
  });
};

module.exports = { getOrders, getOrderById, createOrder };