import HeroSlider from "../slider/HeroSlider";
import FeaturedProducts from "../features/FeaturedProducts";

export default function HomePage() {
  const demoProducts = [
    { id: 1, name: "Smartphone", price: 899, image: "/images/phone.jpg" },
    { id: 2, name: "Laptop", price: 1299, image: "/images/laptop.jpg" },
    { id: 3, name: "Headphones", price: 199, image: "/images/headphones.jpg" },
  ];

  return (
    <>
      <HeroSlider />
      <FeaturedProducts products={demoProducts} />
    </>
  );
}
