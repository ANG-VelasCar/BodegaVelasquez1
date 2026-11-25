import{r as n,a as o}from"./utils-D6_xzq1X.js";import{a as d,b as s}from"./api-BZCHZNbz.js";document.addEventListener("DOMContentLoaded",async()=>{n(),await i(),await c()});async function i(){const a=document.getElementById("featured-products");if(a)try{const r=await d("?featured=true");if(a.innerHTML="",r.data.length===0){a.innerHTML='<div class="empty-box">No hay productos destacados por el momento.</div>';return}r.data.forEach(e=>{const t=document.createElement("div");t.className="card",t.innerHTML=`
        <img src="${e.image}" alt="${e.name}" class="card-img" />
        <div class="card-body">
          <span class="card-tag">${e.brand}</span>
          <h3 class="card-title">${e.name}</h3>
          <div class="card-price">S/ ${e.price.toFixed(2)}</div>
          <div style="display:flex; gap:0.5rem;">
            <a href="producto.html?id=${e.id}" class="btn btn-secondary" style="flex:1;">Detalle</a>
            <button class="btn btn-primary btn-add" style="flex:1;">Agregar</button>
          </div>
        </div>
      `,t.querySelector(".btn-add").addEventListener("click",()=>o(e)),a.appendChild(t)})}catch{a.innerHTML='<div class="error-box">No se pudieron cargar los productos. Verifica la conexión con la API.</div>'}}async function c(){const a=document.getElementById("home-promotions");if(a)try{const r=await s();a.innerHTML=r.data.map(e=>`
      <div style="background:var(--white); padding:1rem; border-radius:8px; box-shadow:var(--shadow); margin-bottom:1rem;">
        <h3 style="color:var(--secondary);">${e.title}</h3>
        <p>${e.description}</p>
      </div>
    `).join("")}catch{a.innerHTML='<p style="color:var(--gray);">Promociones no disponibles temporalmente.</p>'}}
