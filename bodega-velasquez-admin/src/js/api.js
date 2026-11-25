const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
let getAccessToken = async () => null;

export function setAccessTokenProvider(provider) {
  getAccessToken = provider;
}

async function fetchAPI(endpoint, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Ocurrió un problema con el servidor');
  }

  return result;
}

export const getProducts = () => fetchAPI('/products');
export const getCategories = () => fetchAPI('/categories');
export const verifyAdminAccess = () => fetchAPI('/auth/me');
export const createProduct = (product) => fetchAPI('/products', {
  method: 'POST',
  body: JSON.stringify(product)
});
export const updateProduct = (id, product) => fetchAPI(`/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(product)
});
export const deleteProduct = (id) => fetchAPI(`/products/${id}`, {
  method: 'DELETE'
});
export const getCustomers = () => fetchAPI('/customers');
export const getOrders = () => fetchAPI('/orders');
export const getPromotions = (includeInactive = false) => fetchAPI(`/promotions${includeInactive ? '?includeInactive=true' : ''}`);
export const createResource = (resource, data) => fetchAPI(`/${resource}`, { method: 'POST', body: JSON.stringify(data) });
export const updateResource = (resource, id, data) => fetchAPI(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteResource = (resource, id) => fetchAPI(`/${resource}/${id}`, { method: 'DELETE' });
export const updateOrderStatus = (id, status) => fetchAPI(`/orders/${id}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status })
});
