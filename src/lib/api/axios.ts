import axios, { AxiosError } from "axios";

// Configure base API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // allow cookie mode if backend sets it
});

// Using cookie-based auth (httpOnly). Ensure credentials are sent.
api.interceptors.request.use((config) => {
  // Nothing to attach; server reads JWT from cookie
  return config;
});

// Normalize success/error responses per backend conventions
api.interceptors.response.use(
  (response) => {
    // Backend success shape: { success: true, data, message? }
    if (response?.data && typeof response.data === "object") {
      const { success, data } = response.data as { success?: boolean; data?: unknown };
      if (success === true && data !== undefined) {
        return { ...response, data };
      }
    }
    return response;
  },
  (error: AxiosError) => {
    // Forward error with status/message; caller handles 401/403
    return Promise.reject(error);
  }
);

export default api;
