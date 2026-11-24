import { API_BASE_URL } from "./api";

export function getProductImageUrl(image) {
  if (!image) {
    return "/placeholder-product.png";
  }

  if (/^(https?:)?\/\//i.test(image) || image.startsWith("data:")) {
    return image;
  }

  const imagePath = image.replace(/^\/+/, "");
  const uploadsPath = imagePath.startsWith("uploads/")
    ? imagePath
    : `uploads/${imagePath}`;

  return `${API_BASE_URL}/${uploadsPath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
