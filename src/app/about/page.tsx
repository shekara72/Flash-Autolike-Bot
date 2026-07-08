"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { ShieldAlert, Users, Award, Landmark } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const metrics = [
    { label: "Community Members", value: "12,400+" },
    { label: "Total Completed Purchases", value: "880+" },
    { label: "Likes Successfully Dispatched", value: "128,450+" },
    { label: "System Uptime Rate", value: "99.98%" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 space-y-16">
        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20 uppercase">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            About Flash Portal
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Premium gaming engagement booster tools
          </p>
        </motion.div>

        {/* History Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-lg font-black uppercase text-white">Platform Infrastructure History</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Flash Portal was established in early 2024 to solve a simple challenge: providing gaming enthusiasts with premium, organic, and safe post-engagement tools without compromising account safety. Our engineers created a custom decentralized pool execution system that syncs seamlessly with player In-Game IDs (UIDs).
            </p>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Today, the platform serves thousands of players across the India, Bangladesh, and Singapore regions, routing daily interaction queues and rendering secure escrow logs.
            </p>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="glass-card p-4 bg-[#16161F] border-[rgba(255,255,255,0.04)] text-center">
                <span className="text-lg font-black text-[#FF2E93] block">{m.value}</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1 block">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8 pt-8 border-t border-[rgba(255,255,255,0.06)]">
          <h3 className="text-lg font-black uppercase text-white text-center">Our Core Operating Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.04)] hover:border-[#FF2E93]/20 transition-all text-center space-y-4">
              <Users className="h-8 w-8 text-[#FF2E93] mx-auto" />
              <h4 className="font-bold text-white uppercase">Client First</h4>
              <p className="text-gray-400 leading-relaxed font-semibold">We guarantee safe organic interaction patterns, keeping client credentials strictly private via passwordless UID syncs.</p>
            </div>
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.04)] hover:border-[#FF2E93]/20 transition-all text-center space-y-4">
              <Award className="h-8 w-8 text-[#FF2E93] mx-auto" />
              <h4 className="font-bold text-white uppercase">Quality Delivery</h4>
              <p className="text-gray-400 leading-relaxed font-semibold">Likes originate from active looking profiles rather than standard low-quality automation triggers.</p>
            </div>
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.04)] hover:border-[#FF2E93]/20 transition-all text-center space-y-4">
              <Landmark className="h-8 w-8 text-[#FF2E93] mx-auto" />
              <h4 className="font-bold text-white uppercase">Transparent billing</h4>
              <p className="text-gray-400 leading-relaxed font-semibold">Generate highly styled PDF receipts instantly with verified transaction hashes and tax splits.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
