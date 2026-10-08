const express = require('express');
const cors = require('cors');

const productsRoutes = require('./routes/products.routes');
const categoriesRoutes = require('./routes/categories.routes');
const customersRoutes = require('./routes/customers.routes');
const promotionsRoutes = require('./routes/promotions.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de diagnóstico inicial
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: "Bienvenido a la API REST de Bodega Velasquez",
    resources: [
      "/api/products",
      "/api/categories",
      "/api/customers",
      "/api/promotions",
      "/api/orders"
    ]
  });
});

// Enrutadores
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/orders', ordersRoutes);

// Manejo de endpoints 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Recurso solicitado no existe en la API de Bodega Velasquez"
  });
});

module.exports = app;