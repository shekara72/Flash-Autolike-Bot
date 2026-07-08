"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Flame, 
  Share2, 
  Tag, 
  MessageSquare,
  Copy,
  Check,
  TrendingUp,
  Bookmark,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const category = params?.category as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [related, setRelated] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    const loadArticleData = async () => {
      setLoading(true);
      try {
        // 1. Fetch current article
        const { data: art, error } = await supabase
          .from("news")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !art) {
          setArticle(null);
          return;
        }

        setArticle(art);
        setLikesCount(art.likes || 0);

        // 2. Increment views count asynchronously
        await supabase
          .from("news")
          .update({ views: (art.views || 0) + 1 })
          .eq("id", art.id);

        // 3. Fetch related articles in same category
        const { data: relData } = await supabase
          .from("news")
          .select("*")
          .eq("status", "published")
          .eq("category", art.category)
          .neq("id", art.id)
          .limit(3);
        setRelated(relData || []);

        // 4. Fetch trending articles
        const { data: trendData } = await supabase
          .from("news")
          .select("*")
          .eq("status", "published")
          .eq("is_trending", true)
          .neq("id", art.id)
          .limit(5);
        setTrending(trendData || []);

      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArticleData();
  }, [slug]);

  const handleLike = async () => {
    if (liked || !article) return;
    setLiked(true);
    setLikesCount(prev => prev + 1);

    try {
      await supabase
        .from("news")
        .update({ likes: (article.likes || 0) + 1 })
        .eq("id", article.id);
    } catch (e) {
      console.warn("Failed to save like to DB:", e);
    }
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-black uppercase">Article Not Found</h2>
          <Link href="/news" className="pink-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
            Back to News Hub
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Back Link */}
        <Link href="/news" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#FF2E93] hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to News Hub
        </Link>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Article Block */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Meta & Heading */}
            <div className="space-y-3">
              <span className="bg-[#FF2E93]/15 text-[#FF2E93] border border-[#FF2E93]/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider inline-block">
                {article.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 pt-1 border-b border-white/5 pb-4">
                <span>By {article.author_name}</span>
                <span>•</span>
                <span>Published: {new Date(article.published_at).toLocaleDateString()}</span>
                {article.updated_at && article.updated_at !== article.published_at && (
                  <>
                    <span>•</span>
                    <span className="text-pink-400">Updated: {new Date(article.updated_at).toLocaleDateString()}</span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.reading_time} Min Read</span>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-black/40 border border-white/5">
              <img 
                src={article.thumbnail_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Sub-description (lead paragraph) */}
            <p className="text-sm font-bold text-gray-300 border-l-4 border-[#FF2E93] pl-4 italic leading-relaxed py-1">
              {article.short_description}
            </p>

            {/* Full Article Content */}
            <div className="text-gray-300 text-xs sm:text-sm leading-relaxed space-y-4 font-semibold whitespace-pre-wrap pt-2">
              {article.content}
            </div>

            {/* Video Embed (if available) */}
            {article.video_url && (
              <div className="pt-4 space-y-2">
                <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider block">Watch Video Coverage</span>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/5 shadow-xl">
                  <iframe
                    src={article.video_url.includes("youtube.com") || article.video_url.includes("youtu.be")
                      ? `https://www.youtube.com/embed/${article.video_url.split("v=")[1] || article.video_url.split("/").pop()}`
                      : article.video_url
                    }
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title="Video Embed"
                  />
                </div>
              </div>
            )}

            {/* Tags Box */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-white/5">
                <Tag className="h-4 w-4 text-gray-500" />
                {article.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-[#16161F] border border-white/5 text-[10px] font-bold text-gray-400 px-3 py-1 rounded-xl uppercase">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Interaction & Sharing Drawer */}
            <div className="p-4 bg-[#16161F]/80 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    liked 
                      ? "bg-red-950 text-red-400 border border-red-900" 
                      : "bg-[#0B0B0F] border border-white/5 hover:bg-[#FF2E93]/10 hover:text-[#FF2E93] cursor-pointer"
                  }`}
                >
                  <Flame className={`h-4 w-4 ${liked ? "fill-current animate-bounce text-red-500" : ""}`} />
                  <span>{liked ? "Liked Article" : "Like Article"} ({likesCount})</span>
                </button>

                <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                  <Eye className="h-4 w-4" /> {article.views} Views
                </span>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Share2 className="h-3.5 w-3.5" /> Share:
                </span>
                
                {/* Copy Link */}
                <button onClick={handleCopyLink} className="p-2 bg-[#0B0B0F] border border-white/5 rounded-lg hover:text-[#FF2E93] transition-all cursor-pointer">
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>

                {/* Telegram Share */}
                <a 
                  href={`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  className="p-2 bg-[#0B0B0F] border border-white/5 rounded-lg hover:text-sky-400 transition-all"
                >
                  <Share2 className="h-4 w-4 text-sky-400" />
                </a>

                {/* WhatsApp Share */}
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + articleUrl)}`}
                  target="_blank"
                  className="p-2 bg-[#0B0B0F] border border-white/5 rounded-lg hover:text-green-400 transition-all"
                >
                  <MessageSquare className="h-4 w-4 text-green-400" />
                </a>

                {/* Facebook Share */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  className="p-2 bg-[#0B0B0F] border border-white/5 rounded-lg hover:text-blue-500 transition-all"
                >
                  <svg className="h-4 w-4 fill-current text-blue-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Twitter / X Share */}
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  className="p-2 bg-[#0B0B0F] border border-white/5 rounded-lg hover:text-white transition-all"
                >
                  <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Trending Articles Widget */}
            {trending.length > 0 && (
              <div className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <TrendingUp className="h-4 w-4 text-[#FF2E93]" />
                  <span>Trending News</span>
                </h3>
                <div className="space-y-3.5">
                  {trending.map((item) => (
                    <div key={item.id} className="group flex gap-3 text-xs items-center">
                      <div className="h-12 w-12 rounded-lg bg-black/40 overflow-hidden shrink-0">
                        <img src={item.thumbnail_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80"} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <Link href={`/news/${item.category}/${item.slug}`} className="font-bold text-gray-200 hover:text-[#FF2E93] uppercase tracking-tight block truncate group-hover:underline">
                          {item.title}
                        </Link>
                        <span className="text-[9px] text-gray-500 font-bold block">{new Date(item.published_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advertisements Placeholders */}
            <div className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl text-center space-y-3">
              <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-widest block">Sponsored Advertisement</span>
              <div className="h-48 w-full bg-[#0B0B0F] border border-white/5 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase">
                Ad Banner Place
              </div>
            </div>

          </div>

        </div>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-white/5 mt-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="h-4 w-4 text-[#FF2E93]" />
                <span>Related News Articles</span>
              </h3>
              <Link href="/news" className="text-xs text-[#FF2E93] hover:underline font-bold uppercase tracking-wider">
                View All News
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <div key={item.id} className="glass-card bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden flex flex-col justify-between p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="h-32 w-full rounded-lg overflow-hidden bg-black/40">
                      <img src={item.thumbnail_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 block">{new Date(item.published_at).toLocaleDateString()}</span>
                    <Link href={`/news/${item.category}/${item.slug}`} className="text-xs font-black text-white hover:text-[#FF2E93] uppercase block line-clamp-2">
                      {item.title}
                    </Link>
                  </div>
                  <Link href={`/news/${item.category}/${item.slug}`} className="text-[10px] font-bold text-[#FF2E93] hover:underline inline-flex items-center gap-0.5">
                    Read Article <ArrowLeft className="h-3 w-3 rotate-180" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
