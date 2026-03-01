"use client";

import { m } from "framer-motion";
import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";

const props = [
  { icon: Truck, title: "Global Logistics", desc: "Express structural dispatch" },
  { icon: ShieldCheck, title: "Protocol Security", desc: "RSA-2048 encryption active" },
  { icon: Clock, title: "Real-time Support", desc: "Dedicated node monitoring" },
  { icon: CreditCard, title: "Asset Liquidity", desc: "30-day clearance guarantee" },
];

export default function ValueProps() {
  return (
    <section className="bg-black py-20 border-t border-b border-white/10 relative z-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 xl:gap-20">
          {props.map((prop, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-8 group cursor-default"
            >
              <div className="p-6 bg-black border border-white/5 shadow-2xl rounded-none group-hover:border-white transition-all duration-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <prop.icon size={28} strokeWidth={1} className="text-gray-700 group-hover:text-white transition-all duration-500 transform group-hover:scale-110" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading font-black text-white text-base tracking-tighter uppercase italic group-hover:translate-x-2 transition-transform duration-500">{prop.title}</h3>
                <p className="text-[9px] font-mono font-black tracking-[0.4em] uppercase text-gray-800 italic group-hover:text-gray-500 transition-colors duration-500">// {prop.desc}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
