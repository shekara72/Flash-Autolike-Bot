"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { loginWithUid } from "@/lib/uid-auth";
import { AlertCircle, ArrowRight, UserCheck, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  
  // UID Login State
  const [uid, setUid] = useState("");
  const [isBouncing, setIsBouncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [playerNickname, setPlayerNickname] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUidLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!/^\d{8,12}$/.test(uid.trim())) {
      setError("Invalid UID. Please enter a valid 8 to 12 digit Free Fire UID.");
      setLoading(false);
      return;
    }

    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);

    try {
      const result = await loginWithUid(uid.trim());

      if (!result.success || !result.profile) {
        setError(result.message || "Failed to verify UID. Please check your Free Fire UID and try again.");
        setLoading(false);
        return;
      }

      setPlayerNickname(result.profile.nickname);
      setIsSuccessState(true);

      setTimeout(() => {
        if (result.profile?.role === "admin" || result.profile?.role === "super_admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }, 1200);

    } catch (err: any) {
      setError("An unexpected error occurred. Please verify your internet connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Floating Ambient Background Shapes */}
        <div className="absolute top-1/4 left-10 h-64 w-64 rounded-full bg-[#FF2E93]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 h-72 w-72 rounded-full bg-purple-900/10 blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card w-full max-w-md p-8 md:p-10 shadow-2xl relative overflow-hidden bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl"
        >
          <div className="mb-8 text-center space-y-2">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-[#FF2E93]/10 flex items-center justify-center border border-[#FF2E93]/20 shadow-lg shadow-[#FF2E93]/10">
              <Sparkles className="h-7 w-7 text-[#FF2E93]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Free Fire UID Portal</h1>
            <p className="text-xs text-gray-400 font-medium">Enter your Free Fire UID to access your autolike dashboard</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-start gap-2.5 rounded-xl bg-red-950/40 p-4 text-xs text-red-400 border border-red-900/60 font-semibold"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHECKMARK SUCCESS ANIMATION OVERLAY */}
          {isSuccessState ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-10 text-center space-y-4"
            >
              <div className="h-16 w-16 mx-auto rounded-full bg-green-950/80 border-2 border-[#00E676] flex items-center justify-center shadow-lg shadow-[#00E676]/20">
                <CheckCircle2 className="h-10 w-10 text-[#00E676] animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase">Verified: {playerNickname}</h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">Starting session and opening dashboard...</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleUidLogin} className="space-y-6" id="uid-login-form">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase">Free Fire UID (8-12 Digits)</label>
                <motion.div 
                  animate={isBouncing ? { scale: [1, 0.94, 1.04, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                    <UserCheck className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    required
                    pattern="^\d{8,12}$"
                    value={uid}
                    onChange={(e) => setUid(e.target.value.replace(/\D/g, ""))}
                    className="glass-input w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-white font-mono"
                    placeholder="Enter Free Fire UID"
                    id="uid-login-input"
                    disabled={loading}
                  />
                </motion.div>
                <p className="text-[10px] text-gray-500 mt-2 font-medium">No password required. Instant login via Free Fire UID.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="pink-btn w-full rounded-xl py-3.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-xs shadow-lg shadow-[#FF2E93]/20"
                id="uid-login-submit-btn"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying Free Fire API...</span>
                  </div>
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-gray-500 font-semibold">
            Need help? Contact support on Telegram:{" "}
            <a href="https://t.me/FL4SH_AUTOLIKE_BOT" target="_blank" rel="noreferrer" className="font-black text-[#FF2E93] hover:text-[#E01E7E]">
              @FL4SH_AUTOLIKE_BOT
            </a>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
