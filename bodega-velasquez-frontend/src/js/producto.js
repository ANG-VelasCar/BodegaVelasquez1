import { getProductById, getProducts } from './api.js';
import { renderHeaderFooter, addToCart } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderHeaderFooter();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = 'productos.html';
    return;
  }

  await loadProductDetail(productId);
});

async function loadProductDetail(id) {
  const container = document.getElementById('detail-container');
  try {
    const res = await getProductById(id);
    const p = res.data;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:2rem; background:var(--white); padding:2rem; border-radius:8px; box-shadow:var(--shadow);">
        <img src="${p.image}" alt="${p.name}" style="width:100%; max-height:350px; object-fit:cover; border-radius:8px;" />
        <div>
          <span class="card-tag">${p.brand}</span>
          <h1 style="margin-bottom:0.5rem;">${p.name}</h1>
          <p style="color:var(--gray); margin-bottom:1rem;">${p.description}</p>
          <div class="card-price" style="font-size:2rem; margin-bottom:1rem;">S/ ${p.price.toFixed(2)}</div>
          <p style="margin-bottom:1.5rem;"><strong>Disponibilidad:</strong> ${p.stock > 0 ? `${p.stock} unidades en stock` : 'Agotado'}</p>
          <button id="add-detail-btn" class="btn btn-primary" style="padding:0.8rem 2rem; font-size:1.1rem;">Agregar al Carrito 🛒</button>
        </div>
      </div>
    `;

    document.getElementById('add-detail-btn').addEventListener('click', () => addToCart(p));

    await loadRelatedProducts(p.categoryId, p.id);
  } catch (error) {
    container.innerHTML = `<div class="error-box">No se encontró el producto solicitado.</div>`;
  }
}

async function loadRelatedProducts(categoryId, currentId) {
  const relatedContainer = document.getElementById('related-grid');
  try {
    const res = await getProducts(`?category=${categoryId}`);
    const related = res.data.filter(p => p.id !== currentId).slice(0, 3);

    relatedContainer.innerHTML = '';
    related.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" class="card-img"/>
        <div class="card-body">
          <h3>${p.name}</h3>
          <div class="card-price">S/ ${p.price.toFixed(2)}</div>
          <a href="producto.html?id=${p.id}" class="btn btn-secondary">Ver Detalle</a>
        </div>
      `;
      relatedContainer.appendChild(card);
    });
  } catch (e) {
    console.error(e);
  }
}