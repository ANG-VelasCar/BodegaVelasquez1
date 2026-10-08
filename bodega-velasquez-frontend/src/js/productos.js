import { getProducts, getCategories } from './api.js';
import { renderHeaderFooter, addToCart } from './utils.js';

let currentCategory = '';
let currentSearch = '';
let currentSort = '';

document.addEventListener('DOMContentLoaded', async () => {
  renderHeaderFooter();

  // Leer categoría desde URL si proviene de categorias.html
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category')) {
    currentCategory = urlParams.get('category');
  }

  setupFilterEvents();
  await loadCategoriesDropdown();
  await renderCatalog();
});

function setupFilterEvents() {
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const sortSelect = document.getElementById('sort-select');

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderCatalog();
  });

  categorySelect.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    renderCatalog();
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });
}

async function loadCategoriesDropdown() {
  const categorySelect = document.getElementById('category-select');
  try {
    const res = await getCategories();
    res.data.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      if (cat.id.toString() === currentCategory) option.selected = true;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar selector de categorías:", error);
  }
}

async function renderCatalog() {
  const container = document.getElementById('catalog-grid');
  container.innerHTML = `<div class="loading-spinner">Cargando catálogo de Bodega Velasquez...</div>`;

  try {
    let query = '?';
    if (currentCategory) query += `category=${currentCategory}&`;
    if (currentSearch) query += `search=${encodeURIComponent(currentSearch)}&`;
    if (currentSort) query += `sort=${currentSort}&`;

    const res = await getProducts(query);
    container.innerHTML = '';

    if (res.data.length === 0) {
      container.innerHTML = `<div class="empty-box" style="grid-column: 1/-1;">No encontramos productos que coincidan con tu búsqueda.</div>`;
      return;
    }

    res.data.forEach(product => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="card-img" />
        <div class="card-body">
          <span class="card-tag">${product.brand}</span>
          <h3 class="card-title">${product.name}</h3>
          <p style="font-size:0.85rem; color:var(--gray); margin-bottom:0.5rem;">Stock: ${product.stock} un.</p>
          <div class="card-price">S/ ${product.price.toFixed(2)}</div>
          <div style="display:flex; gap:0.5rem;">
            <a href="producto.html?id=${product.id}" class="btn btn-secondary" style="flex:1;">Ver Detalle</a>
            <button class="btn btn-primary btn-add" style="flex:1;">Agregar</button>
          </div>
        </div>
      `;
      card.querySelector('.btn-add').addEventListener('click', () => addToCart(product));
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<div class="error-box" style="grid-column: 1/-1;">Error de conexión al cargar productos.</div>`;
  }
}