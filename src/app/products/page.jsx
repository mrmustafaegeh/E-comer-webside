import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import ProductsClient from "./ProductsClient";
import { getProducts } from "../../services/productService";
import JsonLd, { generateBreadcrumbJsonLd } from "../../Component/seo/JsonLd";

export const revalidate = 60;

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const { search, category } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quickqart.com";
  const canonical = `${baseUrl}/products${category ? `?category=${category}` : ""}`;

  let title = "All products";
  let description = "Browse our full catalog with clear pricing and details.";

  if (category) {
    const term = category.charAt(0).toUpperCase() + category.slice(1);
    title = `${term} | QuickQart`;
    description = `Browse ${term} products with clear pricing and details.`;
  }

  if (search) {
    title = `Search: ${search} | QuickQart`;
  }

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "QuickQart",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductsPage({ searchParams }) {
  const queryClient = new QueryClient();
  const resolvedParams = await searchParams;
  
  const filters = {
    page: Math.max(1, parseInt(resolvedParams.page) || 1),
    limit: 10,
    search: resolvedParams.search || "",
    category: resolvedParams.category || "",
    minPrice: resolvedParams.minPrice || "",
    maxPrice: resolvedParams.maxPrice || "",
    sort: resolvedParams.sort || "newest"
  };

  // Prefetch for SSR Hydration
  await queryClient.prefetchQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quickqart.com";
  const breadcrumbs = [
    { name: "Home", item: baseUrl },
    { name: "Collection", item: `${baseUrl}/products` }
  ];
  if (filters.category) {
    breadcrumbs.push({ name: filters.category, item: `${baseUrl}/products?category=${filters.category}` });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumbs)} />
      <ProductsClient />
    </HydrationBoundary>
  );
}
