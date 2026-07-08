"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LiveStatistics from "@/components/live-statistics";
import ActivityFeed from "@/components/activity-feed";
import LiveStatsBar from "@/components/live-stats-bar";
import { supabase } from "@/lib/supabase";
import {
  Zap,
  CheckCircle2,
  Heart,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  MousePointer,
  Sparkles,
  X,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
}

interface GalleryItem {
  id: string;
  url: string;
  type: "image" | "video";
  title: string;
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: "demo",
    name: "Demo Trial",
    price: 20,
    duration_days: 1,
    features: ["1 Day Duration", "Total Likes: ~220", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST", "19 ⭐ equivalent"],
  },
  {
    id: "starter",
    name: "7 Days Starter",
    price: 50,
    duration_days: 7,
    features: ["7 Days Duration", "Total Likes: 1,540", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST", "49 ⭐ equivalent"],
  },
  {
    id: "growth",
    name: "15 Days Growth",
    price: 100,
    duration_days: 15,
    features: ["15 Days Duration", "Total Likes: 3,300", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST", "99 ⭐ equivalent"],
  },
  {
    id: "pro",
    name: "30 Days Pro",
    price: 200,
    duration_days: 30,
    features: ["30 Days Duration", "Total Likes: 6,600", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST", "199 ⭐ equivalent"],
  },
  {
    id: "premium",
    name: "60 Days Premium",
    price: 400,
    duration_days: 60,
    features: ["60 Days Duration", "Total Likes: 13,200", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST", "399 ⭐ equivalent"],
  },
  {
    id: "pro_plus",
    name: "90 Days Pro+",
    price: 600,
    duration_days: 90,
    features: ["90 Days Duration", "Total Likes: 19,800", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST", "599 ⭐ equivalent"],
  },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
    type: "image",
    title: "1,200 Likes delivered in 30 seconds",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80",
    type: "image",
    title: "VIP Account analytics spike",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
    type: "image",
    title: "Simultaneous multithread campaigns",
  },
];

const FAQS = [
  {
    q: "How fast are the likes delivered?",
    a: "Likes delivery starts almost instantly. Our autolike bot sensors verify posts 24/7 and route delivery to your account within minutes.",
  },
  {
    q: "Is it safe for my Free Fire profile?",
    a: "Absolutely. We utilize organic delivery pipelines that emulate standard user activity, maintaining complete safety for your account status.",
  },
  {
    q: "What payment systems do you support?",
    a: "We support automated instant checkout via Razorpay alongside manual UPI payments. For UPI, scan the QR code in dashboard, insert the UTR, upload the screenshot, and admin activates it immediately.",
  },
  {
    q: "How do I toggle profile privacy?",
    a: "Within your private dashboard settings, you can check or uncheck 'Hide Profile' to instantly mask or unmask your UID/Name in the public activity feeds.",
  },
];

export default function LandingPage() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Custom states
  const [cumulativeLikes, setCumulativeLikes] = useState(128450);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(false);

  // Contact state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch maintenance status
        const { data: sett } = await supabase
          .from("settings")
          .select("maintenance_mode")
          .eq("id", 1)
          .single();

        if (sett?.maintenance_mode) {
          // Check if logged in user is admin
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();
            if (profile?.role !== "admin") {
              setIsMaintenance(true);
            }
          } else {
            setIsMaintenance(true);
          }
        }
      } catch (e) {
        console.warn("Failed checking maintenance, continuing standard:", e);
      } finally {
        setCheckingMaintenance(false);
      }

      try {
        const { data: dbPlans } = await supabase
          .from("plans")
          .select("*")
          .eq("is_active", true);
        if (dbPlans && dbPlans.length > 0) {
          // Sync database structures
          const formattedPlans = dbPlans.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            duration_days: p.duration_days,
            features: p.features || [],
          })).sort((a, b) => a.price - b.price);
          setPlans(formattedPlans);
        }

        const { data: dbGallery } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });
        if (dbGallery && dbGallery.length > 0) {
          setGallery(dbGallery);
        }

        // Fetch 4 latest news
        const { data: dbNews } = await supabase
          .from("news")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(4);
        if (dbNews) {
          setLatestNews(dbNews);
        }
      } catch (e) {
        console.error("Error connecting to Supabase database:", e);
      }
    };
    loadData();
  }, []);

  // Cumulative delivered count-up animation
  useEffect(() => {
    const start = 124320;
    const duration = 2000; 
    const end = 128450 + Math.floor(Math.random() * 200); 
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCumulativeLikes(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setContactSuccess(false), 5000);
  };

  if (checkingMaintenance) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
        <p className="font-bold text-sm">Initializing Connection...</p>
      </div>
    );
  }

  if (isMaintenance) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-center p-6">
        <ShieldAlert className="h-16 w-16 text-[#FFD600] mb-4 animate-bounce" />
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">System Maintenance</h1>
        <p className="text-sm mt-2 text-gray-400 max-w-md leading-relaxed font-semibold">
          Flash AutoLike is currently undergoing scheduled server improvements. We will be back online shortly. Thank you for your patience!
        </p>
        <a 
          href="https://t.me/FL4SH_AUTOLIKE_BOT" 
          target="_blank" 
          rel="noreferrer" 
          className="pink-btn px-6 py-2.5 rounded-xl text-xs mt-6 inline-flex items-center gap-2"
        >
          <Send className="h-4 w-4 fill-white" />
          <span>Telegram Channel Updates</span>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col relative overflow-hidden">
      <Header />
      <LiveStatsBar />

      {/* Floating pink background shapes */}
      <div className="absolute top-24 left-10 h-72 w-72 rounded-full bg-[#FF2E93]/5 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-96 right-20 h-96 w-96 rounded-full bg-[#FF2E93]/3 blur-3xl pointer-events-none animate-float-fast" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="lg:col-span-7 space-y-6"
        >
          <motion.span 
            variants={{
              hidden: { y: 15, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20"
          >
            <Sparkles className="h-3.5 w-3.5" /> Free Fire Automatic Likes System
          </motion.span>
          
          {/* GSAP-Style clip path reveal simulation via Framer Motion */}
          <div className="overflow-hidden">
            <motion.h1 
              variants={{
                hidden: { y: "100%", opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase"
            >
              Free Fire <span className="text-[#FF2E93]">Auto Like Bot</span> Portal
            </motion.h1>
          </div>

          <motion.p 
            variants={{
              hidden: { y: 15, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="text-gray-400 font-semibold text-base sm:text-lg max-w-xl leading-relaxed"
          >
            Get daily automatic likes delivered straight to your Free Fire posts. Enter your UID below to view instant account stats and subscribe to high-delivery autolike plans.
          </motion.p>
          
          {/* Interactive Free Fire UID Search Bar */}
          <motion.form 
            variants={{
              hidden: { y: 15, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem("uidSearch") as HTMLInputElement).value;
              if (input && input.trim()) {
                window.location.href = `/player/${encodeURIComponent(input.trim())}`;
              }
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                name="uidSearch"
                placeholder="Enter Free Fire UID (e.g. 123456789)..."
                required
                className="glass-input w-full py-3.5 pl-4 pr-4 rounded-2xl text-xs font-semibold text-white border border-[rgba(255,255,255,0.1)] focus:border-[#FF2E93]"
              />
            </div>
            <button
              type="submit"
              className="pink-btn px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF2E93]/20 text-xs font-bold uppercase tracking-wider shrink-0"
            >
              <span>Search Profile</span>
              <Sparkles className="h-4 w-4 fill-white" />
            </button>
          </motion.form>

          {/* Tickers */}
          <motion.div 
            variants={{
              hidden: { y: 15, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wider text-gray-500 pt-2"
          >
            <div className="flex items-center gap-2 bg-[#16161F] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.04)]">
              <span className="text-white">132</span> Purchases Completed
            </div>
            <div className="flex items-center gap-2 bg-[#16161F] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.04)]">
              Total Delivered: <span className="text-[#FF2E93] font-mono">{cumulativeLikes.toLocaleString()}</span>
            </div>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { y: 15, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              href="/auth/login"
              className="pink-btn px-6 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF2E93]/20 text-sm font-bold uppercase tracking-wide"
              id="hero-pricing-btn"
            >
              <span>Instant UID Login</span>
              <Zap className="h-4 w-4 fill-white" />
            </Link>
            <a
              href="https://t.me/FL4SH_AUTOLIKE_BOT"
              target="_blank"
              rel="noreferrer"
              className="outline-btn px-6 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer text-sm font-bold uppercase tracking-wide"
              id="hero-support-btn"
            >
              <span>Telegram Support</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Live Widgets Col */}
        <div className="lg:col-span-5 space-y-6">
          <LiveStatistics />
          <ActivityFeed />
        </div>
      </section>

      {/* SERVICE SUMMARY / ABOUT */}
      <section className="bg-[#16161F] border-y border-[rgba(255,255,255,0.06)] py-16 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">
              Built For Serious Growth
            </h2>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
              High capacity interaction queues
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 bg-[#0B0B0F] border-[rgba(255,255,255,0.04)] hover:border-[#FF2E93]/20 relative overflow-hidden">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF2E93]/10 text-[#FF2E93] mb-5">
                <Zap className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Instant Delivery</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Our bot queues run 24/7. As soon as you publish a post, our sensors trigger and deliver autolikes within minutes.
              </p>
            </div>

            <div className="glass-card p-6 bg-[#0B0B0F] border-[rgba(255,255,255,0.04)] hover:border-[#FF2E93]/20 relative overflow-hidden">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF2E93]/10 text-[#FF2E93] mb-5">
                <Heart className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Organic Flow</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Likes originate from high quality, active looking profiles. Gradual, natural-looking delivery rate option is available.
              </p>
            </div>

            <div className="glass-card p-6 bg-[#0B0B0F] border-[rgba(255,255,255,0.04)] hover:border-[#FF2E93]/20 relative overflow-hidden">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF2E93]/10 text-[#FF2E93] mb-5">
                <TrendingUp className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Live Progress Tracking</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                View remaining days, activated tiers, purchase histories, and PDF invoice logs in your dashboard at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full" id="how-it-works">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            How It Works
          </h2>
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
            Three simple steps to setup service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Step 1 */}
          <div className="text-center space-y-4">
            <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xl font-black shadow-md border-4 border-[#0B0B0F]">
              1
            </span>
            <h3 className="text-lg font-bold text-white">Select a Plan</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto font-semibold leading-relaxed">
              Choose the basic, premium, or VIP package that matches your targeted engagement volume.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4">
            <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xl font-black shadow-md border-4 border-[#0B0B0F]">
              2
            </span>
            <h3 className="text-lg font-bold text-white">Secure Payment</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto font-semibold leading-relaxed">
              Pay via UPI QR Code scan (enter UTR and screenshot) or automate through Razorpay instant processing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4">
            <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xl font-black shadow-md border-4 border-[#0B0B0F]">
              3
            </span>
            <h3 className="text-lg font-bold text-white">Likes Start Flowing</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto font-semibold leading-relaxed">
              The service activates instantly on approval. Publish your posts and watch interactions delivered instantly!
            </p>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="bg-[#16161F] border-t border-[rgba(255,255,255,0.06)] py-20 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">
              Pricing Subscription Tiers
            </h2>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
              Choose the best fit for your speed
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {plans.map((p) => {
              const stars = p.price - 1;
              return (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { y: 30, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                  whileHover={{ scale: 1.02, borderColor: "#FF2E93" }}
                  transition={{ duration: 0.25 }}
                  className={`glass-card p-8 border flex flex-col relative overflow-hidden transition-all bg-[#0B0B0F] ${
                    p.name.includes("Premium") ? "border-[#FF2E93] ring-1 ring-[#FF2E93]/20 shadow-lg shadow-[#FF2E93]/5" : "border-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  {p.name.includes("Premium") && (
                    <span className="absolute top-5 right-5 bg-[#FF2E93] text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  
                  <h3 className="text-lg font-black text-white uppercase">{p.name}</h3>
                  <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wide">Duration: {p.duration_days} Days</p>

                  <div className="my-6 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">₹{p.price}</span>
                    <span className="text-xs text-gray-500 font-semibold">({stars} Stars)</span>
                  </div>

                  <hr className="border-[rgba(255,255,255,0.06)] my-2" />

                  <ul className="space-y-3 my-6 text-xs text-gray-300 font-semibold flex-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-[#FF2E93] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/checkout?plan=${p.id}`}
                    className={`w-full text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      p.name.includes("Premium") ? "pink-btn" : "outline-btn"
                    }`}
                    id={`purchase-btn-${p.id}`}
                  >
                    Subscribe Now
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Payment Methods Info */}
          <div className="mt-12 glass-card p-6 border-dashed border-[#FF2E93]/20 bg-[#0B0B0F] text-center max-w-3xl mx-auto space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Supported Secure Checkout Systems</h4>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#FF2E93]" /> Razorpay Gateways</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#FF2E93]" /> UPI QR Scanner</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#FF2E93]" /> Credit/Debit Cards</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#FF2E93]" /> Netbanking & Wallets</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF GALLERY (Visual Proof Terminal) */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full" id="proof-gallery">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            Visual Proof Terminal
          </h2>
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
            Check real verified delivery statistics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="glass-card overflow-hidden group border-[rgba(255,255,255,0.06)] hover:border-[#FF2E93]/20 bg-[#16161F] cursor-pointer transition-all shadow-md"
            >
              <div className="relative h-48 w-full bg-[#0B0B0F] overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title || "Proof screenshot"}
                  className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#16161F]/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-bold text-white border border-[rgba(255,255,255,0.06)] flex items-center gap-1">
                  {item.type === "image" ? <ImageIcon className="h-3.5 w-3.5 text-[#FF2E93]" /> : <VideoIcon className="h-3.5 w-3.5 text-[#FF2E93]" />}
                  {item.type.toUpperCase()}
                </span>
              </div>
              <div className="p-4 bg-[#16161F]">
                <p className="text-xs font-bold text-white leading-snug group-hover:text-[#FF2E93] transition-colors">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Modal Overlays */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0B0F]/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="relative glass-card max-w-3xl w-full bg-[#16161F] overflow-hidden border-[rgba(255,255,255,0.08)] flex flex-col">
              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-all z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-2 flex-1 flex items-center justify-center max-h-[70vh] bg-black">
                {selectedMedia.type === "image" ? (
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.title || "Proof fullscreen image"} 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <video 
                    src={selectedMedia.url} 
                    controls 
                    className="max-h-full max-w-full object-contain"
                    autoPlay
                  />
                )}
              </div>
              
              <div className="p-5 border-t border-[rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wide">Verified Platform Proof</span>
                <h4 className="text-sm font-bold text-white mt-1">{selectedMedia.title}</h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* NEWS SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full" id="news">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            Latest Gaming News & Updates
          </h2>
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
            Stay updated with esports, tech and Free Fire announcements
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No published articles found.
            </div>
          ) : (
            latestNews.map((item) => (
              <div key={item.id} className="glass-card overflow-hidden group border border-white/5 hover:border-[#FF2E93]/20 bg-[#16161F] flex flex-col justify-between rounded-xl">
                <div>
                  <div className="relative h-44 w-full bg-[#0B0B0F] overflow-hidden">
                    <img
                      src={item.thumbnail_url || "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=600&q=80"}
                      alt={item.title}
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#FF2E93] px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider">
                      {item.category ? item.category.replace("_", " ") : "Gaming"}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] text-gray-500 font-mono">{new Date(item.published_at).toLocaleDateString()}</span>
                    <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-[#FF2E93] transition-colors uppercase">{item.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-3 font-semibold leading-relaxed">{item.short_description}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link href={`/news/${item.category || "gaming"}/${item.slug}`} className="text-[10px] font-bold text-[#FF2E93] uppercase hover:underline inline-flex items-center gap-1">
                    Read Article →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#16161F] border-t border-[rgba(255,255,255,0.06)] py-20 px-6" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
              Have questions? Find quick answers
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="glass-card border-[rgba(255,255,255,0.04)] bg-[#0B0B0F] overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:bg-white/2 transition-colors cursor-pointer"
                  id={`faq-btn-${idx}`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <HelpCircle className="h-5 w-5 text-[#FF2E93] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-400 font-medium leading-relaxed border-t border-[rgba(255,255,255,0.04)]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT & SUPPORT FORM */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full" id="contact">
        <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden bg-[#16161F] border-[rgba(255,255,255,0.06)]">
          <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[#FF2E93]/5 blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Get In Touch</h2>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Send us a direct message or join support chat.</p>
          </div>

          {contactSuccess && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-green-950/30 p-4 text-xs text-[#00E676] border border-green-900/50">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="font-bold leading-relaxed">Your message has been sent successfully! We will contact you soon.</p>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-6" id="contact-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white"
                  placeholder="John Doe"
                  id="contact-name-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white"
                  placeholder="john@example.com"
                  id="contact-email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Message / Issue Details</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white resize-none"
                placeholder="Describe your inquiry..."
                id="contact-message-input"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                className="pink-btn px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-lg shadow-[#FF2E93]/20 text-xs font-bold uppercase tracking-wider"
                id="contact-submit-btn"
              >
                <span>Send Message</span>
                <Send className="h-4 w-4 text-white" />
              </button>

              <a
                href="https://t.me/FL4SH_AUTOLIKE_BOT"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FF2E93]/10 hover:bg-[#FF2E93]/20 text-[#FF2E93] font-bold text-xs px-6 py-3.5 rounded-2xl border border-[#FF2E93]/20 transition-all w-full sm:w-auto cursor-pointer"
                id="contact-telegram-direct-btn"
              >
                <Send className="h-4 w-4 fill-none stroke-[#FF2E93]" />
                <span>Contact Telegram Support</span>
              </a>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
