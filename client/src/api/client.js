import axios from "axios";

// Locally, Vite proxies /api to the Express server. In production set VITE_API_URL
// to the deployed backend, e.g. https://your-api.onrender.com/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === "ERR_NETWORK") return "Can't reach the server. Is the backend running?";
  return "Something went wrong. Please try again.";
}

export default api;
