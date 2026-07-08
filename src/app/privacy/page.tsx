"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            Privacy Policy Framework
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            How we protect your profile data, UTR hashes and UID parameters
          </p>
        </motion.div>

        <div className="glass-card p-8 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-6 text-xs text-gray-300 leading-relaxed font-semibold">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">1. Passwordless Data Pipeline</h3>
            <p>
              Flash Portal executes direct boosts utilizing only your Free Fire numerical User ID (UID). We do not request, process, or store account passwords or personal credentials. Verification is completely passwordless and executed through public API hashes.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">2. Ticker Masking Policy</h3>
            <p>
              To protect client identity, our public activity logs utilize a strict character masking regex. If the &ldquo;Hide Profile&rdquo; setting is toggled active, your in-game nickname and UID are automatically obfuscated in live streams (e.g. nickname `BOSS_ALOK` displays as `BOSS***` and UID `123456789` as `1234***789`).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">3. Escrow Transaction Records</h3>
            <p>
              UPI manual deposits require submission of a 12-digit transaction UTR reference number and a screenshot proof. Screenshot images are uploaded securely to private Supabase storage buckets (`payment-proofs/`) and are accessible only to administrators during administrative audits.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">4. Data Deletion</h3>
            <p>
              Users can request complete profile deletion. Upon execution, all associated profile attributes, activity logs, support tickets, and invoice history rows are permanently purged from PostgreSQL tables.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
