import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const userInfoString = localStorage.getItem('userInfo');

  if (userInfoString && userInfoString !== "undefined" && userInfoString !== "null") {
    try {
      const userInfo = JSON.parse(userInfoString);

      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }

    } catch (e) {
      console.error("Token corruption detected, clearing session.");
      localStorage.removeItem('userInfo');
    }
  }

  return config;
});

export default api;