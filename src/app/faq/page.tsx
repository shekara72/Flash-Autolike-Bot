"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { HelpCircle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const FAQS = [
  {
    q: "How fast are the autolikes delivered?",
    a: "Autolikes delivery starts almost instantly. Our background delivery systems verify posts 24/7 and route interactions directly to your target numerical Free Fire UID."
  },
  {
    q: "Is it safe for my Free Fire profile?",
    a: "Absolutely. We utilize organic delivery pipelines that mimic natural user patterns, which ensures full safety for your account status and complies with standard server regulations."
  },
  {
    q: "What payment systems do you support?",
    a: "We support automated checkouts via Razorpay, as well as manual UPI verification. For UPI payments, simply scan the QR code, upload your transaction screenshot, enter the 12-digit UTR, and our admin panel will verify the order under 3 hours."
  },
  {
    q: "How does the daily 4:00 AM IST execution cycle work?",
    a: "Our automated servers trigger a cron queue every day at 4:00 AM IST. Any active subscription plan bound to a UID automatically receives its daily load allocation of ~220 likes."
  },
  {
    q: "Can I hide my stats from the public feed?",
    a: "Yes, you can toggle 'Hide Profile' from your user dashboard settings at any time. When enabled, your UID and nickname will be masked in the public activity feeds (e.g., Player*** and 1234***)."
  },
  {
    q: "How do I download my payment invoice?",
    a: "Once your payment is approved (either automatically via Razorpay or manually by an admin for UPI), a download link appears in your billing history. Clicking it dynamically compiles and downloads a highly styled PDF receipt."
  }
];

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            Help Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Quick technical answers regarding safety, queues, and gateways
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass-card border-[rgba(255,255,255,0.04)] bg-[#16161F] overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/2 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3 text-sm">
                  <HelpCircle className="h-5 w-5 text-[#FF2E93] shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-400 font-semibold leading-relaxed border-t border-[rgba(255,255,255,0.04)]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
