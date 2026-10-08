const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Función genérica reutilizable para consumir endpoints
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Ocurrió un problema con el servidor');
    }

    return result;
  } catch (error) {
    console.error(`Error en API (${endpoint}):`, error);
    throw error;
  }
}

export const getProducts = (params = '') => fetchAPI(`/products${params}`);
export const getProductById = (id) => fetchAPI(`/products/${id}`);
export const getCategories = () => fetchAPI('/categories');
export const getPromotions = () => fetchAPI('/promotions');
export const createOrder = (orderData) => fetchAPI('/orders', {
  method: 'POST',
  body: JSON.stringify(orderData)
});