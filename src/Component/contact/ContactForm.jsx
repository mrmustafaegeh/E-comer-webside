"use client";

import { useState } from "react";
import { post } from "../../services/api";
import { Send, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 space-y-12">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-none mb-4 border border-white shadow-2xl transition-all duration-700">
            <CheckCircle2 size={48} strokeWidth={1} className="text-black" />
        </div>
        <div className="space-y-6">
          <h3 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tighter uppercase italic leading-none">Transmission Received.</h3>
          <p className="text-gray-700 font-mono font-black text-[10px] uppercase tracking-[0.4em] italic leading-relaxed max-w-sm mx-auto">
            // Encryption completed. Protocol synchronized. Expect response within 24 operational cycles.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="px-12 py-5 bg-black border border-white/20 hover:border-white text-gray-700 hover:text-white rounded-none font-mono font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-700 italic group"
        >
          [ RELAUNCH Handshake ]
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.5em] ml-1 italic">// Identity</label>
          <input
            className="w-full bg-black border border-white/10 rounded-none py-6 px-8 text-white placeholder:text-gray-900 outline-none transition-all duration-700 focus:border-white font-mono text-[11px] uppercase tracking-widest italic shadow-inner"
            placeholder="Official Name / AUTH_ID"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>
        
        <div className="space-y-4">
          <label className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.5em] ml-1 italic">// Point of Return</label>
          <input
            className="w-full bg-black border border-white/10 rounded-none py-6 px-8 text-white placeholder:text-gray-900 outline-none transition-all duration-700 focus:border-white font-mono text-[11px] uppercase tracking-widest italic shadow-inner"
            placeholder="Authorized E-Mail Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.5em] ml-1 italic">// Payload (Data_Transfer)</label>
          <textarea
            className="w-full bg-black border border-white/10 rounded-none py-6 px-8 text-white placeholder:text-gray-900 outline-none transition-all duration-700 focus:border-white font-mono text-[11px] uppercase tracking-widest italic shadow-inner resize-none min-h-[200px]"
            placeholder="Describe the objective of this data transmission..."
            rows={5}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
          />
        </div>
      </div>

      {status === "error" && (
        <div className="text-white text-[10px] font-mono font-black uppercase tracking-[0.4em] bg-black p-6 rounded-none border border-white flex items-center gap-4 italic animate-pulse">
          <div className="w-2 h-2 bg-white translate-y-[-1px]"></div>
          TRANS_SYNC_ERROR: UNABLE TO ESTABLISH HANDSHAKE.
        </div>
      )}

      <button
        disabled={status === "loading"}
        className="w-full bg-white text-black py-8 rounded-none flex items-center justify-center gap-6 shadow-2xl border border-white hover:bg-black hover:text-white transition-all duration-700 disabled:opacity-30 group relative overflow-hidden italic"
      >
        <div className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></div>
        {status === "loading" ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin relative z-10" />
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.6em] relative z-10">Transmitting...</span>
          </>
        ) : (
          <>
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.6em] relative z-10">Execute Transmission</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform relative z-10" />
          </>
        )}
      </button>
    </form>
  );
}
