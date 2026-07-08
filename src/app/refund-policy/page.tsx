"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function RefundPolicyPage() {
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
            Transaction Refund Policy
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Details regarding payment finality, manual escrow verification and disputes
          </p>
        </motion.div>

        <div className="glass-card p-8 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-6 text-xs text-gray-300 leading-relaxed font-semibold">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">1. Finality of Purchases</h3>
            <p>
              Due to the automated allocation of server slots and proxy triggers upon plan activation, all completed purchases on Flash Portal are final. We do not support refunds once likes begin flowing to a target numerical UID.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">2. Manual UPI Verification Regulations</h3>
            <p>
              Manual UPI transactions are verified by administrators. If a user submits an incorrect, duplicate, or fraudulent 12-digit UTR reference number, the order will be rejected. Repeated invalid submissions are flagged as spam and result in profile bans.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">3. Failed Checkout Resolution</h3>
            <p>
              If a transaction was debited from your bank account but displays as failed on Vercel/Razorpay, please open a support ticket or ping `@FL4SH_AUTOLIKE_BOT` with your payment reference hash. Approved disputes will have the subscription timeframe manually applied by administrators.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase">4. Double Charges</h3>
            <p>
              In case of confirmed double charges on the same UID within 10 minutes, the second transaction value will be credited to extend the active subscription timeframe by the respective number of plan duration days.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
