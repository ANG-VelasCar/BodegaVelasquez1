(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();function s(){return JSON.parse(localStorage.getItem("bv_cart"))||[]}function d(t){localStorage.setItem("bv_cart",JSON.stringify(t)),c()}function l(t,a=1){const o=s(),n=o.findIndex(e=>e.id===t.id);n!==-1?o[n].quantity+=a:o.push({id:t.id,name:t.name,price:t.price,image:t.image,quantity:a}),d(o),alert(`¡${t.name} agregado al carrito!`)}function c(){const a=s().reduce((n,e)=>n+e.quantity,0),o=document.getElementById("cart-count");o&&(o.textContent=a)}function f(){const t=document.getElementById("main-header"),a=document.getElementById("main-footer");t&&(t.innerHTML=`
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
    `),a&&(a.innerHTML=`
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
    `),c()}export{l as a,s as g,f as r,d as s};
