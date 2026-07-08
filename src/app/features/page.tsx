"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Zap,
  ShieldCheck,
  Cpu,
  Database,
  Server,
  RefreshCw,
  Sparkles,
  Lock,
  Globe,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Sliders,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#FF2E93]" />,
      title: "Anti-Ban Protection System",
      badge: "100% Account Safe",
      desc: "Our automated delivery queues execute boosts through organic profile interactions. This mimics human traffic and keeps your Free Fire in-game profile completely secure from restrictions.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-[#FF2E93]" />,
      title: "Decentralized Server Pools",
      badge: "High Availability",
      desc: "Autolikes are routed via multiple active cloud-based pools to ensure consistent execution speed. If one network cluster experiences lag, traffic is dynamically shifted to active nodes.",
    },
    {
      icon: <Zap className="h-6 w-6 text-[#FF2E93]" />,
      title: "Instant Deliveries Cron",
      badge: "Automated Routine",
      desc: "No manual triggers required. The platform reads active UIDs from the database, executes likes according to subscription schedules, and records real-time logs in public feeds.",
    },
    {
      icon: <Database className="h-6 w-6 text-[#FF2E93]" />,
      title: "Encrypted Data Security",
      badge: "Bank-Grade Privacy",
      desc: "Your account parameters, reference hashes, and region values are securely mapped inside Supabase databases using rigorous Row Level Security policies.",
    },
    {
      icon: <Server className="h-6 w-6 text-[#FF2E93]" />,
      title: "220 Daily Likes Load",
      badge: "Guaranteed Daily Rate",
      desc: "Every subscription plan guarantees a steady, reliable flow of approximately 220 likes daily, systematically delivered at 4:00 AM IST to match server refresh cycles.",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-[#FF2E93]" />,
      title: "Real-Time Progress Tracker",
      badge: "Live Status",
      desc: "Follow queue status indicators directly from your user dashboard, view order transaction history, inspect account statistics, and track delivery progress percentage.",
    },
    {
      icon: <Globe className="h-6 w-6 text-[#FF2E93]" />,
      title: "Global Region Support",
      badge: "All FF Regions",
      desc: "Full compatibility with IND, SGP, THA, BR, EEU, SAC, and all official Free Fire servers worldwide with instant UID identification.",
    },
    {
      icon: <Clock className="h-6 w-6 text-[#FF2E93]" />,
      title: "24/7 Automated Queues",
      badge: "Zero Downtime",
      desc: "Cloud servers run 24 hours a day, 7 days a week. Your boost campaigns stay active automatically without needing manual application restarts.",
    },
    {
      icon: <Sliders className="h-6 w-6 text-[#FF2E93]" />,
      title: "Flexible Plan Upgrades",
      badge: "Instant Activation",
      desc: "Easily upgrade your duration from 7 Days to 90 Days Pro+ anytime. Manual UPI with QR upload and instant Razorpay payments automatically extend your active subscription.",
    },
  ];

  const highlights = [
    { title: "Delivery Speed", val: "Instant / Daily Batches", icon: <Clock className="h-5 w-5 text-[#FF2E93]" /> },
    { title: "Success Rate", val: "99.98% Completion", icon: <CheckCircle className="h-5 w-5 text-green-400" /> },
    { title: "Supported Servers", val: "All Free Fire Regions", icon: <Globe className="h-5 w-5 text-cyan-400" /> },
    { title: "Support Response", val: "< 15 Min Telegram", icon: <Sparkles className="h-5 w-5 text-yellow-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 space-y-16">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Technical Infrastructure & Specifications
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
            How Flash Autolike Delivers Superior Likes
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Powered by high-speed server clusters, automated cron scheduling, anti-ban payload validation, and real-time live data inspection.
          </p>
        </motion.div>

        {/* HIGHLIGHTS METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {highlights.map((h, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl flex flex-col items-center text-center space-y-2"
            >
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">{h.icon}</div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{h.title}</span>
              <p className="text-sm font-black text-white">{h.val}</p>
            </motion.div>
          ))}
        </div>

        {/* MAIN FEATURES GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#FF2E93]" /> Platform Features & Protections
            </h2>
            <span className="text-xs text-gray-500 font-bold uppercase">9 Core Features</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] hover:border-[#FF2E93]/30 transition-all rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF2E93]/10 border border-[#FF2E93]/20 group-hover:scale-105 transition-transform">
                      {f.icon}
                    </span>
                    <span className="text-[9px] font-bold text-[#FF2E93] bg-[#FF2E93]/10 border border-[#FF2E93]/20 px-2.5 py-0.5 rounded-full uppercase">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 uppercase group-hover:text-[#FF2E93] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 bg-gradient-to-r from-[#16161F] via-[#1F1426] to-[#16161F] border border-[#FF2E93]/20 rounded-3xl text-center space-y-4"
        >
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ready to Boost Your Free Fire Account Likes?</h3>
          <p className="text-xs text-gray-300 max-w-xl mx-auto font-medium">
            Join thousands of active Free Fire players using Flash Autolike. Pick a plan and start receiving daily likes automatically.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/#pricing"
              className="pink-btn px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF2E93]/20"
            >
              <span>View Pricing Plans</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/account-info"
              className="outline-btn px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Inspect UID Info
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
