export function normalizeMongoId(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  if (typeof value.toHexString === "function") {
    return value.toHexString();
  }

  if (typeof value.$oid === "string") {
    return value.$oid;
  }

  if (value._id != null) {
    return normalizeMongoId(value._id);
  }

  return "";
}
