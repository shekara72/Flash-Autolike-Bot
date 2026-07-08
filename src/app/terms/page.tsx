"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20 uppercase">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Access rules, user obligations, and administrative ban enforcement policies
          </p>
        </motion.div>

        <div className="glass-card p-8 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-6 text-xs text-gray-300 leading-relaxed font-semibold">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">1. Platform Services access</h3>
            <p>
              By accessing Flash Portal, you agree to submit a valid Free Fire User ID (UID). You are solely responsible for ensuring the target UID parameters correspond to your actual profile.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">2. Fair Usage Policy</h3>
            <p>
              Users must not execute multithreaded API queries or attempt reverse engineering of the `/api/player-info` or database endpoints. Violations trigger automatic server blocks and permanent UID bans.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">3. Ban Enforcement Policies</h3>
            <p>
              Administrators reserve the right to temporarily or permanently suspend users violating platform terms. Accounts identified using fraudulent transaction UTR numbers or uploading manipulated screenshots will be immediately banned. Banned accounts are blocked from authentication gates and dashboard workspace access.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">4. Delivery Exclusions</h3>
            <p>
              While our decentralized pools aim for 100% daily execution rates, we are not responsible for game server outages or in-game post restrictions. Subscriptions run on continuous calendar days regardless of external network disruptions.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
