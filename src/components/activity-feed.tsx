"use client";

import { useEffect, useState } from "react";
import { UserCheck, ShoppingBag, CheckCircle, Volume2, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: string;
  type: "registration" | "purchase" | "activation" | "verification" | "announcement";
  user: string;
  uid: string;
  detail: string;
  time: string;
}

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 min ago";
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  return date.toLocaleDateString();
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase.rpc("get_public_activities");
      if (error) throw error;
      if (data) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          user: item.user_nickname || "Player",
          uid: item.user_uid || "N/A",
          detail: item.detail,
          time: formatRelativeTime(item.created_at),
        }));
        setActivities(mapped);
      }
    } catch (err) {
      console.error("Error loading public activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Listen to inserts on public tables to reload live feed
    const channel = supabase
      .channel("public-feed-updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profiles" }, () => {
        fetchActivities();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        fetchActivities();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "subscriptions" }, () => {
        fetchActivities();
      })
      .subscribe();

    // Also update relative times periodically every 60 seconds
    const interval = setInterval(fetchActivities, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "registration":
        return <UserCheck className="h-4 w-4 text-sky-400" />;
      case "purchase":
        return <ShoppingBag className="h-4 w-4 text-[#FF2E93]" />;
      case "activation":
        return <CheckCircle className="h-4 w-4 text-[#00E676]" />;
      case "verification":
        return <CheckCircle className="h-4 w-4 text-[#00E676]" />;
      case "announcement":
        return <Volume2 className="h-4 w-4 text-[#FFD600] animate-bounce" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeColor = (type: Activity["type"]) => {
    switch (type) {
      case "registration": return "bg-sky-500/10 text-sky-400";
      case "purchase": return "bg-[#FF2E93]/10 text-[#FF2E93]";
      case "activation": return "bg-[#00E676]/10 text-[#00E676]";
      case "verification": return "bg-[#00E676]/10 text-[#00E676]";
      case "announcement": return "bg-[#FFD600]/10 text-[#FFD600]";
    }
  };

  const getStatusText = (act: Activity) => {
    switch (act.type) {
      case "registration":
        return "Registered Successfully";
      case "activation":
        return "220 Likes Sent Successfully";
      case "purchase":
        return "Purchased Plan Successfully";
      case "verification":
        return "UPI Verified Successfully";
      default:
        return act.detail;
    }
  };

  return (
    <div className="glass-card p-6 w-full bg-[#16161F]">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Live Activity Feed</h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {activities.map((act, index) => (
            <motion.div
              key={act.id}
              initial={index === 0 ? { opacity: 0, y: -20, backgroundColor: "rgba(0, 230, 118, 0.15)" } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0, 0, 0, 0)" }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ 
                opacity: { duration: 0.3 },
                y: { duration: 0.3 },
                backgroundColor: { duration: 1.5, delay: 0.2 } 
              }}
              className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/2 transition-all border border-transparent hover:border-[rgba(255,255,255,0.06)]"
            >
              <div className={`p-2 rounded-xl shrink-0 ${getBadgeColor(act.type)}`}>
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  {/* Clean Logs Stream Format: UID: 1234**90 | Name: Rax* | Status: 220 Likes Sent Successfully */}
                  <p className="text-[11px] font-bold text-gray-300 truncate">
                    UID: <span className="text-white font-mono">{act.uid}</span> | Name: <span className="text-white">{act.user}</span>
                  </p>
                  <span className="text-[9px] text-gray-500 shrink-0 font-medium">{act.time}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-semibold leading-relaxed">
                  Status: <span className={act.type === "activation" || act.type === "verification" ? "text-[#00E676]" : "text-gray-300"}>{getStatusText(act)}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {activities.length === 0 && (
          <p className="text-center py-8 text-xs text-gray-500 font-semibold">No recent activity logs available</p>
        )}
      </div>
    </div>
  );
}
