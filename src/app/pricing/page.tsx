"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Zap, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

const PLANS = [
  {
    id: "demo",
    name: "Demo Trial",
    price: 20,
    duration: "1 Day",
    stars: "19 ⭐",
    likes: "~220 / Day",
    badge: null,
    features: ["1 Day Duration", "Total Likes: ~220", "Daily Load: ~220 Likes", "Daily Delivery: 4:00 AM IST", "Demo UID verification"],
  },
  {
    id: "starter",
    name: "7 Days Starter",
    price: 50,
    duration: "7 Days",
    stars: "49 ⭐",
    likes: "~220 / Day",
    badge: null,
    features: ["7 Days Duration", "Total Likes: 1,540", "Daily Load: ~220 Likes", "Daily Delivery: 4:00 AM IST", "Basic queue priority"],
  },
  {
    id: "growth",
    name: "15 Days Growth",
    price: 100,
    duration: "15 Days",
    stars: "99 ⭐",
    likes: "~220 / Day",
    badge: "BEST VALUE",
    features: ["15 Days Duration", "Total Likes: 3,300", "Daily Load: ~220 Likes", "Daily Delivery: 4:00 AM IST", "Standard queue priority"],
  },
  {
    id: "pro",
    name: "30 Days Pro",
    price: 200,
    duration: "30 Days",
    stars: "199 ⭐",
    likes: "~220 / Day",
    badge: "MOST POPULAR",
    features: ["30 Days Duration", "Total Likes: 6,600", "Daily Load: ~220 Likes", "Daily Delivery: 4:00 AM IST", "Pro VIP queue access"],
  },
  {
    id: "premium",
    name: "60 Days Premium",
    price: 400,
    duration: "60 Days",
    stars: "399 ⭐",
    likes: "~220 / Day",
    badge: "POPULAR",
    features: ["60 Days Duration", "Total Likes: 13,200", "Daily Load: ~220 Likes", "Daily Delivery: 4:00 AM IST", "Ultra-high queue priority", "Dedicated support logs"],
  },
  {
    id: "pro_plus",
    name: "90 Days Pro+",
    price: 600,
    duration: "90 Days",
    stars: "599 ⭐",
    likes: "~220 / Day",
    badge: "ULTIMATE PRO",
    features: ["90 Days Duration", "Total Likes: 19,800", "Daily Load: ~220 Likes", "Daily Delivery: 4:00 AM IST", "Maximum VIP queue access", "24/7 dedicated support"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Pricing Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Premium Subscription Tiers
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Select the best plan to boost your Free Fire profile reach with automatic daily deliveries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLANS.map((p, i) => {
            const isHighlight = p.badge === "MOST POPULAR" || p.badge === "BEST VALUE";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className={`glass-card p-8 border flex flex-col relative overflow-hidden bg-[#16161F] transition-all rounded-2xl ${
                  isHighlight ? "border-[#FF2E93] ring-1 ring-[#FF2E93]/30 shadow-xl shadow-[#FF2E93]/10" : "border-[rgba(255,255,255,0.06)]"
                }`}
              >
                {p.badge && (
                  <span className={`absolute top-5 right-5 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isHighlight ? "bg-[#FF2E93] text-white" : "bg-purple-950 text-purple-300 border border-purple-800"
                  }`}>
                    {p.badge}
                  </span>
                )}
                
                <h3 className="text-lg font-black uppercase text-white">{p.name}</h3>
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wide">
                  <span>Duration: {p.duration}</span>
                  <span className="text-[#FF2E93] flex items-center gap-1"><Star className="h-3 w-3 fill-[#FF2E93]" /> {p.stars}</span>
                </div>

                <div className="my-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">₹{p.price}</span>
                  <span className="text-xs text-gray-500 font-semibold">/ flat</span>
                </div>

                <hr className="border-[rgba(255,255,255,0.06)] my-2" />

                <ul className="space-y-3 my-6 text-xs text-gray-300 font-semibold flex-1">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#FF2E93] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=${p.id}`}
                  className={`w-full text-center py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                    isHighlight ? "pink-btn shadow-[#FF2E93]/20" : "outline-btn hover:bg-white/5"
                  }`}
                >
                  Purchase Plan
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Global cron details */}
        <div className="mt-12 glass-card p-6 border-dashed border-[#FF2E93]/20 bg-[#16161F] text-center max-w-3xl mx-auto space-y-3 rounded-2xl">
          <ShieldCheck className="h-6 w-6 text-[#FF2E93] mx-auto animate-pulse" />
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Platform Execution Cycles</h4>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            All likes are dispatched systematically at <span className="text-[#00E676] font-bold">4:00 AM IST</span> daily to ensure standard in-game queue validation. Payments made after 3:30 AM will be queued in the next day&apos;s pipeline trigger.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
