const DEFAULT_CLIENT_URL =
  "https://ecommerce-store.hanzlashahzad41.workers.dev";

export default function getClientUrl() {
  return (
    process.env.CLIENT_URL?.trim() ||
    process.env.FRONTEND_URL?.trim() ||
    DEFAULT_CLIENT_URL
  ).replace(/\/+$/, "");
}
