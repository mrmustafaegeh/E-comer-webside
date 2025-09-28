"use client";

import Link from "next/link";
import {
  FadeInUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
} from "../../hooks/useAnimation.jsx";

const featureItems = [
  {
    img: "/image/Fast-dilevery.jpg",
    title: "Fast Delivery",
    desc: "Quick doorstep drops within 24 hours",
  },
  {
    img: "/image/girl_with_earphone_image.png",
    title: "Top Quality",
    desc: "100% original tech with warranty",
  },
  {
    img: "/image/boy_with_laptop_image.png",
    title: "24/7 Support",
    desc: "We're here always to help you",
  },
];

const AboutUs = () => (
  <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
    <div className="container mx-auto px-4 max-w-6xl">
      <FadeInUp>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-4">
            Welcome to QuickCart
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Best products, unbeatable service. Your trusted partner for quality
            electronics.
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer staggerDelay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featureItems.map((item, index) => (
            <StaggerItem key={index}>
              <ScaleIn scale={0.9} delay={index * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                  {/* Image container with fallback background */}
                  <div className="h-64 relative overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        // Simple error handling - image will hide and background will show
                        e.target.style.opacity = "0";
                      }}
                    />
                    {/* Fallback text that shows if image fails */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-blue-600 font-semibold bg-white/80 px-3 py-1 rounded-lg">
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    <FadeInUp delay={0.3}>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {item.title}
                      </h3>
                    </FadeInUp>
                    <FadeInUp delay={0.4}>
                      <p className="text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </FadeInUp>
                  </div>
                </div>
              </ScaleIn>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Rest of the component remains the same */}
      <FadeInUp delay={0.5}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto text-center text-white">
          <FadeInUp delay={0.2}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
              To connect people with the best technology, effortlessly and
              affordably.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get In Touch
            </Link>
          </FadeInUp>
        </div>
      </FadeInUp>
    </div>
  </section>
);

export default AboutUs;
