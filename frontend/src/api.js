const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const request = async (path, options = {}) => {
  const token = localStorage.getItem('mealToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE}${path}`, { headers, ...options });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const loginUser = (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
export const signupUser = (payload) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
export const getDashboard = () => request('/api/dashboard');
export const updateMeal = (payload) => request('/api/meals/update', { method: 'POST', body: JSON.stringify(payload) });
export const createMealDate = (payload) => request('/api/meals/date', { method: 'POST', body: JSON.stringify(payload) });
export const getAllMeals = () => request('/api/meals/all');
export const getBazarItems = () => request('/api/bazar');
export const addBazarItem = (payload) => request('/api/bazar', { method: 'POST', body: JSON.stringify(payload) });
export const getProfile = () => request('/api/auth/me');
