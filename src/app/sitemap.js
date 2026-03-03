import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quickqart.com';

  // Static core routes
  const routes = [
    '',
    '/about',
    '/products',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Dynamic products
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    });

    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt ? product.updatedAt.toISOString() : new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Dynamic categories map
    const categories = ['electronics', 'fashion', 'home', 'sports'];
    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return routes;
  }
}
