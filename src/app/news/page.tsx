"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Flame, 
  TrendingUp, 
  Clock, 
  Eye, 
  Share2, 
  Tag,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Cpu,
  Bookmark
} from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "All News", icon: Bookmark },
  { id: "latest", label: "Latest News", icon: Flame },
  { id: "gaming", label: "Gaming News", icon: Gamepad2 },
  { id: "technology", label: "Tech News", icon: Cpu },
  { id: "ai", label: "AI News", icon: Sparkles },
  { id: "weather", label: "Weather", icon: Sparkles },
  { id: "share_market", label: "Share Market", icon: TrendingUp },
  { id: "crypto", label: "Crypto", icon: Flame },
  { id: "sports", label: "Sports", icon: Gamepad2 },
  { id: "entertainment", label: "Entertainment", icon: Gamepad2 },
  { id: "announcement", label: "Announcements", icon: Flame },
];

import { useParams } from "next/navigation";

export default function NewsIndexPage() {
  const params = useParams();
  const catParam = params?.category as string;
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(catParam || "all");

  useEffect(() => {
    if (catParam) {
      setSelectedCat(catParam);
    }
  }, [catParam]);

  const loadNews = async () => {
    setLoading(true);
    try {
      let q = supabase
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("is_pinned", { ascending: false })
        .order("published_at", { ascending: false });

      if (selectedCat !== "all") {
        q = q.eq("category", selectedCat);
      }
      if (search.trim()) {
        q = q.or(`title.ilike.%${search}%,content.ilike.%${search}%,short_description.ilike.%${search}%`);
      }

      const { data } = await q;
      setNews(data || []);
    } catch (err) {
      console.error("Failed to load news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCat]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadNews();
  };

  const breakingNews = news.filter((n) => n.is_breaking);
  const featuredNews = news.find((n) => n.is_featured);
  const regularNews = news.filter((n) => n.id !== featuredNews?.id);

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* News Hero Header */}
        <div className="text-center py-6 space-y-2">
          <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> FLASH AUTOLIKE PRESS NEWSROOM
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight sm:text-4xl">
            Gaming & Tech Hub
          </h1>
          <p className="text-xs text-gray-400 max-w-md mx-auto font-medium leading-relaxed">
            Stay updated with the latest gaming events, Free Fire updates, crypto, stock market, tech breakthroughs, and announcements.
          </p>
        </div>

        {/* Breaking News Ticker banner */}
        {breakingNews.length > 0 && (
          <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-3 flex items-center gap-3 text-xs">
            <span className="bg-red-600 text-white font-bold uppercase px-2 py-0.5 rounded text-[10px] tracking-wider animate-pulse shrink-0">
              Breaking
            </span>
            <div className="overflow-hidden relative flex-1 h-4">
              <div className="absolute inset-0 flex items-center animate-scroll whitespace-nowrap gap-8 font-bold text-red-300">
                {breakingNews.map((n) => (
                  <Link key={n.id} href={`/news/${n.category}/${n.slug}`} className="hover:underline flex items-center gap-1">
                    • {n.title} <ArrowRight className="h-3.5 w-3.5 inline" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
          {/* Categories Grid */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isActive 
                      ? "bg-[#FF2E93] text-white border-transparent shadow-lg shadow-[#FF2E93]/20" 
                      : "bg-[#16161F] text-gray-400 border-[rgba(255,255,255,0.06)] hover:bg-[#1e1e2c] hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80 shrink-0">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="glass-input w-full py-2.5 pl-9 pr-4 text-xs font-semibold rounded-xl text-white"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <button type="submit" className="pink-btn px-4 rounded-xl text-xs font-bold uppercase tracking-wider">
              Find
            </button>
          </form>
        </div>

        {/* Pinned / Featured Article (Only on "All" category view) */}
        {!loading && selectedCat === "all" && featuredNews && !search && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
          >
            <div className="h-64 md:h-full relative w-full rounded-xl overflow-hidden bg-black/40">
              <img 
                src={featuredNews.thumbnail_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"} 
                alt={featuredNews.title} 
                className="w-full h-full object-cover" 
              />
              <span className="absolute top-4 left-4 bg-[#FF2E93] text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                Featured
              </span>
            </div>

            <div className="flex flex-col justify-between space-y-4 py-2">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-[#FF2E93] uppercase tracking-widest block">
                  {featuredNews.category} • {featuredNews.reading_time} Min Read
                </span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                  {featuredNews.title}
                </h2>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  {featuredNews.short_description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(featuredNews.published_at).toLocaleDateString()}</span>
                </div>
                <Link 
                  href={`/news/${featuredNews.category}/${featuredNews.slug}`}
                  className="pink-btn px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="glass-card bg-[#16161F] h-80 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && (
          <div className="glass-card p-12 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl text-center space-y-2 max-w-md mx-auto">
            <Flame className="h-10 w-10 mx-auto text-gray-600 animate-pulse" />
            <h3 className="text-sm font-bold uppercase">No articles found</h3>
            <p className="text-xs text-gray-400">Try searching another phrase or selecting a different category filter.</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FF2E93]/30 hover:shadow-lg hover:shadow-[#FF2E93]/5 transition-all"
              >
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <div className="h-48 w-full bg-black/40 relative overflow-hidden">
                    <img 
                      src={item.thumbnail_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-[#0B0B0F]/90 backdrop-blur px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#FF2E93] border border-[#FF2E93]/20 uppercase">
                        {item.category}
                      </span>
                      {item.is_pinned && (
                        <span className="bg-yellow-500 text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 space-y-2">
                    <span className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(item.published_at).toLocaleDateString()} • {item.reading_time} Min Read
                    </span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight line-clamp-2 hover:text-[#FF2E93] transition-all">
                      <Link href={`/news/${item.category}/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-3 font-semibold leading-relaxed">
                      {item.short_description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-5 pb-5 pt-4 flex items-center justify-between border-t border-white/5 mt-4 text-[10px] font-bold text-gray-500">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-gray-500" /> {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-gray-500" /> {item.likes}
                    </span>
                  </div>

                  <Link 
                    href={`/news/${item.category}/${item.slug}`}
                    className="text-[#FF2E93] hover:underline flex items-center gap-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
