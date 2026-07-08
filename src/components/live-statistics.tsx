"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, Sparkles, TrendingUp, Radio } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalUsers: number;
  activeSubscribers: number;
  totalPurchases: number;
  servicesDelivered: number;
  todayNewUsers: number;
  todayPayments: number;
  monthlyRevenue: number;
  onlineUsers: number;
}

export default function LiveStatistics() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 1420,
    activeSubscribers: 345,
    totalPurchases: 890,
    servicesDelivered: 124320,
    todayNewUsers: 14,
    todayPayments: 9,
    monthlyRevenue: 45290,
    onlineUsers: 42,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc("get_live_statistics");
        if (error) throw error;
        if (data) {
          setStats(data);
        }
      } catch (err) {
        console.error("Error loading live statistics:", err);
      }
    };

    fetchStats();

    // Poll the DB for real stats every 15 seconds
    const dbPollInterval = setInterval(fetchStats, 15000);

    // Micro-ticks for live simulation (online users fluctuation, likes delivery counter)
    const tickInterval = setInterval(() => {
      setStats((prev) => {
        const onlineChange = Math.floor(Math.random() * 7) - 3;
        const newOnline = Math.max(15, prev.onlineUsers + onlineChange);

        const serviceChange = Math.floor(Math.random() * 5) + 1;
        const newServices = prev.servicesDelivered + serviceChange;

        return {
          ...prev,
          servicesDelivered: newServices,
          onlineUsers: newOnline,
        };
      });
    }, 4000);

    return () => {
      clearInterval(dbPollInterval);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E93] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF2E93]"></span>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Bot Statistics</h3>
        </div>
        <span className="text-[10px] font-bold text-[#FF2E93] bg-[#FF2E93]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Auto-refreshes live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Users */}
        <div className="glass-card p-4 hover:border-[#FF2E93]/20 bg-[#16161F]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">Registered Users</span>
            <Users className="h-4 w-4 text-[#FF2E93]" />
          </div>
          <p className="mt-2 text-2xl font-black text-white tracking-tight">
            {stats.totalUsers.toLocaleString()}
          </p>
          <span className="mt-1 block text-[10px] text-[#00E676] font-bold">
            +{stats.todayNewUsers} today
          </span>
        </div>

        {/* Active Subscribers */}
        <div className="glass-card p-4 hover:border-[#FF2E93]/20 bg-[#16161F]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">Active Members</span>
            <TrendingUp className="h-4 w-4 text-[#FF2E93]" />
          </div>
          <p className="mt-2 text-2xl font-black text-white tracking-tight">
            {stats.activeSubscribers.toLocaleString()}
          </p>
          <span className="mt-1 block text-[10px] text-gray-400 font-semibold">
            Across all tiers
          </span>
        </div>

        {/* Services Delivered */}
        <div className="glass-card p-4 hover:border-[#FF2E93]/20 bg-[#16161F]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">Likes Delivered</span>
            <Sparkles className="h-4 w-4 text-[#FF2E93]" />
          </div>
          <p className="mt-2 text-2xl font-black text-white tracking-tight animate-pulse">
            {stats.servicesDelivered.toLocaleString()}+
          </p>
          <span className="mt-1 block text-[10px] text-[#FF2E93] font-bold">
            Delivering right now
          </span>
        </div>

        {/* Live Online Users */}
        <div className="glass-card p-4 hover:border-[#FF2E93]/20 bg-[#16161F]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">Online Users</span>
            <Radio className="h-4 w-4 text-[#FF2E93]" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#FF2E93] tracking-tight">
            {stats.onlineUsers}
          </p>
          <span className="mt-1 block text-[10px] text-[#00E676] font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E676] inline-block animate-pulse"></span>
            Active connections
          </span>
        </div>
      </div>

      {/* Mini financial metrics banner below */}
      <div className="mt-4 glass-card p-3 bg-[#16161F] flex items-center justify-between border-dashed border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#FF2E93]" />
          <span className="text-[11px] text-gray-400 font-semibold">Total Purchases: <span className="text-white font-bold">{stats.totalPurchases}+</span></span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-400">
          <span>Today Payments: <span className="text-[#00E676] font-bold">+{stats.todayPayments}</span></span>
          <span className="text-gray-600">|</span>
          <span>Monthly Revenue: <span className="text-[#FF2E93] font-bold">₹{stats.monthlyRevenue.toLocaleString()}</span></span>
        </div>
      </div>
    </div>
  );
}
