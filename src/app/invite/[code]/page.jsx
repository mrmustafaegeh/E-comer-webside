import { prisma } from "@/lib/prisma";
import { Gift, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getReferrer(code) {
  return await prisma.user.findUnique({
    where: { referralCode: code },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
}

export default async function ReferralLandingPage({ params }) {
  const { code } = await params;
  const referrer = await getReferrer(code);

  if (!referrer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-xl w-full relative z-10 text-center space-y-12">
                        <div className="space-y-6">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative w-32 h-32 mx-auto rounded-full border-2 border-white/10 p-2 bg-[#161b27] shadow-2xl">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#0f1117] relative">
                            {referrer.image ? (
                                <Image src={referrer.image} alt={referrer.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/10 italic">
                                    {referrer.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-[0.4em] block">Tactical Transmission</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        {referrer.name} sent you a gift<span className="text-purple-600">.</span>
                    </h1>
                </div>
            </div>

                        <div className="bg-[#161b27]/80 backdrop-blur-xl p-10 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative group hover:border-purple-500/30 transition-all duration-700">
                <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Gift size={48} className="text-purple-500" />
                </div>
                
                <div className="space-y-8 relative z-10">
                    <div className="text-left space-y-4">
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
                            <Sparkles size={14} className="text-purple-400" />
                            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">Limited Recruitment Protocol</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-tight">
                            Claim 100 Bonus Points <br/>
                            <span className="text-gray-500">to start your archive.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0f1117] p-6 rounded-3xl border border-white/5 text-left">
                            <ShieldCheck size={20} className="text-blue-500 mb-3" />
                            <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">Verify</h4>
                            <p className="text-xs font-bold text-white uppercase tracking-tighter">Instant Identity</p>
                        </div>
                        <div className="bg-[#0f1117] p-6 rounded-3xl border border-white/5 text-left">
                            <Zap size={20} className="text-yellow-500 mb-3" />
                            <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">Yield</h4>
                            <p className="text-xs font-bold text-white uppercase tracking-tighter">1.1x Tier Start</p>
                        </div>
                    </div>

                    <Link 
                        href={`/auth/register?referredBy=${code}`}
                        className="w-full h-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-[2rem] font-mono font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all duration-500 group"
                    >
                        Initialize Account
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>

                        <div className="pt-8 flex flex-col items-center gap-4">
                <p className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-widest">
                    Secured by QuickCart Neural Network
                </p>
                <Link href="/" className="text-[10px] font-mono text-blue-500/50 hover:text-blue-500 font-bold uppercase tracking-widest transition-colors">
                    View Network Mainframe
                </Link>
            </div>
        </div>
    </div>
  );
}
