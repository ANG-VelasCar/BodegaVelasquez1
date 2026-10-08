// Gestión de LocalStorage para Carrito
export function getCart() {
  return JSON.parse(localStorage.getItem('bv_cart')) || [];
}

export function saveCart(cart) {
  localStorage.setItem('bv_cart', JSON.stringify(cart));
  updateCartBadge();
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === product.id);

  if (index !== -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }

  saveCart(cart);
  alert(`¡${product.name} agregado al carrito!`);
}

export function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = totalItems;
  }
}

// Renderizado de Header y Footer Dinámicos
export function renderHeaderFooter() {
  const header = document.getElementById('main-header');
  const footer = document.getElementById('main-footer');

  if (header) {
    header.innerHTML = `
      <div class="nav-container">
        <a href="index.html" class="logo">🛒 BODEGA VELASQUEZ</a>
        <nav class="nav-menu">
          <a href="index.html" class="nav-link">Inicio</a>
          <a href="productos.html" class="nav-link">Productos</a>
          <a href="categorias.html" class="nav-link">Categorías</a>
          <a href="promociones.html" class="nav-link">Promociones</a>
          <a href="nosotros.html" class="nav-link">Nosotros</a>
          <a href="carrito.html" class="cart-btn">
            Carrito 🛒 <span id="cart-count" class="cart-badge">0</span>
          </a>
        </nav>
      </div>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-container">
        <div>
          <h3>Bodega Velasquez</h3>
          <p>Calidad, frescura y rapidez directo a tu hogar.</p>
        </div>
        <div>
          <h4>Horario de Atención</h4>
          <p>Lunes a Sábado: 7:00 AM - 10:00 PM</p>
          <p>Domingos: 8:00 AM - 8:00 PM</p>
        </div>
        <div>
          <h4>Contacto</h4>
          <p>📍 Huancayo, Perú</p>
          <p>📞 (064) 987-654321</p>
        </div>
      </div>
    `;
  }

  updateCartBadge();
}