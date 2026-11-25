import{r as a}from"./utils-D6_xzq1X.js";import{g as o}from"./api-BZCHZNbz.js";document.addEventListener("DOMContentLoaded",async()=>{a();const e=document.getElementById("categories-grid");try{const t=await o();e.innerHTML=t.data.map(r=>`
      <div class="card" style="padding:1.5rem; text-align:center;">
        <h3 style="color:var(--primary); margin-bottom:0.5rem;">${r.name}</h3>
        <p style="color:var(--gray); margin-bottom:1rem;">${r.description}</p>
        <a href="productos.html?category=${r.id}" class="btn btn-primary">Ver Productos</a>
      </div>
    `).join("")}catch{e.innerHTML='<div class="error-box">Error al cargar categorías.</div>'}});
