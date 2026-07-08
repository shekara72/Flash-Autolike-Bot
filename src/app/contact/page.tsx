"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Custom math captcha check to prevent bot spam
  const [captchaNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaNum2] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError(false);

    if (Number(captchaInput) !== captchaNum1 + captchaNum2) {
      setCaptchaError(true);
      return;
    }

    setSuccess(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setCaptchaInput("");

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

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
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Contact Support Desk
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Send us a secure dispatch regarding billing, plans or credentials
          </p>
        </motion.div>

        <div className="glass-card p-8 bg-[#16161F] border-[rgba(255,255,255,0.06)] relative overflow-hidden max-w-2xl mx-auto">
          <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[#FF2E93]/5 blur-3xl pointer-events-none" />

          {success && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-green-950/30 p-4 text-xs text-[#00E676] border border-green-900/50">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="font-bold leading-relaxed">Your message has been sent successfully! Our team will respond shortly.</p>
            </div>
          )}

          {captchaError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-red-950/30 p-4 text-xs text-red-400 border border-red-900/50">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="font-bold leading-relaxed">Security verification failed. Please check your captcha answer.</p>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white"
                placeholder="Billing query, delivery speed, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase">Inquiry / Details</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white resize-none"
                placeholder="Describe your inquiry..."
              />
            </div>

            {/* Captcha */}
            <div className="p-4 bg-[#0B0B0F] border border-[rgba(255,255,255,0.04)] rounded-xl flex items-center justify-between gap-4 text-xs">
              <span className="font-bold text-gray-400 uppercase">Security Check: Solve {captchaNum1} + {captchaNum2} = </span>
              <input
                type="number"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="glass-input max-w-[80px] rounded-lg py-1.5 px-3 text-center text-xs text-white"
                placeholder="Answer"
              />
            </div>

            <button
              type="submit"
              className="pink-btn w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF2E93]/20 text-xs font-bold uppercase tracking-wider"
            >
              <span>Submit Message</span>
              <Send className="h-4 w-4 text-white" />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
