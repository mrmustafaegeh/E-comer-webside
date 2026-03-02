"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const safeTranslate = (key, fallback) => {
    try {
      const translation = t(key);
      return translation === key ? fallback : translation;
    } catch (error) {
      return fallback;
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && !isSubscribed) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-auto bg-black border-t border-white/10 text-white relative overflow-hidden pb-12 pt-24">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          
                    <div className="lg:col-span-5 space-y-12">
            <Link href="/" className="flex items-center group">
              <div className="w-14 h-14 bg-white rounded-none flex items-center justify-center mr-5 shadow-2xl transition-all duration-700 group-hover:bg-black group-hover:ring-1 group-hover:ring-white">
                <span className="text-black font-heading font-black tracking-tighter text-2xl group-hover:text-white transition-colors duration-700 italic">QC</span>
              </div>
              <span className="text-3xl font-heading font-black text-white tracking-tighter uppercase italic transition-transform duration-700 group-hover:translate-x-3">
                {safeTranslate("common.siteTitle", "QUICKCART")}
              </span>
            </Link>
            
            <p className="text-gray-700 text-[11px] font-mono font-black tracking-[0.4em] uppercase leading-loose max-w-md italic">
              // {safeTranslate(
                "footer.brandDescription",
                "Your premium destination for quality electronics and lifestyle essentials. Experience shopping reimagined through the lens of monochromatic precision."
              )}
            </p>

            <div className="flex space-x-6">
              {[
                { name: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { name: "Twitter", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { name: "LinkedIn", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-2 2 2 2 0 012-2z" }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-none bg-black border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-500 shadow-2xl text-gray-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-12">
            <div className="space-y-10">
              <h3 className="text-[10px] font-mono font-black tracking-[0.6em] text-white uppercase italic border-b border-white/10 pb-4">OPERATIONS</h3>
              <ul className="space-y-6">
                {["NEW ARRIVALS", "BEST SELLERS", "ELECTRONICS", "ACCESSORIES"].map((item) => (
                  <li key={item}>
                    <Link href="/products" className="text-[10px] font-mono font-medium text-gray-700 hover:text-white transition-all duration-500 hover:translate-x-2 block tracking-widest uppercase italic font-black">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-10">
              <h3 className="text-[10px] font-mono font-black tracking-[0.6em] text-white uppercase italic border-b border-white/10 pb-4">DATABASE</h3>
              <ul className="space-y-6">
                {["ABOUT US", "CAREERS", "BLOG", "CONTACT"].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="text-[10px] font-mono font-medium text-gray-700 hover:text-white transition-all duration-500 hover:translate-x-2 block tracking-widest uppercase italic font-black">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-10">
              <h3 className="text-[10px] font-mono font-black tracking-[0.6em] text-white uppercase italic border-b border-white/10 pb-4">SYSTEM ALERTS</h3>
              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER UPLINK ADDRESS..."
                    className="w-full py-5 bg-transparent border-0 border-b border-white text-white rounded-none focus:border-white focus:ring-0 outline-none transition-all text-[11px] font-mono font-black uppercase tracking-widest placeholder:text-gray-600"
                    required
                  />
                  <button 
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-400 transition-all duration-500 hover:translate-x-2"
                  >
                   <svg className="w-5 h-5 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                   </svg>
                  </button>
                </div>
                {isSubscribed && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[9px] font-mono font-black tracking-[0.4em] uppercase text-white italic underline underline-offset-8"
                  >
                    // UPLINK ESTABLISHED.
                  </motion.p>
                )}
              </form>
            </div>
          </div>
        </div>

                <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-mono font-black tracking-[0.6em] uppercase text-gray-500 italic">
          <p>// END TRANSMISSION. © {currentYear} QUICKCART CORE.</p>
          <div className="flex gap-10">
            <Link href="/privacy" className="hover:text-white transition-all duration-500 hover:scale-110">PRIVACY PROTOCOL</Link>
            <Link href="/terms" className="hover:text-white transition-all duration-500 hover:scale-110">TERMS OF MATRIX</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
