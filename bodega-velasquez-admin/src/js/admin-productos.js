import {
  createProduct,
  createResource,
  deleteProduct,
  deleteResource,
  getCategories,
  getCustomers,
  getOrders,
  getProducts,
  getPromotions,
  setAccessTokenProvider,
  updateOrderStatus,
  updateResource,
  updateProduct,
  verifyAdminAccess
} from './api.js';
import { auth } from './firebase.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const tableBody = document.getElementById('product-table-body');
const productDialog = document.getElementById('product-dialog');
const productForm = document.getElementById('product-form');
const formError = document.getElementById('form-error');
const statusMessage = document.getElementById('status-message');
const searchInput = document.getElementById('product-search');
const saveButton = document.getElementById('save-product-button');
let products = [];
let categories = [];
let currentResource = 'products';
let resourceRecords = [];
let editingResourceId = null;

const resourceSettings = {
  categories: {
    title: 'Categorías',
    description: 'Organiza los productos en categorías.',
    endpoint: 'categories',
    columns: ['Categoría', 'Descripción'],
    fields: [
      { name: 'name', label: 'Nombre', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true }
    ]
  },
  customers: {
    title: 'Clientes',
    description: 'Gestiona los datos de contacto y conserva el historial de pedidos.',
    endpoint: 'customers',
    columns: ['Cliente', 'Correo', 'Teléfono', 'Dirección'],
    fields: [
      { name: 'name', label: 'Nombre', required: true },
      { name: 'email', label: 'Correo electrónico', type: 'email', required: true },
      { name: 'phone', label: 'Teléfono', required: true },
      { name: 'address', label: 'Dirección', type: 'textarea' }
    ]
  },
  orders: {
    title: 'Pedidos',
    description: 'Consulta pedidos y actualiza su estado. Los pedidos se crean desde la tienda.',
    endpoint: 'orders',
    columns: ['Pedido', 'Cliente', 'Productos', 'Total', 'Estado'],
    fields: []
  },
  promotions: {
    title: 'Promociones',
    description: 'Crea promociones vinculadas a productos existentes.',
    endpoint: 'promotions',
    columns: ['Promoción', 'Descuento', 'Productos vinculados', 'Estado'],
    fields: [
      { name: 'title', label: 'Título', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
      { name: 'discount', label: 'Descuento (%)', type: 'number', min: 0, max: 100, step: 0.01, required: true },
      { name: 'bannerUrl', label: 'URL de imagen', type: 'url' },
      { name: 'productIds', label: 'IDs de productos (separados por coma)', required: true },
      { name: 'active', label: 'Promoción activa', type: 'checkbox' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  bindEvents();
  setAccessTokenProvider(async () => auth.currentUser ? auth.currentUser.getIdToken() : null);
  onAuthStateChanged(auth, handleAuthState);
});

function bindEvents() {
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('sign-out-button').addEventListener('click', () => signOut(auth));
  document.querySelector('.resource-nav').addEventListener('click', handleResourceNavigation);
  document.getElementById('resource-search').addEventListener('input', renderResourceRecords);
  document.getElementById('new-resource-button').addEventListener('click', openCreateResourceDialog);
  document.getElementById('close-resource-dialog').addEventListener('click', closeResourceDialog);
  document.getElementById('cancel-resource-dialog').addEventListener('click', closeResourceDialog);
  document.getElementById('resource-form').addEventListener('submit', handleResourceSave);
  document.getElementById('resource-table-body').addEventListener('click', handleResourceAction);
  document.getElementById('resource-table-body').addEventListener('change', handleResourceStatusChange);
  document.getElementById('new-product-button').addEventListener('click', openCreateDialog);
  document.getElementById('close-dialog-button').addEventListener('click', closeDialog);
  document.getElementById('cancel-dialog-button').addEventListener('click', closeDialog);
  searchInput.addEventListener('input', renderProducts);
  productForm.addEventListener('submit', handleSave);
  tableBody.addEventListener('click', handleTableAction);
  productDialog.addEventListener('click', (event) => {
    if (event.target === productDialog) closeDialog();
  });
}

async function handleLogin(event) {
  event.preventDefault();
  const button = document.getElementById('login-button');
  const errorMessage = document.getElementById('login-error');
  button.disabled = true;
  button.textContent = 'Ingresando...';
  errorMessage.textContent = '';
  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById('login-email').value.trim(),
      document.getElementById('login-password').value
    );
  } catch (error) {
    errorMessage.textContent = getAuthErrorMessage(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Ingresar al panel';
  }
}

async function handleAuthState(user) {
  const loginPanel = document.getElementById('login-panel');
  const adminApp = document.getElementById('admin-app');
  const session = document.querySelector('.admin-session');
  const loginError = document.getElementById('login-error');

  if (!user) {
    loginPanel.hidden = false;
    adminApp.hidden = true;
    session.hidden = true;
    products = [];
    categories = [];
    return;
  }

  loginError.textContent = '';
  document.getElementById('admin-email').textContent = user.email || '';
  loginPanel.hidden = true;
  adminApp.hidden = false;
  session.hidden = false;
  try {
    await verifyAdminAccess();
    await loadAdminData();
  } catch (error) {
    await signOut(auth);
    loginPanel.hidden = false;
    loginError.textContent = error.message.includes('permisos')
      ? 'Esta cuenta inició sesión, pero todavía no está autorizada como administradora.'
      : error.message;
  }
}

function getAuthErrorMessage(error) {
  if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
    return 'Correo o contraseña incorrectos.';
  }
  if (error.code === 'auth/too-many-requests') return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  return error.message || 'No se pudo iniciar sesión.';
}

async function loadAdminData() {
  tableBody.innerHTML = '<tr><td class="table-placeholder" colspan="6">Cargando productos...</td></tr>';

  try {
    const [productsResponse, categoriesResponse] = await Promise.all([getProducts(), getCategories()]);
    products = productsResponse.data;
    categories = categoriesResponse.data;
    fillCategoryOptions();
    updateSummary();
    renderProducts();
  } catch (error) {
    tableBody.innerHTML = '<tr><td class="table-placeholder table-error" colspan="6">No se pudo conectar con la API. Verifica que el servidor esté activo e inténtalo de nuevo.</td></tr>';
    setStatus(error.message, 'error');
  }
}

async function handleResourceNavigation(event) {
  const tab = event.target.closest('button[data-resource]');
  if (!tab) return;

  currentResource = tab.dataset.resource;
  document.querySelectorAll('.resource-tab').forEach(button => {
    button.classList.toggle('is-active', button === tab);
  });
  document.getElementById('product-resource').hidden = currentResource !== 'products';
  document.getElementById('generic-resource').hidden = currentResource === 'products';
  if (currentResource === 'products') return;

  const settings = resourceSettings[currentResource];
  document.getElementById('resource-title').textContent = settings.title;
  document.getElementById('resource-description').textContent = settings.description;
  document.getElementById('new-resource-button').hidden = currentResource === 'orders';
  document.getElementById('resource-search').value = '';
  document.getElementById('resource-table-head').innerHTML = `<tr>${settings.columns.map(column => `<th>${escapeHtml(column)}</th>`).join('')}${currentResource === 'orders' ? '' : '<th><span class="visually-hidden">Acciones</span></th>'}</tr>`;
  await loadResourceRecords();
}

async function loadResourceRecords() {
  const body = document.getElementById('resource-table-body');
  body.innerHTML = `<tr><td class="table-placeholder" colspan="6">Cargando ${escapeHtml(resourceSettings[currentResource].title.toLocaleLowerCase())}...</td></tr>`;

  try {
    let response;
    if (currentResource === 'categories') response = await getCategories();
    if (currentResource === 'customers') response = await getCustomers();
    if (currentResource === 'orders') response = await getOrders();
    if (currentResource === 'promotions') response = await getPromotions(true);
    resourceRecords = response?.data || [];
    renderResourceRecords();
  } catch (error) {
    body.innerHTML = `<tr><td class="table-placeholder table-error" colspan="6">${escapeHtml(error.message)}</td></tr>`;
  }
}

function renderResourceRecords() {
  const body = document.getElementById('resource-table-body');
  const search = document.getElementById('resource-search').value.trim().toLocaleLowerCase();
  const visibleRecords = resourceRecords.filter(record => JSON.stringify(record).toLocaleLowerCase().includes(search));
  if (!visibleRecords.length) {
    body.innerHTML = `<tr><td class="table-placeholder" colspan="6">${resourceRecords.length ? 'No hay resultados para esta búsqueda.' : 'No hay registros para mostrar.'}</td></tr>`;
    return;
  }

  body.innerHTML = visibleRecords.map(record => {
    let cells = [];
    if (currentResource === 'categories') cells = [record.name, record.description];
    if (currentResource === 'customers') cells = [record.name, record.email, record.phone, record.address || '—'];
    if (currentResource === 'promotions') {
      const linkedProducts = (record.productIds || []).map(id => products.find(product => String(product.id) === String(id))?.name || `#${id}`).join(', ');
      cells = [record.title, `${record.discount}%`, linkedProducts, record.active ? 'Activa' : 'Inactiva'];
    }

    const editableCells = cells.map(cell => `<td>${escapeHtml(cell)}</td>`).join('');
    if (currentResource === 'orders') {
      const items = (record.products || []).map(item => escapeHtml(`${item.quantity} × ${item.productName || products.find(product => String(product.id) === String(item.productId))?.name || `#${item.productId}`}`)).join('<br>');
      const statuses = ['Pendiente', 'Confirmado', 'En preparación', 'En camino', 'Entregado', 'Cancelado'];
      const statusOptions = statuses.map(status => `<option value="${status}" ${record.status === status ? 'selected' : ''}>${status}</option>`).join('');
      return `<tr>
        <td>#${escapeHtml(record.id)}</td>
        <td>${escapeHtml(record.customerName)}<span class="table-subtext">${escapeHtml(record.customerEmail || '')}</span></td>
        <td>${items}</td>
        <td class="price-cell">S/ ${Number(record.total).toFixed(2)}</td>
        <td><select class="status-select" data-action="status" data-id="${escapeHtml(record.id)}" aria-label="Cambiar estado del pedido">${statusOptions}</select></td>
      </tr>`;
    }

    return `<tr>${editableCells}<td><div class="row-actions">
      <button class="icon-button edit-button" type="button" data-action="edit" data-id="${escapeHtml(record.id)}" aria-label="Editar">✎</button>
      <button class="icon-button delete-button" type="button" data-action="delete" data-id="${escapeHtml(record.id)}" aria-label="Eliminar">⌫</button>
    </div></td></tr>`;
  }).join('');
}

function openCreateResourceDialog() {
  editingResourceId = null;
  renderResourceForm({});
  document.getElementById('resource-dialog-title').textContent = `Nueva ${resourceSettings[currentResource].title.toLocaleLowerCase().replace(/s$/, '')}`;
  document.getElementById('resource-form-error').textContent = '';
  document.getElementById('save-resource-button').textContent = 'Guardar';
  document.getElementById('resource-dialog').showModal();
}

function openEditResourceDialog(record) {
  editingResourceId = record.id;
  renderResourceForm(record);
  document.getElementById('resource-dialog-title').textContent = `Editar ${resourceSettings[currentResource].title.toLocaleLowerCase().replace(/s$/, '')}`;
  document.getElementById('resource-form-error').textContent = '';
  document.getElementById('save-resource-button').textContent = 'Guardar cambios';
  document.getElementById('resource-dialog').showModal();
}

function renderResourceForm(record) {
  const fields = resourceSettings[currentResource].fields;
  document.getElementById('resource-fields').innerHTML = fields.map(field => {
    const id = `resource-field-${field.name}`;
    if (field.type === 'checkbox') {
      return `<label class="featured-field form-field-wide"><input id="${id}" name="${field.name}" type="checkbox" ${record[field.name] !== false ? 'checked' : ''}><span>${escapeHtml(field.label)}</span></label>`;
    }
    const required = field.required ? 'required' : '';
    const control = field.type === 'textarea'
      ? `<textarea id="${id}" name="${field.name}" rows="3" ${required}>${escapeHtml(record[field.name] || '')}</textarea>`
      : `<input id="${id}" name="${field.name}" type="${field.type || 'text'}" ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''} ${field.step ? `step="${field.step}"` : ''} value="${escapeHtml(field.name === 'productIds' ? (record.productIds || []).join(', ') : record[field.name] || '')}" ${required}>`;
    return `<label class="form-field form-field-wide"><span>${escapeHtml(field.label)}${field.required ? ' *' : ''}</span>${control}</label>`;
  }).join('');
}

function closeResourceDialog() {
  document.getElementById('resource-dialog').close();
}

async function handleResourceSave(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = {};
  for (const field of resourceSettings[currentResource].fields) {
    const input = form.elements.namedItem(field.name);
    if (field.type === 'checkbox') data[field.name] = input.checked;
    else if (field.name === 'discount') data[field.name] = Number(input.value);
    else if (field.name === 'productIds') data[field.name] = input.value.split(',').map(id => id.trim()).filter(Boolean);
    else data[field.name] = input.value.trim();
  }

  const button = document.getElementById('save-resource-button');
  const error = document.getElementById('resource-form-error');
  button.disabled = true;
  error.textContent = '';
  try {
    if (editingResourceId) {
      await updateResource(resourceSettings[currentResource].endpoint, editingResourceId, data);
      setStatus('El registro se actualizó correctamente.', 'success');
    } else {
      await createResource(resourceSettings[currentResource].endpoint, data);
      setStatus('El registro se creó correctamente.', 'success');
    }
    closeResourceDialog();
    await loadResourceRecords();
  } catch (requestError) {
    error.textContent = requestError.message;
  } finally {
    button.disabled = false;
  }
}

async function handleResourceAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const record = resourceRecords.find(item => String(item.id) === button.dataset.id);
  if (!record) return;
  if (button.dataset.action === 'edit') {
    openEditResourceDialog(record);
    return;
  }
  if (!window.confirm(`¿Eliminar "${record.name || record.title}"?`)) return;

  button.disabled = true;
  try {
    await deleteResource(resourceSettings[currentResource].endpoint, record.id);
    setStatus('El registro se eliminó correctamente.', 'success');
    await loadResourceRecords();
  } catch (error) {
    button.disabled = false;
    setStatus(error.message, 'error');
  }
}

async function handleResourceStatusChange(event) {
  const select = event.target.closest('select[data-action="status"]');
  if (!select) return;
  const previous = resourceRecords.find(item => String(item.id) === select.dataset.id)?.status;
  select.disabled = true;
  try {
    await updateOrderStatus(select.dataset.id, select.value);
    setStatus('El estado del pedido se actualizó.', 'success');
    await loadResourceRecords();
  } catch (error) {
    setStatus(error.message, 'error');
    if (previous) select.value = previous;
  } finally {
    select.disabled = false;
  }
}

function fillCategoryOptions() {
  const select = document.getElementById('product-category');
  select.innerHTML = '<option value="">Selecciona una categoría</option>';
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.brand}`.toLocaleLowerCase().includes(searchTerm)
  );

  if (!visibleProducts.length) {
    tableBody.innerHTML = `<tr><td class="table-placeholder" colspan="6">${products.length ? 'No hay resultados para esta búsqueda.' : 'Todavía no hay productos. Crea el primero con “Nuevo producto”.'}</td></tr>`;
    return;
  }

  tableBody.innerHTML = visibleProducts.map((product) => {
    const category = categories.find((item) => String(item.id) === String(product.categoryId));
    const stockClass = product.stock <= 5 ? 'stock-low' : 'stock-ok';
    const stockText = product.stock <= 5 ? 'Stock bajo' : 'Disponible';
    const productImage = product.image
      ? `<img class="product-thumb" src="${escapeHtml(product.image)}" alt="" loading="lazy">`
      : '<span class="product-thumb product-thumb-empty">📦</span>';

    return `
      <tr>
        <td>
          <div class="product-cell">
            ${productImage}
            <div><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.brand)} · ID ${escapeHtml(product.id)}</span></div>
          </div>
        </td>
        <td><span class="category-pill">${escapeHtml(category?.name || 'Sin categoría')}</span></td>
        <td class="price-cell">S/ ${Number(product.price).toFixed(2)}</td>
        <td>${product.stock} uds.</td>
        <td><span class="stock-pill ${stockClass}">${stockText}</span></td>
        <td>
          <div class="row-actions">
            <button class="icon-button edit-button" type="button" data-action="edit" data-id="${product.id}" aria-label="Editar ${escapeHtml(product.name)}" title="Editar">✎</button>
            <button class="icon-button delete-button" type="button" data-action="delete" data-id="${product.id}" aria-label="Eliminar ${escapeHtml(product.name)}" title="Eliminar">⌫</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateSummary() {
  document.getElementById('product-count').textContent = products.length;
  document.getElementById('category-count').textContent = categories.length;
  document.getElementById('low-stock-count').textContent = products.filter((product) => product.stock <= 5).length;
}

