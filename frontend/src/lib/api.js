const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'foglia_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Core request helper. Attaches the JWT (if present) and throws a
 * normalized Error (with .status) on any non-2xx response so callers
 * can just try/catch.
 */
async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. network error page) — leave data as null
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.errors = data?.errors;
    throw err;
  }

  return data;
}

// --- Auth ---
export const signup = (payload) => request('/signup', { method: 'POST', body: payload, auth: false });
export const login = (payload) => request('/login', { method: 'POST', body: payload, auth: false });
export const getProfile = () => request('/profile');

// --- Menu ---
export const getMenu = (params = {}) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return request(`/menu${suffix}`, { auth: false });
};
export const createMenuItem = (payload) => request('/menu', { method: 'POST', body: payload });
export const updateMenuItem = (id, payload) => request(`/menu/${id}`, { method: 'PUT', body: payload });
export const deleteMenuItem = (id) => request(`/menu/${id}`, { method: 'DELETE' });

// --- Orders ---
export const placeOrder = (payload) => request('/order', { method: 'POST', body: payload });
export const getMyOrders = () => request('/my-orders');
export const getOrderById = (id) => request(`/order/${id}`);
export const getAllOrders = (status) => request(`/orders${status ? `?status=${encodeURIComponent(status)}` : ''}`);
export const updateOrderStatus = (id, status) => request(`/order/${id}/status`, { method: 'PUT', body: { status } });
