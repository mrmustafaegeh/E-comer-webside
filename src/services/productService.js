import { prisma } from "@/lib/prisma";

export const DEFAULT_PRODUCT_LIMIT = 10;

/**
 * Get products with filtering and pagination
 */
export async function getProducts(params = {}) {
  try {
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || DEFAULT_PRODUCT_LIMIT));
    const skip = (page - 1) * limit;

    const where = {};

    if (params.category && params.category !== "all") {
      where.category = { equals: params.category, mode: "insensitive" };
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { category: { contains: params.search, mode: "insensitive" } }
      ];
    }

    // Price Filtering
    const hasMinPrice = params.minPrice !== undefined && params.minPrice !== "" && params.minPrice !== null;
    const hasMaxPrice = params.maxPrice !== undefined && params.maxPrice !== "" && params.maxPrice !== null;

    if (hasMinPrice || hasMaxPrice) {
      const priceFilter = {};
      
      if (hasMinPrice) {
        const minVal = parseFloat(params.minPrice);
        if (!isNaN(minVal)) priceFilter.gte = minVal;
      }
      
      if (hasMaxPrice) {
        const maxVal = parseFloat(params.maxPrice);
        if (!isNaN(maxVal)) priceFilter.lte = maxVal;
      }
      
      if (Object.keys(priceFilter).length > 0) {
        if (!where.AND) where.AND = [];
        where.AND.push({
          OR: [
            { price: priceFilter },
            { salePrice: priceFilter }
          ]
        });
      }
    }

    const orderBy = {};
    switch (params.sort) {
      case "price-low": orderBy.price = 'asc'; break;
      case "price-high": orderBy.price = 'desc'; break;
      case "rating": orderBy.rating = 'desc'; break;
      case "newest":
      default: orderBy.createdAt = 'desc'; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limit }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("ProductService.getProducts Error:", error);
    throw error;
  }
}

/**
 * Get product by ID or Slug
 */
export async function getProductById(idOrSlug) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      }
    });
    return product;
  } catch (error) {
    return null;
  }
}

/**
 * Create a new product
 */
export async function createProduct(data) {
  try {
    const slug = data.slug || (data.name || data.title || "product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const doc = await prisma.product.create({
      data: {
        ...data,
        slug
      }
    });

    return doc;
  } catch (error) {
    console.error("ProductService.createProduct Error:", error);
    throw error;
  }
}

/**
 * Update a product
 */
export async function updateProduct(id, data) {
  try {
    const result = await prisma.product.update({
      where: { id },
      data
    });
    return result;
  } catch (error) {
    console.error("ProductService.updateProduct Error:", error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error("ProductService.deleteProduct Error:", error);
    return false;
  }
}

/**
 * Hero & Featured Data
 */
export async function getHeroProductsData() {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: [
        { featuredOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 5
    });

    return products.map(p => ({
      ...p,
      imageUrl: p.image || (p.images && p.images[0]) || null,
      offerPrice: p.salePrice || p.price,
      gradient: "from-blue-500 to-purple-600"
    }));
  } catch (error) {
    return [];
  }
}

export async function getFeaturedProductsData() {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  } catch (error) {
    return [];
  }
}

export async function getCategoriesData() {
  try {
    return await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch (error) {
    return [];
  }
}
