"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SubscriptionCard from "@/components/subscription-card";
import { supabase } from "@/lib/supabase";
import { downloadInvoicePDF } from "@/utils/invoice-pdf";
import { fetchPlayerAccountDetails, getMockDeliveryProgress, FreeFireAccountData, DeliveryProgressData } from "@/lib/api-service";
import AccountInfoModule from "@/components/account-info-module";
import { getCurrentUserUid, getProfileByUid, logoutUid } from "@/lib/uid-auth";
import {
  User,
  History,
  FileText,
  CreditCard,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  HelpCircle,
  PlusCircle,
  Send,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Bell,
  Layers,
  ShoppingBag,
  Compass,
  Users,
  Flame,
  Download,
  LogOut,
} from "lucide-react";

interface Profile {
  id: string;
  uid: string;
  nickname: string;
  avatar_url: string;
  role: string;
  is_banned: boolean;
  hide_profile: boolean;
  region: string;
}

interface Order {
  id: string;
  created_at: string;
  verified_at?: string;
  amount: number;
  payment_method: "razorpay" | "upi";
  status: string;
  utr_number?: string;
  screenshot_url?: string;
  plan_id: string;
  plans: {
    name: string;
    duration_days: number;
  };
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
}

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "replied" | "closed";
  created_at: string;
}

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Auth state
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Active User Dashboard Tab
  const [activeDashTab, setActiveDashTab] = useState<
    "overview" | "profile" | "account_info" | "delivery" | "payments" | "notifications" | "settings"
  >("overview");

  // Data states
  const [subscription, setSubscription] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [accountData, setAccountData] = useState<FreeFireAccountData | null>(null);
  const [deliveryProgress, setDeliveryProgress] = useState<DeliveryProgressData | null>(null);

  // Form states
  const [nickname, setNickname] = useState("");
  const [hideProfile, setHideProfile] = useState(false);
  const [gstNum, setGstNum] = useState("");

  // Payment states
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [paySuccessMsg, setPaySuccessMsg] = useState("");
  const [payErrorMsg, setPayErrorMsg] = useState("");
  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    const checkAuth = async () => {
      let activeUid = getCurrentUserUid();

      if (!activeUid) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: pr } = await supabase.from("profiles").select("uid").eq("id", session.user.id).single();
            if (pr?.uid) activeUid = pr.uid;
          }
        } catch (e) {}
      }

      if (!activeUid) {
        if (isMounted) setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        await Promise.all([
          loadProfile(activeUid),
          loadAllData(activeUid)
        ]);
      } catch (err) {
        console.warn("Dashboard data load notice:", err);
      } finally {
        clearTimeout(safetyTimer);
        if (isMounted) setLoading(false);
      }

      const planParam = searchParams.get("plan");
      if (planParam) {
        setSelectedPlanId(planParam);
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [router, searchParams]);

  const loadProfile = async (uidToLoad: string) => {
    const prof = await getProfileByUid(uidToLoad);
    const ffData = await fetchPlayerAccountDetails(uidToLoad);
    setAccountData(ffData);

    const apiNickname = ffData?.basicInfo?.nickname;
    const resolvedNickname = apiNickname || prof?.nickname || `UID: ${uidToLoad}`;
    const avatarSeed = ffData?.basicInfo?.headPicName || ffData?.profileInfo?.avatarName || apiNickname || uidToLoad;
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`;

    if (prof) {
      setProfile({
        id: prof.id || prof.uid,
        uid: prof.uid,
        nickname: resolvedNickname,
        avatar_url: avatarUrl,
        role: prof.role,
        is_banned: prof.is_banned,
        hide_profile: false,
        region: ffData?.basicInfo?.region || prof.region || "IND",
      });
      setNickname(resolvedNickname);

      // Sync nickname from API to database if changed
      if (apiNickname && apiNickname !== prof.nickname) {
        try {
          await supabase.from("profiles").update({ nickname: apiNickname }).eq("id", prof.id);
        } catch (e) {
          console.warn("Notice: profile nickname sync skipped:", e);
        }
      }
    } else {
      setProfile({
        id: uidToLoad,
        uid: uidToLoad,
        nickname: resolvedNickname,
        avatar_url: avatarUrl,
        role: "user",
        is_banned: false,
        hide_profile: false,
        region: ffData?.basicInfo?.region || "IND",
      });
      setNickname(resolvedNickname);
    }
  };

  const loadAllData = async (userId: string) => {
    try {
      const { data: activePlans } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true);
      if (activePlans) {
        const formattedPlans = activePlans.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          duration_days: p.duration_days,
          features: p.features || [],
        })).sort((a, b) => a.price - b.price);
        setPlans(formattedPlans);
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*, plans(name, duration_days, daily_delivery)")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (sub && sub.length > 0) {
        setSubscription(sub[0]);
        const dur = sub[0].plans?.duration_days || 30;
        setDeliveryProgress(getMockDeliveryProgress(dur));
      } else {
        setSubscription(null);
        setDeliveryProgress(null);
      }

      const { data: ords } = await supabase
        .from("orders")
        .select("*, plans(name, duration_days)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (ords) setOrders(ords);

      const { data: notifs } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order("created_at", { ascending: false });
      if (notifs) setNotifications(notifs);
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          nickname,
          hide_profile: hideProfile,
        })
        .eq("id", profile.id);
      
      if (error) throw error;
      alert("Profile settings updated!");
      await loadProfile(profile.id);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleInvoiceDownload = (order: Order) => {
    if (!profile) return;
    downloadInvoicePDF(order, order.plans, profile, gstNum || undefined);
  };

  const handleLogout = async () => {
    logoutUid();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500 space-y-4 px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent"></div>
        <p className="font-bold text-sm text-white">Loading your dashboard...</p>
        <button
          onClick={() => setLoading(false)}
          className="pink-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider mt-2"
        >
          Skip to Dashboard
        </button>
      </div>
    );
  }

  // Calculate Subscription Days Progress
  let currentDay = 12;
  let totalDays = 30;
  if (subscription) {
    totalDays = subscription.plans?.duration_days || 30;
    const act = new Date(subscription.activated_at).getTime();
    const now = new Date().getTime();
    const diffDays = Math.max(1, Math.ceil((now - act) / (1000 * 60 * 60 * 24)));
    currentDay = Math.min(diffDays, totalDays);
  }
  const subProgressPct = Math.round((currentDay / totalDays) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Welcome Header Card */}
        <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={profile?.avatar_url || "https://ui-avatars.com/api/?name=FF&background=FF2E93&color=fff"} alt="Avatar" className="h-14 w-14 rounded-2xl border-2 border-[#FF2E93] bg-[#0B0B0F] p-0.5 object-cover" />
            <div>
              <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-widest">FLASH AUTOLIKE Dashboard</span>
              <h1 className="text-xl font-black text-white tracking-tight">
                Welcome back, <span className="text-[#FF2E93]">{accountData?.basicInfo?.nickname || profile?.nickname || (profile?.uid ? `UID: ${profile.uid}` : "Free Fire Player")}</span>!
              </h1>
              <p className="text-xs font-mono text-gray-400">Free Fire UID: {accountData?.basicInfo?.accountId || profile?.uid}</p>
            </div>
          </div>

          <Link href={`/player/${profile?.uid}`} className="pink-btn px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> View Full Account Info Page
          </Link>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[rgba(255,255,255,0.06)] pb-4">
          {[
            { id: "overview", label: "Dashboard Overview", icon: Zap },
            { id: "profile", label: "Profile", icon: User },
            { id: "account_info", label: "Account Information (API)", icon: Layers },
            { id: "delivery", label: "Delivery Progress", icon: TrendingUp },
            { id: "payments", label: "Payment History", icon: History },
            { id: "notifications", label: `Notifications (${notifications.length})`, icon: Bell },
            { id: "settings", label: "Settings", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDashTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  activeDashTab === tab.id
                    ? "bg-[#FF2E93] text-white shadow-md shadow-[#FF2E93]/20"
                    : "bg-[#16161F] text-gray-400 hover:text-white hover:bg-white/5 border border-[rgba(255,255,255,0.04)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeDashTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Live Profile Card */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4 text-[#FF2E93]" />
                  <span>Free Fire In-Game Profile</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-green-950 text-[#00E676] border border-green-800">
                  Live API Synced
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs font-semibold">
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5 col-span-2">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Nickname</span>
                  <span className="text-white font-black text-sm truncate block">{accountData?.basicInfo?.nickname || profile?.nickname || "Nickname unavailable"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5 col-span-2">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Free Fire UID</span>
                  <span className="text-[#FF2E93] font-mono font-bold text-sm block">{accountData?.basicInfo?.accountId || profile?.uid}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Region</span>
                  <span className="text-white font-bold">{accountData?.basicInfo?.region || profile?.region || "IND"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Level</span>
                  <span className="text-white font-bold">{accountData?.basicInfo?.level || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5 col-span-2">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">BR Rank</span>
                  <span className="text-[#FF2E93] font-bold truncate block">{accountData?.basicInfo?.rankingName || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5 col-span-2">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">CS Rank</span>
                  <span className="text-amber-400 font-bold truncate block">{accountData?.basicInfo?.csRankingName || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Likes</span>
                  <span className="text-green-400 font-bold">{accountData?.basicInfo?.liked !== undefined ? Number(accountData.basicInfo.liked).toLocaleString() : "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5 col-span-2">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Title</span>
                  <span className="text-purple-400 font-bold truncate block">{accountData?.basicInfo?.titleName || "None"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5 col-span-3">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Clan / Guild</span>
                  <span className="text-cyan-400 font-bold truncate block">{accountData?.clanBasicInfo?.clanName || "No Guild"}</span>
                </div>
              </div>
            </div>
            
            {/* Current Subscription Status & Progress Bar (Day 12 / 30) */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Current Active Subscription</span>
                  <h2 className="text-lg font-black text-white uppercase">{subscription ? subscription.plans?.name : "No Active Plan"}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${subscription ? "bg-[#FF2E93]/20 text-[#FF2E93]" : "bg-gray-800 text-gray-400"}`}>
                  {subscription ? "Status: ACTIVE" : "Status: INACTIVE"}
                </span>
              </div>

              {subscription ? (
                <div className="space-y-4">
                  {/* Progress Bar (Day X / Y) */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Subscription Duration Progress</span>
                      <span className="text-[#FF2E93]">Day {currentDay} / {totalDays}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5">
                      <div className="bg-[#FF2E93] h-2 rounded-full transition-all duration-500" style={{ width: `${subProgressPct}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-300">
                    <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Activation Date</span>
                      <span className="text-white font-mono">{new Date(subscription.activated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Expiry Date</span>
                      <span className="text-white font-mono">{new Date(subscription.expires_at).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Remaining Days</span>
                      <span className="text-[#FF2E93] font-bold">{Math.max(0, totalDays - currentDay)} Days</span>
                    </div>
                    <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Daily Likes Load</span>
                      <span className="text-green-400 font-bold">~220 Likes / Day</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-[#0B0B0F] rounded-xl text-center space-y-3">
                  <p className="text-xs text-gray-400 font-semibold">You currently have no active autolike subscription.</p>
                  <Link href="/#pricing" className="pink-btn inline-block px-6 py-2.5 rounded-xl text-xs font-bold uppercase">
                    Choose a Subscription Plan
                  </Link>
                </div>
              )}
            </div>

            {/* Delivery Progress Widget */}
            {deliveryProgress && (
              <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                  <TrendingUp className="h-4 w-4 text-[#FF2E93]" />
                  <span>Delivery Progress & Delivery Status</span>
                </h3>

                {/* Delivery Progress Bar with Percentage */}
                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-[rgba(255,255,255,0.04)] space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">Total Estimated vs Delivered Progress</span>
                    <span className="text-green-400">{deliveryProgress.progressPercentage}% Completed</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${deliveryProgress.progressPercentage}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-300">
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Today&apos;s Status</span>
                    <span className="text-green-400 font-bold text-sm">{deliveryProgress.todayStatus}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Total Estimated Delivery</span>
                    <span className="text-white font-black text-sm">{deliveryProgress.totalEstimatedDelivery.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Total Delivered</span>
                    <span className="text-[#FF2E93] font-black text-sm">{deliveryProgress.totalDelivered.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Remaining Delivery</span>
                    <span className="text-white font-black text-sm">{deliveryProgress.remainingEstimatedDelivery.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 2. PROFILE TAB */}
        {activeDashTab === "profile" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-[#FF2E93]" />
                <span>Player Profile Details</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-green-950 text-[#00E676] border border-green-800">
                Live Synced
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={profile?.avatar_url || "https://ui-avatars.com/api/?name=FF&background=FF2E93&color=fff"}
                alt="Avatar"
                className="h-24 w-24 rounded-2xl border-2 border-[#FF2E93] bg-[#0B0B0F] p-0.5 object-cover shadow-lg shadow-[#FF2E93]/10"
              />
              <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                <div>
                  <h4 className="text-2xl font-black text-white">{accountData?.basicInfo?.nickname || profile?.nickname || "Nickname unavailable"}</h4>
                  <p className="text-xs font-mono text-[#FF2E93] font-bold mt-0.5">Free Fire UID: {accountData?.basicInfo?.accountId || profile?.uid}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Region</span>
                    <span className="text-white font-bold">{accountData?.basicInfo?.region || profile?.region || "IND"}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Level</span>
                    <span className="text-white font-bold">{accountData?.basicInfo?.level || "N/A"}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">BR Rank</span>
                    <span className="text-[#FF2E93] font-bold truncate block">{accountData?.basicInfo?.rankingName || "N/A"}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">CS Rank</span>
                    <span className="text-amber-400 font-bold truncate block">{accountData?.basicInfo?.csRankingName || "N/A"}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Total Likes</span>
                    <span className="text-green-400 font-bold">{accountData?.basicInfo?.liked !== undefined ? Number(accountData.basicInfo.liked).toLocaleString() : "N/A"}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Title</span>
                    <span className="text-purple-400 font-bold truncate block">{accountData?.basicInfo?.titleName || "None"}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Guild / Clan</span>
                    <span className="text-cyan-400 font-bold truncate block">{accountData?.clanBasicInfo?.clanName || "No Guild"}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Avatar Headpic</span>
                    <span className="text-gray-300 font-bold truncate block">{accountData?.basicInfo?.headPicName || "Default"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ACCOUNT INFORMATION TAB (API DRIVEN MODULE) */}
        {activeDashTab === "account_info" && (
          <div className="space-y-6 animate-fade-in">
            <AccountInfoModule initialUid={profile?.uid || "1904263999"} showSearchHeader={true} />
          </div>
        )}

        {/* 4. DELIVERY PROGRESS TAB */}
        {activeDashTab === "delivery" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-6">
            <h3 className="text-xs font-bold text-white uppercase border-b border-[rgba(255,255,255,0.06)] pb-2">Full Delivery Statistics</h3>
            {deliveryProgress ? (
              <div className="space-y-6">
                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">Total Estimated vs Delivered Progress</span>
                    <span className="text-green-400">{deliveryProgress.progressPercentage}% Completed</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${deliveryProgress.progressPercentage}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs font-semibold text-gray-300">
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Total Estimated</span>
                    <span className="text-white font-black text-sm">{deliveryProgress.totalEstimatedDelivery.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Total Delivered</span>
                    <span className="text-[#FF2E93] font-black text-sm">{deliveryProgress.totalDelivered.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Remaining</span>
                    <span className="text-white font-black text-sm">{deliveryProgress.remainingEstimatedDelivery.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Progress</span>
                    <span className="text-green-400 font-black text-sm">{deliveryProgress.progressPercentage}%</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Today&apos;s Status</span>
                    <span className="text-green-400 font-bold text-sm">{deliveryProgress.todayStatus}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Next Delivery</span>
                    <span className="text-gray-300 font-bold text-xs">{deliveryProgress.nextScheduledTime}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 bg-[#0B0B0F] rounded-xl text-center space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase">No Active Plan</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">Subscribe to an autolike plan to start tracking daily delivery progress and queue schedules.</p>
                <Link href="/#pricing" className="pink-btn inline-block px-6 py-2.5 rounded-xl text-xs font-bold uppercase mt-2">
                  Browse Plans
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 5. PAYMENT HISTORY TAB */}
        {activeDashTab === "payments" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="h-4 w-4 text-[#FF2E93]" />
                <span>Payment Transactions & Screenshot Proofs</span>
              </h3>
            </div>
            {orders.length === 0 ? (
              <p className="text-xs text-gray-500 py-8 text-center font-bold uppercase">No payment transactions recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)] text-gray-400 font-bold uppercase">
                      <th className="py-2.5">Submitted Date</th>
                      <th className="py-2.5">Plan</th>
                      <th className="py-2.5">UTR / Ref</th>
                      <th className="py-2.5">Screenshot</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Verified Time</th>
                      <th className="py-2.5 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                    {orders.map((o) => (
                      <tr key={o.id} className="text-gray-300">
                        <td className="py-3 font-mono text-[10px] text-gray-400">{new Date(o.created_at).toLocaleString()}</td>
                        <td className="py-3 font-bold text-white">{o.plans?.name || "Subscription Plan"}</td>
                        <td className="py-3 font-mono text-white font-bold">{o.utr_number || "N/A"}</td>
                        <td className="py-3">
                          {o.screenshot_url ? (
                            <a
                              href={o.screenshot_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 p-1 bg-[#0B0B0F] hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                              title="Click to view full screenshot image"
                            >
                              <img src={o.screenshot_url} alt="Proof" className="h-8 w-12 object-cover rounded" />
                              <Eye className="h-3 w-3 text-[#FF2E93]" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-gray-600 italic">No Image</span>
                          )}
                        </td>
                        <td className="py-3 font-bold text-white">₹{o.amount}</td>
                        <td className="py-3">
                          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                            o.status === "approved" || o.status === "success" || o.status === "verified"
                              ? "bg-green-950/80 text-[#00E676] border-green-800"
                              : o.status === "rejected"
                              ? "bg-red-950/80 text-red-400 border-red-800"
                              : "bg-amber-950/80 text-amber-400 border-amber-800 animate-pulse"
                          }`}>
                            {o.status === "approved" || o.status === "success" ? "Verified" : o.status}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-[10px] text-gray-400">
                          {o.verified_at ? new Date(o.verified_at).toLocaleString() : (o.status === "pending" ? "Awaiting Admin" : "N/A")}
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleInvoiceDownload(o)} className="pink-btn py-1 px-3 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer">
                            <Download className="h-3 w-3" /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 6. NOTIFICATIONS TAB */}
        {activeDashTab === "notifications" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase border-b border-[rgba(255,255,255,0.06)] pb-2">Notifications Center</h3>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 bg-[#0B0B0F] rounded-xl border border-white/5 text-xs">
                  <p className="font-bold text-white">{n.title}</p>
                  <p className="text-gray-400 mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SETTINGS TAB */}
        {activeDashTab === "settings" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] max-w-xl mx-auto space-y-4">
            <h3 className="text-xs font-bold text-white uppercase border-b border-[rgba(255,255,255,0.06)] pb-2">Account Settings</h3>
            <form onSubmit={updateProfile} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-400 mb-1">Nickname</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0B0B0F] rounded-xl border border-white/5">
                <span>Hide Profile from Public Feeds</span>
                <input type="checkbox" checked={hideProfile} onChange={(e) => setHideProfile(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93]" />
              </div>
              <button type="submit" className="pink-btn w-full py-2.5 rounded-xl font-bold uppercase">Save Changes</button>
            </form>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <button onClick={handleLogout} className="w-full py-2.5 bg-red-950 hover:bg-red-900 text-red-400 rounded-xl font-bold uppercase border border-red-900 flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" /> Log Out Account
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
