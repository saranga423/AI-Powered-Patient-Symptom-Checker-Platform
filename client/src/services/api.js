import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

export function setTokens(tokens) {
  accessToken = tokens?.accessToken || null;
  refreshToken = tokens?.refreshToken || refreshToken;

  if (accessToken) localStorage.setItem("accessToken", accessToken);
  else localStorage.removeItem("accessToken");

  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  else localStorage.removeItem("refreshToken");
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

api.interceptors.request.use(config => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original?._retry &&
      refreshToken &&
      !original?.url?.includes("/auth/refresh")
    ) {
      original._retry = true;

      try {
        refreshing ||= api.post("/auth/refresh", { refreshToken });
        const response = await refreshing;
        refreshing = null;
        setTokens(response.data);
        original.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        refreshing = null;
        clearTokens();
        window.dispatchEvent(new Event("auth-expired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);