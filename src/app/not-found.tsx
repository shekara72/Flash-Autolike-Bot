"use client";

import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ShieldAlert, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card max-w-md p-8 md:p-10 bg-[#16161F] border-[rgba(255,255,255,0.06)] shadow-2xl space-y-6"
        >
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-red-950/20 text-[#FF2E93] border border-red-900/50">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight">404 - Page Not Found</h1>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              The target path you requested does not exist or has been relocated to another REST node.
            </p>
          </div>

          <Link
            href="/"
            className="pink-btn w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#FF2E93]/20"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home Gateway</span>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
