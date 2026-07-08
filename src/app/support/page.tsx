"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { MessageCircle, Send, ShieldAlert, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SupportHubPage() {
  const handles = [
    {
      title: "@FL4SH_FF (Official Channel)",
      desc: "Join our official Telegram broadcasts channel to track system speed announcements, updates, new pricing tier listings, and promotion events.",
      link: "https://t.me/FL4SH_FF",
      cta: "Join Channel"
    },
    {
      title: "@FL4SH_AUTOLIKE_BOT (Official Support)",
      desc: "Direct Telegram bot helper for automated transaction error verification, custom UID mapping issues, and offline escrow questions.",
      link: "https://t.me/FL4SH_AUTOLIKE_BOT",
      cta: "Start Telegram Chat"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20 uppercase">
            Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Client Help Hub
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Direct communication channels to get help under 30 minutes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {handles.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.04)] hover:border-[#FF2E93]/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF2E93]/10 text-[#FF2E93]">
                  <Send className="h-6 w-6" />
                </span>
                <h3 className="text-sm font-bold text-white uppercase">{h.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">{h.desc}</p>
              </div>

              <a
                href={h.link}
                target="_blank"
                rel="noreferrer"
                className="pink-btn w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
              >
                <span>{h.cta}</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Warning */}
        <div className="mt-12 p-4 bg-red-950/20 border border-red-900/50 rounded-xl max-w-2xl mx-auto flex gap-3 items-center">
          <ShieldAlert className="h-6 w-6 text-red-400 shrink-0" />
          <p className="text-[10px] text-gray-400 leading-relaxed font-semibold uppercase">
            Caution: Under no circumstances will our administration ask for your Free Fire account password. We strictly use passwordless numerical UID mapping.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
