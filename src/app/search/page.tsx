"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { Search, Sparkles, User, FileText, Gift, Link2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawQuery = searchParams?.get("q") || "";
  const query = rawQuery.trim();

  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("user");

  // Search results states
  const [players, setPlayers] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const checkRoleAndQuery = async () => {
      // Get session & role
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
        }
      }

      if (!query) {
        setLoading(false);
        return;
      }

      // 1. Direct Redirection Rules (UID / Numeric)
      if (/^\d{5,15}$/.test(query)) {
        // If it's a numeric UID, redirect immediately to player inspection page!
        router.push(`/player/${query}`);
        return;
      }

      setLoading(true);
      try {
        // Perform DB searches
        // A. Search profiles
        const { data: profileResults } = await supabase
          .from("profiles")
          .select("*")
          .or(`uid.ilike.%${query}%,nickname.ilike.%${query}%`)
          .limit(10);
        setPlayers(profileResults || []);

        // B. Search news
        const { data: newsResults } = await supabase
          .from("news")
          .select("*")
          .or(`title.ilike.%${query}%,category.ilike.%${query}%,summary.ilike.%${query}%`)
          .limit(10);
        setNews(newsResults || []);

        // C. Search plans
        const { data: planResults } = await supabase
          .from("plans")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(10);
        setPlans(planResults || []);

        // D. Search short links (admins only)
        if (session) {
          const { data: linkResults } = await supabase
            .from("short_links")
            .select("*")
            .or(`code.ilike.%${query}%,original_url.ilike.%${query}%,title.ilike.%${query}%`)
            .limit(10);
          setLinks(linkResults || []);
        }

        // E. Search orders/payments (admins/moderators can search everything, users can search their own)
        let orderQuery = supabase.from("orders").select("*");
        if (session) {
          if (userRole === "admin" || userRole === "super_admin") {
            orderQuery = orderQuery.or(`razorpay_order_id.ilike.%${query}%,razorpay_payment_id.ilike.%${query}%,utr_number.ilike.%${query}%`);
          } else {
            orderQuery = orderQuery.eq("user_id", session.user.id).or(`razorpay_order_id.ilike.%${query}%,razorpay_payment_id.ilike.%${query}%,utr_number.ilike.%${query}%`);
          }
          const { data: orderResults } = await orderQuery.limit(10);
          setOrders(orderResults || []);
        }

      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkRoleAndQuery();
  }, [query, router, userRole]);

  const hasResults = players.length > 0 || news.length > 0 || plans.length > 0 || links.length > 0 || orders.length > 0;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1 space-y-8">
        {/* Title Section */}
        <div>
          <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Unified Search Portal
          </span>
          <h1 className="text-3xl font-black uppercase mt-1 tracking-tight">Global Search Results</h1>
          <p className="text-gray-400 text-xs mt-1">
            Showing search matches for query: <span className="text-white font-mono font-bold">&ldquo;{query || "empty"}&rdquo;</span>
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 rounded-full border-2 border-t-2 border-t-[#FF2E93] border-white/5 animate-spin" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Searching database datasets...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {!hasResults ? (
              <div className="glass-card p-12 text-center bg-[#16161F]/80 border border-white/5 rounded-2xl max-w-lg mx-auto">
                <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">No Results Found</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  We couldn&apos;t find any direct matches in our profiles, news, subscriptions, or payments. Try checking your keywords or entering a numeric Free Fire UID to redirect directly.
                </p>
                <div className="mt-6 flex justify-center">
                  <Link href="/" className="pink-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase">
                    Return Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Columns: Results Lists */}
                <div className="md:col-span-2 space-y-6">
                  {/* Players / Profiles */}
                  {players.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 bg-[#16161F]/90 border border-white/5 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <User className="h-4 w-4 text-[#FF2E93]" /> Players & Accounts ({players.length})
                      </h2>
                      <div className="grid gap-3">
                        {players.map((p) => (
                          <div key={p.id} className="p-3 bg-[#0B0B0F]/80 border border-white/5 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-white">{p.nickname || "No Nickname"}</p>
                              <p className="text-xs text-gray-500 font-mono mt-0.5">UID: {p.uid}</p>
                            </div>
                            <Link href={`/player/${p.uid}`} className="flex items-center gap-1 text-[10px] font-bold text-[#FF2E93] uppercase hover:underline">
                              Inspect <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* News Articles */}
                  {news.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 bg-[#16161F]/90 border border-white/5 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <FileText className="h-4 w-4 text-[#FF2E93]" /> News & Articles ({news.length})
                      </h2>
                      <div className="grid gap-3">
                        {news.map((item) => (
                          <div key={item.id} className="p-3 bg-[#0B0B0F]/80 border border-white/5 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[9px] bg-[#FF2E93]/10 text-[#FF2E93] border border-[#FF2E93]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                {item.category}
                              </span>
                              <p className="text-sm font-bold text-white mt-1.5">{item.title}</p>
                            </div>
                            <Link href={`/news/${item.category}/${item.slug}`} className="flex items-center gap-1 text-[10px] font-bold text-[#FF2E93] uppercase hover:underline">
                              Read <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Orders & Payments (if any match) */}
                  {orders.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 bg-[#16161F]/90 border border-white/5 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Gift className="h-4 w-4 text-emerald-400" /> Matching Payments / Orders ({orders.length})
                      </h2>
                      <div className="grid gap-3">
                        {orders.map((o) => (
                          <div key={o.id} className="p-3 bg-[#0B0B0F]/80 border border-white/5 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-400 font-mono">UTR: {o.utr_number || "N/A"}</p>
                              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Order ID: {o.razorpay_order_id || o.id}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              o.status === "approved" || o.status === "success" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-yellow-950 text-yellow-400 border border-yellow-900"
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right Column: Plans & Short Links */}
                <div className="space-y-6">
                  {/* Plans & Subscriptions */}
                  {plans.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 bg-[#16161F]/90 border border-white/5 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Gift className="h-4 w-4 text-[#FF2E93]" /> Plans ({plans.length})
                      </h2>
                      <div className="grid gap-3">
                        {plans.map((p) => (
                          <div key={p.id} className="p-3 bg-[#0B0B0F]/80 border border-white/5 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">{p.name}</p>
                              <p className="text-xs text-[#FF2E93] font-bold mt-0.5">₹{p.price} / {p.duration_days} Days</p>
                            </div>
                            <Link href="/pricing" className="flex items-center gap-1 text-[10px] font-bold text-[#FF2E93] uppercase hover:underline">
                              Subscribe <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Short Links (Admins only) */}
                  {links.length > 0 && (userRole === "admin" || userRole === "super_admin") && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 bg-[#16161F]/90 border border-white/5 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Link2 className="h-4 w-4 text-purple-400" /> Short Links ({links.length})
                      </h2>
                      <div className="grid gap-3">
                        {links.map((link) => (
                          <div key={link.id} className="p-3 bg-[#0B0B0F]/80 border border-white/5 rounded-xl flex flex-col space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold font-mono text-purple-400">/{link.code}</span>
                              <span className="text-[9px] text-gray-500">{link.clicks} Clicks</span>
                            </div>
                            <p className="text-[10px] text-gray-500 truncate">{link.original_url}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function GlobalSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-center items-center">
        <div className="h-10 w-10 rounded-full border-2 border-t-2 border-t-[#FF2E93] border-white/5 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
