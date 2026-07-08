"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="glass-card w-full max-w-md p-8 md:p-10 shadow-2xl relative overflow-hidden bg-[#16161F] border-[rgba(255,255,255,0.06)] text-center">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#FF2E93]/5 blur-2xl pointer-events-none" />

          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#FF2E93]/10 text-[#FF2E93] mb-6">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-black text-white tracking-tight uppercase">Admin Verification</h1>
          <p className="mt-2 text-xs text-gray-400 font-semibold leading-relaxed">
            This verification gate is reserved for administrative provisioning. Please inspect your inbox for verification links or OTP triggers.
          </p>

          <div className="mt-8 p-4 bg-[#0B0B0F] border border-[rgba(255,255,255,0.04)] rounded-xl flex items-center gap-3 text-left">
            <Mail className="h-5 w-5 text-[#FF2E93] shrink-0" />
            <div className="text-[10px] text-gray-400 font-semibold uppercase">
              <p className="text-white font-bold">Check SMTP Logs</p>
              <p>Activation links expire in 24 hours.</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = "mailto:shekara727@gmail.com"}
            className="pink-btn w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider mt-6 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Contact Administrator</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
