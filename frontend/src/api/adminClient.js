import axios from "axios";

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:6767/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("farmy_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(new Error(error.response?.data?.error || error.message || "Unable to contact the administrator service."))
);

export default adminClient;
