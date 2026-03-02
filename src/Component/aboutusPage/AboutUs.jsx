"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  FadeInUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
} from "../../hooks/useAnimation.jsx";

const AboutUs = () => {
  const { t } = useTranslation();

  const featureItems = [
    {
      img: "/image/Fast-dilevery.jpg",
      title: t("about.fastDelivery"),
      desc: t("about.fastDeliveryDesc"),
    },
    {
      img: "/image/girl_with_earphone_image.png",
      title: t("about.topQuality"),
      desc: t("about.topQualityDesc"),
    },
    {
      img: "/image/boy_with_laptop_image.png",
      title: t("about.support24"),
      desc: t("about.support24Desc"),
    },
  ];

  return (
    <section className="py-24 md:py-48 bg-black relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <FadeInUp>
          <div className="text-center mb-32">
            <span className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.6em] mb-6 block italic animate-pulse group">
               // Origin Protocol 01
            </span>
            <h2 className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter uppercase italic leading-none mb-10">
              {t("about.title")}
            </h2>
            <p className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-mono font-black uppercase tracking-widest italic border-t border-white/5 pt-10">
              {t("about.tagline")}
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer staggerDelay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 xl:gap-24 mb-40">
            {featureItems.map((item, index) => (
              <StaggerItem key={index}>
                <ScaleIn scale={0.95} delay={index * 0.1}>
                  <div className="bg-black rounded-none overflow-hidden border border-white/10 hover:border-white transition-all duration-[1500ms] group shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] pointer-events-none group-hover:bg-white/10 transition-all duration-1000"></div>
                    
                                        <div className="h-80 relative overflow-hidden bg-black border-b border-white/10">
                      <Image
                        width={800}
                        height={800}
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105 opacity-40 group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.opacity = "0";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
                    </div>

                    <div className="p-12 text-center relative z-10">
                      <FadeInUp delay={0.3}>
                        <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-6 tracking-tighter uppercase italic group-hover:scale-110 transition-transform duration-700">
                          {item.title}
                        </h3>
                      </FadeInUp>
                      <FadeInUp delay={0.4}>
                        <p className="text-gray-800 leading-relaxed text-[9px] font-mono font-black uppercase tracking-[0.4em] italic group-hover:text-gray-500 transition-colors duration-500">
                          // {item.desc}
                        </p>
                      </FadeInUp>
                    </div>
                  </div>
                </ScaleIn>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

                <FadeInUp delay={0.5}>
          <div className="bg-black border border-white/10 rounded-none shadow-[0_0_100px_rgba(0,0,0,1)] p-16 md:p-32 max-w-[1200px] mx-auto text-center relative overflow-hidden group">
            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 space-y-12">
              <FadeInUp delay={0.2}>
                <span className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.6em] mb-4 block italic">// The Directive</span>
                <h3 className="text-4xl md:text-7xl font-heading font-black text-white mb-10 tracking-tighter uppercase italic leading-none">
                  {t("about.missionTitle")}
                </h3>
              </FadeInUp>
              <FadeInUp delay={0.3}>
                <p className="text-gray-700 text-sm md:text-lg mb-16 leading-relaxed font-mono font-black uppercase tracking-widest italic max-w-4xl mx-auto border-l border-white/5 pl-10 md:pl-20 text-left">
                  {t("about.missionText")}
                </p>
              </FadeInUp>
              <FadeInUp delay={0.4}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-10 px-16 py-6 bg-white border border-white text-black rounded-none font-mono text-[11px] font-black uppercase tracking-[0.6em] hover:bg-black hover:text-white transition-all duration-700 shadow-2xl active:scale-95 italic group/btn"
                >
                  {t("about.getInTouch")}
                  <ArrowRight size={20} className="group-hover/btn:translate-x-4 transition-transform" />
                </Link>
              </FadeInUp>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default AboutUs;
