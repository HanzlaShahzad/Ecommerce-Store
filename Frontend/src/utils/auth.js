export function isSessionTokenValid(token) {
  if (typeof token !== "string") return false;

  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return false;

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));
    return Number.isFinite(payload.exp) && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
