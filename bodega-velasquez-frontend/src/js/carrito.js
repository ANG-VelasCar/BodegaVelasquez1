import { createOrder } from './api.js';
import { renderHeaderFooter, getCart, saveCart } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  renderHeaderFooter();
  renderCart();

  document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
});

function renderCart() {
  const container = document.getElementById('cart-items');
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-box">Tu carrito de compras está vacío.</div>`;
    updateTotals(0);
    return;
  }

  container.innerHTML = cart.map(item => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--white); padding:1rem; border-radius:8px; margin-bottom:1rem; box-shadow:var(--shadow);">
      <div style="display:flex; align-items:center; gap:1rem;">
        <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;"/>
        <div>
          <h4>${item.name}</h4>
          <p style="color:var(--primary); font-weight:bold;">S/ ${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <button onclick="changeQty(${item.id}, -1)" class="btn btn-secondary">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)" class="btn btn-secondary">+</button>
        <button onclick="removeItem(${item.id})" class="btn" style="background:var(--danger); color:white; margin-left:1rem;">✕</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  updateTotals(total);
}

window.changeQty = (id, delta) => {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItem(id);
      return;
    }
    saveCart(cart);
    renderCart();
  }
};

window.removeItem = (id) => {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
};

function updateTotals(total) {
  document.getElementById('cart-subtotal').textContent = `S/ ${total.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `S/ ${total.toFixed(2)}`;
}

async function handleCheckout(e) {
  e.preventDefault();
  const cart = getCart();

  if (cart.length === 0) {
    alert('Añade productos antes de finalizar la compra');
    return;
  }

  const name = document.getElementById('client-name').value;
  const email = document.getElementById('client-email').value;
  const phone = document.getElementById('client-phone').value;

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const orderPayload = {
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    products: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
    total
  };

  try {
    const res = await createOrder(orderPayload);
    alert(`🎉 ¡Pedido registrado exitosamente! ID de Pedido: ${res.data.id}`);
    saveCart([]); // Vaciar carrito
    window.location.href = 'index.html';
  } catch (error) {
    alert('Error al registrar el pedido: ' + error.message);
  }
}