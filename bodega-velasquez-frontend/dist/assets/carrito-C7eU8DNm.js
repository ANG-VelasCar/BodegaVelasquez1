import{r as p,g as d,s as i}from"./utils-D6_xzq1X.js";import{c as y}from"./api-BZCHZNbz.js";document.addEventListener("DOMContentLoaded",()=>{p(),c(),document.getElementById("checkout-form").addEventListener("submit",g)});function c(){const n=document.getElementById("cart-items"),e=d();if(e.length===0){n.innerHTML='<div class="empty-box">Tu carrito de compras está vacío.</div>',l(0);return}n.innerHTML=e.map(t=>`
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--white); padding:1rem; border-radius:8px; margin-bottom:1rem; box-shadow:var(--shadow);">
      <div style="display:flex; align-items:center; gap:1rem;">
        <img src="${t.image}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;"/>
        <div>
          <h4>${t.name}</h4>
          <p style="color:var(--primary); font-weight:bold;">S/ ${t.price.toFixed(2)}</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <button onclick="changeQty(${t.id}, -1)" class="btn btn-secondary">-</button>
        <span>${t.quantity}</span>
        <button onclick="changeQty(${t.id}, 1)" class="btn btn-secondary">+</button>
        <button onclick="removeItem(${t.id})" class="btn" style="background:var(--danger); color:white; margin-left:1rem;">✕</button>
      </div>
    </div>
  `).join("");const a=e.reduce((t,o)=>t+o.price*o.quantity,0);l(a)}window.changeQty=(n,e)=>{const a=d(),t=a.find(o=>o.id===n);if(t){if(t.quantity+=e,t.quantity<=0){removeItem(n);return}i(a),c()}};window.removeItem=n=>{let e=d();e=e.filter(a=>a.id!==n),i(e),c()};function l(n){document.getElementById("cart-subtotal").textContent=`S/ ${n.toFixed(2)}`,document.getElementById("cart-total").textContent=`S/ ${n.toFixed(2)}`}async function g(n){n.preventDefault();const e=d();if(e.length===0){alert("Añade productos antes de finalizar la compra");return}const a=document.getElementById("client-name").value,t=document.getElementById("client-email").value,o=document.getElementById("client-phone").value,m=e.reduce((r,s)=>r+s.price*s.quantity,0),u={customerName:a,customerEmail:t,customerPhone:o,products:e.map(r=>({productId:r.id,quantity:r.quantity})),total:m};try{const r=await y(u);alert(`🎉 ¡Pedido registrado exitosamente! ID de Pedido: ${r.data.id}`),i([]),window.location.href="index.html"}catch(r){alert("Error al registrar el pedido: "+r.message)}}
