import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  preview: {
    allowedHosts: true, // Permite que Render acceda a la previsualización sin bloquear la URL
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        productos: resolve(__dirname, 'productos.html'),
        producto: resolve(__dirname, 'producto.html'),
        categorias: resolve(__dirname, 'categorias.html'),
        promociones: resolve(__dirname, 'promociones.html'),
        carrito: resolve(__dirname, 'carrito.html'),
        nosotros: resolve(__dirname, 'nosotros.html'),
      },
    },
  },
});
