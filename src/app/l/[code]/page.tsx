"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { 
  Zap, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinkVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code as string;

  const [linkData, setLinkData] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Verification Sequence States
  const [currentStep, setCurrentStep] = useState(0); // 0 = TG check (if active), 1+ = countdown pages
  const [totalSteps, setTotalSteps] = useState(1);
  const [countdown, setCountdown] = useState(15);
  const [isCounting, setIsCounting] = useState(false);
  const [btnReady, setBtnReady] = useState(false);
  const [tgJoined, setTgJoined] = useState(false);

  useEffect(() => {
    if (!code) return;

    const loadLinkDetails = async () => {
      setLoading(true);
      try {
        // 1. Fetch site settings
        const { data: setts } = await supabase.from("settings").select("*").eq("id", 1).single();
        setSiteSettings(setts);

        // 2. Fetch short link
        const res = await fetch(`/api/link?code=${encodeURIComponent(code)}`);
        const json = await res.json();

        if (!res.ok || json.error) {
          setErrorMsg(json.error || "Link not found or expired");
          return;
        }

        const link = json.link;
        setLinkData(link);
        setTotalSteps(link.page_count || 1);
        setCountdown(link.countdown_seconds || 15);

        // Determine starting step
        if (link.tg_join_check) {
          setCurrentStep(0); // Start with Telegram Join
        } else {
          setCurrentStep(1); // Start with countdown step 1
        }

        // 3. Log analytic click
        await fetch("/api/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            linkId: link.id,
            referrer: typeof document !== "undefined" ? document.referrer : "Direct",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          }),
        });

      } catch (err: any) {
        console.error("Verification init error:", err);
        setErrorMsg("Failed to initialize verification system");
      } finally {
        setLoading(false);
      }
    };

    loadLinkDetails();
  }, [code]);

  // Countdown timer effect
  useEffect(() => {
    if (!isCounting || countdown <= 0) {
      if (countdown === 0 && isCounting) {
        setIsCounting(false);
        setBtnReady(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  // Start countdown on stepping into countdown pages
  useEffect(() => {
    if (currentStep > 0 && currentStep <= totalSteps && linkData) {
      setCountdown(linkData.countdown_seconds || 15);
      setIsCounting(true);
      setBtnReady(false);
    }
  }, [currentStep, linkData, totalSteps]);

  const handleTelegramJoinClick = () => {
    setTgJoined(true);
    setBtnReady(true);
  };

  const handleNextStep = () => {
    if (!btnReady) return;

    if (currentStep === 0) {
      // Advance from Telegram check to countdown Step 1
      setCurrentStep(1);
    } else if (currentStep < totalSteps) {
      // Advance to next page step
      setCurrentStep(prev => prev + 1);
    } else {
      // Final Step reached -> redirect to target destination URL
      if (linkData?.original_url) {
        router.push(linkData.original_url);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent"></div>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Checking secure routing...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 animate-pulse" />
          <h2 className="text-lg font-black uppercase tracking-wide text-white">Link Verification Error</h2>
          <p className="text-xs text-gray-400 font-semibold max-w-sm">{errorMsg}</p>
          <Link href="/" className="pink-btn px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
        <div className="space-y-8">
          
          {/* Progress Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-widest flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> SECURE ANTIBOT LINK GATEWAY
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {currentStep === 0 ? "Verify Telegram Membership" : `Safe Redirect Verification Step ${currentStep} of ${totalSteps}`}
            </h1>
            <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
              Please follow the instructions below to unlock your destination path safely.
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card p-6 sm:p-8 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-6 relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2E93]/5 blur-3xl pointer-events-none rounded-full" />

            <AnimatePresence mode="wait">
              {/* STEP 0: Telegram Join Check */}
              {currentStep === 0 && (
                <motion.div
                  key="tg-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="h-16 w-16 mx-auto bg-sky-950/40 border border-sky-800/40 rounded-full flex items-center justify-center text-sky-400">
                    <MessageSquare className="h-8 w-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Join Telegram to Unlock Link</h3>
                    <p className="text-xs text-gray-400 font-semibold max-w-md mx-auto leading-relaxed">
                      You must join our official Telegram announcements channel to proceed. Click the button below, join, and return to this page.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                    <a
                      href={siteSettings?.telegram_channel_link || "https://t.me/FL4SH_FF"}
                      target="_blank"
                      onClick={handleTelegramJoinClick}
                      className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-500 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all text-white"
                    >
                      <span>Join Telegram Channel</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    <button
                      disabled={!tgJoined}
                      onClick={handleNextStep}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all border ${
                        tgJoined
                          ? "pink-btn border-transparent shadow-lg shadow-[#FF2E93]/20 cursor-pointer"
                          : "bg-gray-800 text-gray-500 border-transparent cursor-not-allowed"
                      }`}
                    >
                      <span>Continue to Verification</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1+: Countdown Verification */}
              {currentStep > 0 && currentStep <= totalSteps && (
                <motion.div
                  key={`countdown-step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center py-4"
                >
                  {/* Countdown Circle */}
                  <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                    {isCounting && (
                      <div className="absolute inset-0 rounded-full border-4 border-t-[#FF2E93] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    )}
                    <div className="text-center">
                      {countdown > 0 ? (
                        <>
                          <span className="text-2xl font-black text-white">{countdown}</span>
                          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block">Seconds</span>
                        </>
                      ) : (
                        <div className="text-[#FF2E93] flex flex-col items-center">
                          <Zap className="h-6 w-6 fill-current animate-bounce" />
                          <span className="text-[8px] font-extrabold uppercase tracking-widest block">Ready</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      {countdown > 0 ? "Checking Secure Redirection Route" : "Gateway Destination Ready"}
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold max-w-md mx-auto leading-relaxed">
                      {countdown > 0
                        ? "Please wait while our antibot verification system audits the integrity of your request headers."
                        : "Click the verification button below to generate your direct encrypted routing token."}
                    </p>
                  </div>

                  {/* Ads Block (Simulated) */}
                  {linkData.ads_enabled && (
                    <div className="bg-[#0B0B0F] border border-white/5 rounded-xl p-4 text-center space-y-2 my-4">
                      <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest block">Sponsored Link Advertisement</span>
                      <a href="https://info.killersharmabot.online" target="_blank" className="block p-3 bg-[#16161F] hover:bg-white/5 border border-dashed border-white/10 rounded-lg hover:border-[#FF2E93]/30 transition-all group">
                        <span className="text-xs font-black text-amber-400 block uppercase tracking-wide group-hover:text-[#FF2E93] transition-all">Get 10,000 Free Fire Diamonds Instant</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Click here to claim daily autolike bonus skins now!</span>
                      </a>
                    </div>
                  )}

                  <div className="flex justify-center pt-2">
                    <button
                      disabled={!btnReady}
                      onClick={handleNextStep}
                      className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all border ${
                        btnReady
                          ? "pink-btn border-transparent shadow-lg shadow-[#FF2E93]/20 cursor-pointer"
                          : "bg-gray-800 text-gray-500 border-transparent cursor-not-allowed"
                      }`}
                    >
                      {isFinalStep ? (
                        <>
                          <span>Go to Target Link</span>
                          <ExternalLink className="h-4.5 w-4.5" />
                        </>
                      ) : (
                        <>
                          <span>Verify Step {currentStep} of {totalSteps}</span>
                          <ArrowRight className="h-4.5 w-4.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Secure Note */}
          <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5" />
            <span>256-bit Secure Encrypted Redirect System</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
