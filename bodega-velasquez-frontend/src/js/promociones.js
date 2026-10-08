import { getPromotions } from './api.js';
import { renderHeaderFooter } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderHeaderFooter();
  const container = document.getElementById('promotions-container');

  try {
    const res = await getPromotions();
    container.innerHTML = res.data.map(promo => `
      <div style="background:var(--white); border-radius:8px; overflow:hidden; box-shadow:var(--shadow); margin-bottom:2rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <img src="${promo.bannerUrl}" style="width:100%; height:200px; object-fit:cover;" />
        <div style="padding:1.5rem;">
          <span style="background:var(--secondary); color:white; padding:0.2rem 0.6rem; border-radius:4px; font-weight:bold;">${promo.discount}% OFF</span>
          <h2 style="margin:0.5rem 0;">${promo.title}</h2>
          <p style="color:var(--gray); margin-bottom:1rem;">${promo.description}</p>
          <a href="productos.html" class="btn btn-primary">Aprovechar en tienda</a>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<div class="error-box">Error al obtener ofertas de la API.</div>`;
  }
}); 