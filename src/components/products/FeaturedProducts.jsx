import { useEffect, useState } from "react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchFeatured() {
      const res = await fetch("/api/featured");
      const data = await res.json();
      setProducts(data);
    }
    fetchFeatured();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded">
          <img
            src={product.thumbnail || "/images/default-product.png"}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          <h3 className="mt-2 font-semibold">{product.name}</h3>
          <p className="text-indigo-600 font-bold">${product.price}</p>
        </div>
      ))}
    </div>
  );
}
