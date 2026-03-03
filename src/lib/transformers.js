import { formatMoney, formatDate } from "./formatters";

/**
 * Transform a database product document into a frontend-ready object
 */
export function transformProduct(dbProduct) {
  if (!dbProduct) return null;

  const id = dbProduct._id?.toString() || dbProduct.id;
  const name = dbProduct.name || dbProduct.title || "Untitled Product";
  const price = Number(dbProduct.price) || 0;
  const salePrice = dbProduct.salePrice ? Number(dbProduct.salePrice) : null;
  
  const { _id, createdAt, updatedAt, ...rest } = dbProduct;
  
  return {
    ...rest,
    id,
    _id: id,
    name,
    title: name,
    price,
    formattedPrice: formatMoney(price),
    salePrice,
    formattedSalePrice: salePrice ? formatMoney(salePrice) : null,
    isOnSale: !!(salePrice && salePrice < price),
    discount: dbProduct.discount || (salePrice && price ? `-${Math.round(((price - salePrice) / price) * 100)}%` : ""),
    category: dbProduct.category?.toLowerCase() || "uncategorized",
    slug: dbProduct.slug || id,
    image: dbProduct.image || dbProduct.thumbnail || "/images/placeholder.png",
    createdAt: createdAt ? (createdAt instanceof Date ? createdAt.toISOString() : String(createdAt)) : null,
    updatedAt: updatedAt ? (updatedAt instanceof Date ? updatedAt.toISOString() : String(updatedAt)) : null,
    formattedDate: createdAt ? formatDate(createdAt) : "",
  };
}

export function transformProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(transformProduct);
}

/**
 * Transform a database order document
 */
export function transformOrder(order) {
  if (!order) return null;

  const id = order._id?.toString() || order.id;

  return {
    ...order,
    id,
    _id: id,
    totalAmount: Number(order.totalAmount || order.totalPrice || 0),
    formattedTotal: formatMoney(order.totalAmount || order.totalPrice || 0),
    formattedDate: order.createdAt ? formatDate(order.createdAt) : "",
    items: Array.isArray(order.items) ? order.items.map(item => ({
      ...item,
      id: item.id || item.productId || String(Math.random()),
      formattedPrice: formatMoney(item.price)
    })) : []
  };
}

/**
 * Transform a database user document
 */
export function transformUser(user) {
  if (!user) return null;
  
  const { _id, createdAt, updatedAt, ...rest } = user;
  const id = _id?.toString() || user.id;
  
  return {
    ...rest,
    id,
    _id: id,
    name: user.name || "Anonymous",
    email: user.email,
    image: user.image || null,
    phone: user.phoneNumber || user.phone || "",
    address: user.address || null,
    role: user.role || "user",
    isAdmin: user.role === "admin",
    loyaltyPoints: Number(user.loyaltyPoints || 0),
    loyaltyHistory: Array.isArray(user.loyaltyHistory) ? user.loyaltyHistory.map(({ date, ...h }) => ({
      ...h,
      date: date ? (date instanceof Date ? date.toISOString() : String(date)) : null,
      formattedDate: date ? formatDate(date) : ""
    })) : [],
    referralCode: user.referralCode || "",
    referredBy: user.referredBy || null,
    createdAt: createdAt ? (createdAt instanceof Date ? createdAt.toISOString() : String(createdAt)) : null,
    updatedAt: updatedAt ? (updatedAt instanceof Date ? updatedAt.toISOString() : String(updatedAt)) : null,
  };
}
