const DEFAULT_CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://shop-nest.hanzlashahzad41.workers.dev"
    : "http://localhost:5173";

export default function getClientUrl() {
  return (
    process.env.CLIENT_URL?.trim() ||
    process.env.FRONTEND_URL?.trim() ||
    DEFAULT_CLIENT_URL
  ).replace(/\/+$/, "");
}
