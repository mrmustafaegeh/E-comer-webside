import ProductCard from "@/components/products/ProductCard";

export default async function ProductDetailPage({ params }) {
  const product = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products/${params.id}`,
    { cache: "no-store" }
  ).then((r) => r.json());

  return <ProductCard product={product} expanded />;
}
