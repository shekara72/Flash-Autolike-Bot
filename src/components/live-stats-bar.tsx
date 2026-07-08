"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Activity, Flame, Zap, ShieldCheck } from "lucide-react";

export default function LiveStatsBar() {
  const [stats, setStats] = useState({
    registeredMembers: 134,
    activeMembers: 25,
    onlineUsersMin: 13,
    onlineUsersMax: 50,
    todaysDeliveries: 3300,
    totalDeliveries: 145000,
    botStatus: "Online",
  });

  const [currentOnlineUsers, setCurrentOnlineUsers] = useState(24);

  useEffect(() => {
    // 1. Initial Load from Supabase settings
    const loadSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("registered_members, active_members, online_users_min, online_users_max, todays_deliveries, total_deliveries, bot_status")
        .eq("id", 1)
        .single();

      if (data) {
        setStats({
          registeredMembers: data.registered_members ?? 134,
          activeMembers: data.active_members ?? 25,
          onlineUsersMin: data.online_users_min ?? 13,
          onlineUsersMax: data.online_users_max ?? 50,
          todaysDeliveries: data.todays_deliveries ?? 3300,
          totalDeliveries: Number(data.total_deliveries) || 145000,
          botStatus: data.bot_status || "Online",
        });
        
        const initialCount = Math.floor(
          Math.random() * ((data.online_users_max ?? 50) - (data.online_users_min ?? 13) + 1) + (data.online_users_min ?? 13)
        );
        setCurrentOnlineUsers(initialCount);
      }
    };

    loadSettings();

    // 2. Subscribe to Supabase Realtime changes
    const channel = supabase
      .channel("public:settings")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings", filter: "id=eq.1" },
        (payload) => {
          const newData = payload.new;
          setStats((prev) => ({
            ...prev,
            registeredMembers: newData.registered_members ?? prev.registeredMembers,
            activeMembers: newData.active_members ?? prev.activeMembers,
            onlineUsersMin: newData.online_users_min ?? prev.onlineUsersMin,
            onlineUsersMax: newData.online_users_max ?? prev.onlineUsersMax,
            todaysDeliveries: newData.todays_deliveries ?? prev.todaysDeliveries,
            totalDeliveries: Number(newData.total_deliveries) || prev.totalDeliveries,
            botStatus: newData.bot_status || prev.botStatus,
          }));
        }
      )
      .subscribe();

    // 3. Periodic fluctuation interval for online users
    const interval = setInterval(() => {
      setStats((latest) => {
        const min = latest.onlineUsersMin || 13;
        const max = latest.onlineUsersMax || 50;
        const nextCount = Math.floor(Math.random() * (max - min + 1)) + min;
        setCurrentOnlineUsers(nextCount);
        return latest;
      });
    }, 6000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-950/80 text-[#00E676] border-green-900";
      case "maintenance":
        return "bg-yellow-950/80 text-[#FFD600] border-yellow-900";
      case "offline":
        return "bg-red-950/80 text-red-400 border-red-900";
      default:
        return "bg-green-950/80 text-[#00E676] border-green-900";
    }
  };

  return (
    <div className="w-full bg-[#16161F]/80 backdrop-blur border-y border-[rgba(255,255,255,0.06)] py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-300">
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#FF2E93]" />
            <span>Registered Members: <strong className="text-white font-mono">{stats.registeredMembers}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-400" />
            <span>Active Members: <strong className="text-white font-mono">{stats.activeMembers}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span>Online Users: <strong className="text-[#FF2E93] font-mono text-sm">{currentOnlineUsers}</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Flame className="h-4 w-4 text-yellow-400" />
            <span>Today&apos;s Deliveries: <strong className="text-white font-mono">~{stats.todaysDeliveries.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">System Status:</span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${getStatusBadgeColor(stats.botStatus)}`}>
            <ShieldCheck className="h-3 w-3" />
            <span>{stats.botStatus}</span>
          </span>
        </div>

      </div>
    </div>
  );
}
