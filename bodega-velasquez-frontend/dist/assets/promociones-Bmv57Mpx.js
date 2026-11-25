import{r as a}from"./utils-D6_xzq1X.js";import{b as o}from"./api-BZCHZNbz.js";document.addEventListener("DOMContentLoaded",async()=>{a();const e=document.getElementById("promotions-container");try{const t=await o();e.innerHTML=t.data.map(r=>`
      <div style="background:var(--white); border-radius:8px; overflow:hidden; box-shadow:var(--shadow); margin-bottom:2rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <img src="${r.bannerUrl}" style="width:100%; height:200px; object-fit:cover;" />
        <div style="padding:1.5rem;">
          <span style="background:var(--secondary); color:white; padding:0.2rem 0.6rem; border-radius:4px; font-weight:bold;">${r.discount}% OFF</span>
          <h2 style="margin:0.5rem 0;">${r.title}</h2>
          <p style="color:var(--gray); margin-bottom:1rem;">${r.description}</p>
          <a href="productos.html" class="btn btn-primary">Aprovechar en tienda</a>
        </div>
      </div>
    `).join("")}catch{e.innerHTML='<div class="error-box">Error al obtener ofertas de la API.</div>'}});
