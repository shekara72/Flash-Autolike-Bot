"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { UserCheck, Shield, Radio, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <UserCheck className="h-6 w-6 text-[#FF2E93]" />,
      stepNum: "01",
      title: "Passwordless UID Authentication",
      desc: "Input your 8-12 digit numerical Free Fire In-Game UID on our secure login portal. The server connects to the Player Info API and verifies your in-game nickname deterministically without requiring credentials."
    },
    {
      icon: <Shield className="h-6 w-6 text-[#FF2E93]" />,
      stepNum: "02",
      title: "Plan Selection & Secure Escrow",
      desc: "Choose a subscription tier, then settle payment automatically via Razorpay (instant) or manual UPI scan (requires UTR & screenshot upload). The order details are logged securely."
    },
    {
      icon: <Radio className="h-6 w-6 text-[#FF2E93]" />,
      stepNum: "03",
      title: "Server Pool Dynamic Allocation",
      desc: "Upon plan activation, our system assigns your UID parameters to a dedicated delivery cluster. The cluster schedules automatic daily deliveries at 4:00 AM IST."
    },
    {
      icon: <Activity className="h-6 w-6 text-[#FF2E93]" />,
      stepNum: "04",
      title: "Organic Interaction Delivery",
      desc: "Likes flow into your target in-game posts organically, utilizing high-quality profiles to ensure compliance with server guidelines and prevent restrictions."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20 uppercase">
            Platform Flow
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            How The System Executes
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            A transparent sequential look at our boost architecture
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-6 sm:before:left-1/2 before:w-[2px] before:bg-white/5 before:pointer-events-none">
          {steps.map((s, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-0 relative ${
                  isEven ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Step contents */}
                <div className="w-full sm:w-[45%] glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.04)] relative">
                  <div className="absolute top-4 right-4 text-2xl font-black text-[#FF2E93]/15 font-mono">{s.stepNum}</div>
                  <h3 className="text-sm font-bold text-white uppercase mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">{s.desc}</p>
                </div>

                {/* Timeline Circle */}
                <div className="absolute left-0 sm:left-1/2 -translate-x-[11px] sm:-translate-x-1/2 bg-[#0B0B0F] p-1.5 border-2 border-[#FF2E93] rounded-full z-10">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF2E93]/10">
                    {s.icon}
                  </span>
                </div>

                {/* Spacer */}
                <div className="hidden sm:block w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