function openCreateDialog() {
  productForm.reset();
  document.getElementById('product-id').value = '';
  document.getElementById('dialog-title').textContent = 'Nuevo producto';
  saveButton.textContent = 'Guardar producto';
  formError.textContent = '';
  productDialog.showModal();
  document.getElementById('product-name').focus();
}

function openEditDialog(product) {
  productForm.reset();
  document.getElementById('product-id').value = product.id;
  document.getElementById('dialog-title').textContent = 'Editar producto';
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-category').value = String(product.categoryId);
  document.getElementById('product-brand').value = product.brand;
  document.getElementById('product-image').value = product.image || '';
  document.getElementById('product-featured').checked = product.featured;
  saveButton.textContent = 'Guardar cambios';
  formError.textContent = '';
  productDialog.showModal();
  document.getElementById('product-name').focus();
}

function closeDialog() {
  productDialog.close();
}

async function handleSave(event) {
  event.preventDefault();
  formError.textContent = '';

  if (!productForm.reportValidity()) return;

  const id = document.getElementById('product-id').value;
  const product = {
    name: document.getElementById('product-name').value.trim(),
    description: document.getElementById('product-description').value.trim(),
    price: Number(document.getElementById('product-price').value),
    stock: Number(document.getElementById('product-stock').value),
    categoryId: document.getElementById('product-category').value,
    brand: document.getElementById('product-brand').value.trim(),
    image: document.getElementById('product-image').value.trim(),
    featured: document.getElementById('product-featured').checked
  };

  if (!Number.isFinite(product.price) || product.price < 0 || !Number.isInteger(product.stock) || product.stock < 0 || !product.categoryId) {
    formError.textContent = 'Verifica que el precio y el stock tengan valores válidos.';
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = 'Guardando...';
  try {
    if (id) {
      await updateProduct(id, product);
      setStatus('El producto se actualizó correctamente.', 'success');
    } else {
      await createProduct(product);
      setStatus('El producto se creó correctamente.', 'success');
    }
    closeDialog();
    await loadAdminData();
  } catch (error) {
    formError.textContent = error.message;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = id ? 'Guardar cambios' : 'Guardar producto';
  }
}

async function handleTableAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const product = products.find((item) => String(item.id) === button.dataset.id);
  if (!product) return;

  if (button.dataset.action === 'edit') {
    openEditDialog(product);
    return;
  }

  if (!window.confirm(`¿Seguro que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;

  button.disabled = true;
  try {
    await deleteProduct(product.id);
    setStatus('El producto se eliminó correctamente.', 'success');
    await loadAdminData();
  } catch (error) {
    button.disabled = false;
    setStatus(error.message, 'error');
  }
}

function setStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `admin-message${type ? ` is-${type}` : ''}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}
