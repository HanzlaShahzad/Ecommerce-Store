import axios from "axios";
import { isSessionTokenValid } from "./auth";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = "https://ecommerce-store-coral-ten.vercel.app";
export const API_BASE_URL = (
  configuredApiUrl ||
  defaultApiUrl
).replace(/\/+$/, "");

function normalizeExtendedJson(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeExtendedJson);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (
    Object.keys(value).length === 1 &&
    typeof value.$oid === "string"
  ) {
    return value.$oid;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      normalizeExtendedJson(nestedValue),
    ]),
  );
}

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (isSessionTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token) {
    localStorage.removeItem("token");
  }
  return config;
});

api.interceptors.response.use((response) => {
  response.data = normalizeExtendedJson(response.data);
  return response;
});

export default api;
