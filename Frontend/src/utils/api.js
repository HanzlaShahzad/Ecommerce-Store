import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:2000"
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

api.interceptors.response.use((response) => {
  response.data = normalizeExtendedJson(response.data);
  return response;
});

export default api;
