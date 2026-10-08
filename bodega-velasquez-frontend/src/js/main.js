import { getProducts, getPromotions } from './api.js';
import { renderHeaderFooter, addToCart } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderHeaderFooter();
  await loadFeaturedProducts();
  await loadHomePromotions();
});

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  try {
    const response = await getProducts('?featured=true');
    container.innerHTML = '';

    if (response.data.length === 0) {
      container.innerHTML = `<div class="empty-box">No hay productos destacados por el momento.</div>`;
      return;
    }

    response.data.forEach(product => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="card-img" />
        <div class="card-body">
          <span class="card-tag">${product.brand}</span>
          <h3 class="card-title">${product.name}</h3>
          <div class="card-price">S/ ${product.price.toFixed(2)}</div>
          <div style="display:flex; gap:0.5rem;">
            <a href="producto.html?id=${product.id}" class="btn btn-secondary" style="flex:1;">Detalle</a>
            <button class="btn btn-primary btn-add" style="flex:1;">Agregar</button>
          </div>
        </div>
      `;

      card.querySelector('.btn-add').addEventListener('click', () => addToCart(product));
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<div class="error-box">No se pudieron cargar los productos. Verifica la conexión con la API.</div>`;
  }
}

async function loadHomePromotions() {
  const container = document.getElementById('home-promotions');
  if (!container) return;

  try {
    const response = await getPromotions();
    container.innerHTML = response.data.map(promo => `
      <div style="background:var(--white); padding:1rem; border-radius:8px; box-shadow:var(--shadow); margin-bottom:1rem;">
        <h3 style="color:var(--secondary);">${promo.title}</h3>
        <p>${promo.description}</p>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<p style="color:var(--gray);">Promociones no disponibles temporalmente.</p>`;
  }
}