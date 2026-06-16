const FALLBACK = "/images/product-placeholder.svg";

function normalizeImage(src) {
  if (Array.isArray(src)) src = src[0];
  if (src && typeof src === "object") src = src.url || src.secure_url || "";
  const s = String(src || "").trim();
  if (!s) return FALLBACK;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export function getProductImageUrl(product) {
  if (!product) return FALLBACK;
  return normalizeImage(
    product.imageUrl ||
      product.image ||
      product.thumbnail ||
      product.images
  );
}
