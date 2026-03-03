import AboutUs from "../../Component/aboutusPage/AboutUs.jsx";

export const metadata = {
  title: "About Us - QuickQart",
  description:
    "Learn more about QuickQart - your trusted partner for quality electronics with fast delivery and top-notch service.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      <AboutUs />
    </div>
  );
}
