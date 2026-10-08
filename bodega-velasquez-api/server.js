require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Servidor API Bodega Velasquez corriendo en puerto ${PORT}`);
  console.log(`  URL local: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});