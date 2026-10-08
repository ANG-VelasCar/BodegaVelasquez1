import { getCategories } from './api.js';
import { renderHeaderFooter } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderHeaderFooter();
  const container = document.getElementById('categories-grid');

  try {
    const res = await getCategories();
    container.innerHTML = res.data.map(cat => `
      <div class="card" style="padding:1.5rem; text-align:center;">
        <h3 style="color:var(--primary); margin-bottom:0.5rem;">${cat.name}</h3>
        <p style="color:var(--gray); margin-bottom:1rem;">${cat.description}</p>
        <a href="productos.html?category=${cat.id}" class="btn btn-primary">Ver Productos</a>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<div class="error-box">Error al cargar categorías.</div>`;
  }
});