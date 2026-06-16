import AboutUs from "../../Component/aboutusPage/AboutUs.jsx";

export const metadata = {
  title: "About Us - QuickQart",
  description:
    "Learn more about QuickQart — quality products, fast delivery, and reliable support.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <AboutUs />
    </div>
  );
}
