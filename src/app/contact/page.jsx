import ContactForm from "../../Component/contact/ContactForm";

export const metadata = {
  title: "Contact Us - QUICKCART",
  description: "Get in touch with our team for support or inquiries through our monochromatic terminal.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 md:py-48 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 xl:gap-32">
            {/* Left Col: Info */}
            <div className="space-y-16">
                <div>
                    <span className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.6em] mb-8 block italic animate-pulse">
                        // Communication Protocol 09
                    </span>
                    <h1 className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter mb-12 leading-none uppercase italic border-l-4 border-white pl-10">
                        Get in <br className="hidden md:block" /> Touch.
                    </h1>
                    <p className="text-xl text-gray-700 font-mono font-black max-w-md leading-relaxed mb-20 uppercase italic tracking-widest border-t border-white/5 pt-12">
                        Our decentralized support team is available for global inquiries, technical data, and strategic partnerships.
                    </p>
                </div>

                <div className="space-y-16">
                    <div className="group cursor-default">
                        <p className="text-[9px] font-mono font-black text-gray-900 uppercase tracking-[0.5em] mb-4 group-hover:text-white transition-colors italic">// Direct Terminal</p>
                        <p className="text-3xl font-heading font-black text-white tracking-widest italic uppercase group-hover:translate-x-4 transition-transform duration-700 underline underline-offset-[12px] decoration-white/10 group-hover:decoration-white">hello@quickcart.console</p>
                    </div>
                    <div className="group cursor-default">
                        <p className="text-[9px] font-mono font-black text-gray-900 uppercase tracking-[0.5em] mb-4 group-hover:text-white transition-colors italic">// Global Operations</p>
                        <p className="text-3xl font-heading font-black text-white tracking-widest italic uppercase group-hover:translate-x-4 transition-transform duration-700 leading-tight">One Apple Park Way, <br />Cupertino, CA 95014</p>
                    </div>
                </div>
            </div>

            {/* Right Col: Form */}
            <div className="bg-black p-10 md:p-16 xl:p-24 rounded-none border border-white/10 shadow-2xl relative group hover:border-white transition-all duration-1000">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-1000 pointer-events-none"></div>
                <div className="relative z-10">
                    <ContactForm />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
