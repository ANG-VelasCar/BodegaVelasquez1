import{r as n,a as c}from"./utils-D6_xzq1X.js";import{d as s,a as l}from"./api-BZCHZNbz.js";document.addEventListener("DOMContentLoaded",async()=>{n();const e=new URLSearchParams(window.location.search).get("id");if(!e){window.location.href="productos.html";return}await m(e)});async function m(r){const e=document.getElementById("detail-container");try{const t=(await s(r)).data;e.innerHTML=`
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:2rem; background:var(--white); padding:2rem; border-radius:8px; box-shadow:var(--shadow);">
        <img src="${t.image}" alt="${t.name}" style="width:100%; max-height:350px; object-fit:cover; border-radius:8px;" />
        <div>
          <span class="card-tag">${t.brand}</span>
          <h1 style="margin-bottom:0.5rem;">${t.name}</h1>
          <p style="color:var(--gray); margin-bottom:1rem;">${t.description}</p>
          <div class="card-price" style="font-size:2rem; margin-bottom:1rem;">S/ ${t.price.toFixed(2)}</div>
          <p style="margin-bottom:1.5rem;"><strong>Disponibilidad:</strong> ${t.stock>0?`${t.stock} unidades en stock`:"Agotado"}</p>
          <button id="add-detail-btn" class="btn btn-primary" style="padding:0.8rem 2rem; font-size:1.1rem;">Agregar al Carrito 🛒</button>
        </div>
      </div>
    `,document.getElementById("add-detail-btn").addEventListener("click",()=>c(t)),await g(t.categoryId,t.id)}catch{e.innerHTML='<div class="error-box">No se encontró el producto solicitado.</div>'}}async function g(r,e){const d=document.getElementById("related-grid");try{const i=(await l(`?category=${r}`)).data.filter(a=>a.id!==e).slice(0,3);d.innerHTML="",i.forEach(a=>{const o=document.createElement("div");o.className="card",o.innerHTML=`
        <img src="${a.image}" class="card-img"/>
        <div class="card-body">
          <h3>${a.name}</h3>
          <div class="card-price">S/ ${a.price.toFixed(2)}</div>
          <a href="producto.html?id=${a.id}" class="btn btn-secondary">Ver Detalle</a>
        </div>
      `,d.appendChild(o)})}catch(t){console.error(t)}}
