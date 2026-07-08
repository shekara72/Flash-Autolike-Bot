"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, Video as VideoIcon, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: string;
  url: string;
  type: "image" | "video";
  title: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await supabase
          .from("gallery")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true });
        if (data) {
          setGallery(data);
        }
      } catch (err) {
        console.warn("Error fetching gallery items from database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93]/10 text-[#FF2E93] text-xs font-bold border border-[#FF2E93]/20 uppercase">
            Proof Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            High-Density Proof Gallery
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Visual proof of active delivery clusters and account spikes
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF2E93] border-t-transparent"></div>
          </div>
        ) : gallery.length === 0 ? (
          <div className="glass-card p-12 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl text-center space-y-3 max-w-md mx-auto">
            <ImageIcon className="h-12 w-12 mx-auto text-[#FF2E93]/60" />
            <h3 className="text-base font-bold text-white uppercase tracking-tight">No Proof Media Uploaded Yet</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Proof showcase images and delivery demo videos will appear here once published by administrators.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                whileHover={{ scale: 1.02 }}
                className="glass-card overflow-hidden group border-[rgba(255,255,255,0.06)] hover:border-[#FF2E93]/20 bg-[#16161F] cursor-pointer transition-all shadow-md"
              >
                <div className="relative h-48 w-full bg-[#0B0B0F] overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title || "Proof media"}
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#16161F]/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-bold text-white border border-[rgba(255,255,255,0.06)] flex items-center gap-1 uppercase">
                    {item.type === "image" ? <ImageIcon className="h-3.5 w-3.5 text-[#FF2E93]" /> : <VideoIcon className="h-3.5 w-3.5 text-[#FF2E93]" />}
                    {item.type}
                  </span>
                </div>
                <div className="p-4 bg-[#16161F]">
                  <p className="text-xs font-bold text-white leading-snug group-hover:text-[#FF2E93] transition-colors">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal fullscreen portal with blurred backdrop */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0B0B0F]/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative glass-card max-w-3xl w-full bg-[#16161F] overflow-hidden border-[rgba(255,255,255,0.08)] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
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
                      alt={selectedMedia.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <video
                      src={selectedMedia.url}
                      controls
                      autoPlay
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                <div className="p-5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wide">Verified Proof Node</span>
                    <h4 className="text-sm font-bold text-white mt-1">{selectedMedia.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Live
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
