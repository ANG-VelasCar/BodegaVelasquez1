import{r as i,a as l}from"./utils-D6_xzq1X.js";import{g,a as m}from"./api-BZCHZNbz.js";let n="",s="",d="";document.addEventListener("DOMContentLoaded",async()=>{i();const t=new URLSearchParams(window.location.search);t.has("category")&&(n=t.get("category")),u(),await y(),await c()});function u(){const t=document.getElementById("search-input"),a=document.getElementById("category-select"),r=document.getElementById("sort-select");t.addEventListener("input",e=>{s=e.target.value,c()}),a.addEventListener("change",e=>{n=e.target.value,c()}),r.addEventListener("change",e=>{d=e.target.value,c()})}async function y(){const t=document.getElementById("category-select");try{(await g()).data.forEach(r=>{const e=document.createElement("option");e.value=r.id,e.textContent=r.name,r.id.toString()===n&&(e.selected=!0),t.appendChild(e)})}catch(a){console.error("Error al cargar selector de categorías:",a)}}async function c(){const t=document.getElementById("catalog-grid");t.innerHTML='<div class="loading-spinner">Cargando catálogo de Bodega Velasquez...</div>';try{let a="?";n&&(a+=`category=${n}&`),s&&(a+=`search=${encodeURIComponent(s)}&`),d&&(a+=`sort=${d}&`);const r=await m(a);if(t.innerHTML="",r.data.length===0){t.innerHTML='<div class="empty-box" style="grid-column: 1/-1;">No encontramos productos que coincidan con tu búsqueda.</div>';return}r.data.forEach(e=>{const o=document.createElement("div");o.className="card",o.innerHTML=`
        <img src="${e.image}" alt="${e.name}" class="card-img" />
        <div class="card-body">
          <span class="card-tag">${e.brand}</span>
          <h3 class="card-title">${e.name}</h3>
          <p style="font-size:0.85rem; color:var(--gray); margin-bottom:0.5rem;">Stock: ${e.stock} un.</p>
          <div class="card-price">S/ ${e.price.toFixed(2)}</div>
          <div style="display:flex; gap:0.5rem;">
            <a href="producto.html?id=${e.id}" class="btn btn-secondary" style="flex:1;">Ver Detalle</a>
            <button class="btn btn-primary btn-add" style="flex:1;">Agregar</button>
          </div>
        </div>
      `,o.querySelector(".btn-add").addEventListener("click",()=>l(e)),t.appendChild(o)})}catch{t.innerHTML='<div class="error-box" style="grid-column: 1/-1;">Error de conexión al cargar productos.</div>'}}
