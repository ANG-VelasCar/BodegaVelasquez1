const express = require('express');
const cors = require('cors');

const productsRoutes = require('./routes/products.routes');
const categoriesRoutes = require('./routes/categories.routes');
const customersRoutes = require('./routes/customers.routes');
const promotionsRoutes = require('./routes/promotions.routes');
const ordersRoutes = require('./routes/orders.routes');
const authRoutes = require('./routes/auth.routes');
const asyncHandler = require('./utils/async-handler');
const { db } = require('./firebase');

const app = express();

// Middlewares
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origen no permitido por CORS');
    error.status = 403;
    return callback(error);
  }
}));
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
      "/api/orders",
      "/api/auth"
    ]
  });
});

// Enrutadores
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/api/health', asyncHandler(async (req, res) => {
  await db.collection('_health').limit(1).get();
  res.json({ success: true, data: { firestore: 'connected' } });
}));

// Manejo de endpoints 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Recurso solicitado no existe en la API de Bodega Velasquez"
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error('API request failed:', error);
  const status = Number.isInteger(error.status) ? error.status : 500;
  const message = status < 500 ? error.message : 'Error interno del servidor';
  return res.status(status).json({ success: false, message });
});

module.exports = app;