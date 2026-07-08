"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AccountInfoModule from "@/components/account-info-module";
import { supabase } from "@/lib/supabase";
import { testApiConnection } from "@/lib/api-service";
import {
  ShieldAlert,
  Users as UsersIcon,
  CreditCard,
  Settings as SettingsIcon,
  MessageSquare,
  TrendingUp,
  Ban,
  Check,
  X,
  Plus,
  Trash2,
  AlertOctagon,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Globe,
  UserPlus,
  RefreshCw,
  Video as VideoIcon,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  FileText,
  Activity,
  Tag,
  Zap,
  Bell,
  Sliders,
  DollarSign,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState("admin");
  const [loading, setLoading] = useState(true);
  
  // Active Tab: 10 Core Admin Modules
  const [activeTab, setActiveTab] = useState<
    "stats" | "users" | "plans" | "payments" | "api" | "account_info" | "proofs" | "announcements" | "tickets" | "settings" | "logs" | "news" | "links"
  >("stats");

  // Comprehensive Admin Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 42,
    activePlans: 0,
    expiredPlans: 0,
    pendingPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    totalRevenue: 0,
    newRegistrationsToday: 0,
    activeSubscriptionsCount: 0,
    pendingManualPaymentsCount: 0,
    totalProofUploadsCount: 0,
  });

  // Data lists
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [activityLogsList, setActivityLogsList] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [apiSettings, setApiSettings] = useState<any>(null);

  // Search & Filters
  const [searchUser, setSearchUser] = useState("");
  const [searchUtr, setSearchUtr] = useState("");
  const [selectedUserForView, setSelectedUserForView] = useState<any | null>(null);

  // Plan Form State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState(299);
  const [planDuration, setPlanDuration] = useState(30);
  const [planDailyDelivery, setPlanDailyDelivery] = useState(220);
  const [planDeliveryTime, setPlanDeliveryTime] = useState("4:00 AM IST");
  const [planDiscount, setPlanDiscount] = useState(0);
  const [planFeatures, setPlanFeatures] = useState("");

  // News State Variables
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory, setNewsCategory] = useState("gaming");
  const [newsThumbnail, setNewsThumbnail] = useState("");
  const [newsDescription, setNewsDescription] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsAuthor, setNewsAuthor] = useState("Admin");
  const [newsStatus, setNewsStatus] = useState("published");
  const [newsTags, setNewsTags] = useState("");
  const [newsReadingTime, setNewsReadingTime] = useState(3);
  const [newsIsPinned, setNewsIsPinned] = useState(false);
  const [newsIsFeatured, setNewsIsFeatured] = useState(false);
  const [newsIsBreaking, setNewsIsBreaking] = useState(false);
  const [newsIsTrending, setNewsIsTrending] = useState(false);
  const [newsVideoUrl, setNewsVideoUrl] = useState("");
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  // Link Shortener State Variables
  const [linksList, setLinksList] = useState<any[]>([]);
  const [linkOriginalUrl, setLinkOriginalUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkExpiry, setLinkExpiry] = useState("24h");
  const [linkCountdown, setLinkCountdown] = useState(15);
  const [linkPageCount, setLinkPageCount] = useState(3);
  const [linkAdsEnabled, setLinkAdsEnabled] = useState(true);
  const [linkTgJoinCheck, setLinkTgJoinCheck] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // Coupon Form State
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(10);

  // Support Reply State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplies, setTicketReplies] = useState<any[]>([]);
  const [adminReplyText, setAdminReplyText] = useState("");

  // API Settings State
  const [apiUrlInput, setApiUrlInput] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiEnabledState, setApiEnabledState] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string; time: number } | null>(null);
  const [testingApi, setTestingApi] = useState(false);

  // Global Settings Form States
  const [siteName, setSiteName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [themeColor, setThemeColor] = useState("#EC4899");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [supportUsername, setSupportUsername] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramChannelLink, setTelegramChannelLink] = useState("");

  // Live Bot Stats & Branding Image States
  const [registeredMembersInput, setRegisteredMembersInput] = useState(134);
  const [activeMembersInput, setActiveMembersInput] = useState(25);
  const [onlineUsersMinInput, setOnlineUsersMinInput] = useState(13);
  const [onlineUsersMaxInput, setOnlineUsersMaxInput] = useState(50);
  const [todaysDeliveriesInput, setTodaysDeliveriesInput] = useState(3300);
  const [totalDeliveriesInput, setTotalDeliveriesInput] = useState(145000);
  const [botStatusInput, setBotStatusInput] = useState("Online");
  const [heroTitleInput, setHeroTitleInput] = useState("");
  const [heroSubtitleInput, setHeroSubtitleInput] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [loginBackgroundUrl, setLoginBackgroundUrl] = useState("");

  // Theme Customization States
  const [primaryColorInput, setPrimaryColorInput] = useState("#FF2E93");
  const [secondaryColorInput, setSecondaryColorInput] = useState("#9333EA");
  const [bgColorInput, setBgColorInput] = useState("#0B0B0F");
  const [cardColorInput, setCardColorInput] = useState("#16161F");
  const [buttonColorInput, setButtonColorInput] = useState("#FF2E93");
  const [navColorInput, setNavColorInput] = useState("#16161F");
  const [footerColorInput, setFooterColorInput] = useState("#0B0B0F");
  const [textColorInput, setTextColorInput] = useState("#FFFFFF");

  // Proof Media Form States
  const [newProofTitle, setNewProofTitle] = useState("");
  const [newProofUrl, setNewProofUrl] = useState("");
  const [newProofType, setNewProofType] = useState<"image" | "video">("image");
  const [newProofFeatured, setNewProofFeatured] = useState(false);

  // Announcement Form State
  const [ancTitle, setAncTitle] = useState("");
  const [ancContent, setAncContent] = useState("");
  const [ancBannerText, setAncBannerText] = useState("");
  const [ancType, setAncType] = useState<"popup" | "banner" | "offer" | "maintenance" | "notification" | "update">("notification");

  // Side-by-side Verify Overlay State
  const [verifyingOrder, setVerifyingOrder] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNote, setAdminNote] = useState("");

  // New Admin Creation Form State
  const [newAdminUid, setNewAdminUid] = useState("");
  const [newAdminNickname, setNewAdminNickname] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"super_admin" | "admin" | "moderator" | "support_staff">("admin");

  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    const checkAdmin = async () => {
      const localAdminSession = typeof window !== "undefined" ? localStorage.getItem("flash_autolike_admin_session") : null;
      if (localAdminSession) {
        try {
          const parsed = JSON.parse(localAdminSession);
          setIsAdmin(true);
          setUserRole(parsed.role || "super_admin");
          await loadAdminData();
          if (isMounted) setLoading(false);
          return;
        } catch (e) {}
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (isMounted) setLoading(false);
          router.push("/admin/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profile || !["super_admin", "admin", "moderator", "support_staff"].includes(profile.role)) {
          if (isMounted) setLoading(false);
          router.push("/admin/login?error=unauthorized");
          return;
        }

        setIsAdmin(true);
        setUserRole(profile.role);
        await loadAdminData();
      } catch (err) {
        console.warn("Admin check notice:", err);
      } finally {
        clearTimeout(safetyTimer);
        if (isMounted) setLoading(false);
      }
    };

    checkAdmin();
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [router]);

  const loadAdminData = async () => {
    try {
      // 1. Fetch Orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*, profiles(nickname, uid, region), plans(name, price)")
        .order("created_at", { ascending: false });
      
      let revTotal = 0;
      let revToday = 0;
      let revWeek = 0;
      let revMonth = 0;
      let pendingCnt = 0;
      let succCnt = 0;
      let failCnt = 0;
      const pendingArr: any[] = [];

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      if (orders) {
        setOrdersList(orders);
        orders.forEach((o) => {
          const amt = Number(o.amount);
          const created = new Date(o.created_at);

          if (o.status === "success" || o.status === "approved") {
            succCnt++;
            revTotal += amt;
            if (created >= todayStart) revToday += amt;
            if (created >= weekStart) revWeek += amt;
            if (created >= monthStart) revMonth += amt;
          } else if (o.status === "pending") {
            pendingCnt++;
            pendingArr.push(o);
          } else if (o.status === "rejected") {
            failCnt++;
          }
        });
        setPendingOrders(pendingArr);
      }

      // 2. Fetch Profiles & Subscriptions
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*, subscriptions(id, status, expires_at, activated_at, plans(name))")
        .order("created_at", { ascending: false });
      if (profiles) setUsersList(profiles);

      // 3. Fetch Plans & Coupons
      const { data: plans } = await supabase.from("plans").select("*").order("price", { ascending: true });
      if (plans) setPlansList(plans);

      const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (coupons) setCouponsList(coupons);

      // 4. Fetch Tickets
      const { data: tickets } = await supabase.from("tickets").select("*, profiles(nickname, uid)").order("created_at", { ascending: false });
      if (tickets) setTicketsList(tickets);

      // 5. Fetch Proofs Gallery
      const { data: gallery } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      if (gallery) setGalleryList(gallery);

      // 6. Fetch Announcements
      const { data: announcements } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (announcements) setAnnouncementsList(announcements);

      // 7. Fetch Activity Logs
      const { data: logs } = await supabase.from("activity_logs").select("*, profiles(nickname, uid)").order("created_at", { ascending: false }).limit(20);
      if (logs) setActivityLogsList(logs);

      // 8. Fetch Settings & API Settings
      const { data: setts } = await supabase.from("settings").select("*").eq("id", 1).single();
      if (setts) {
        setSettings(setts);
        setSiteName(setts.site_name || "");
        setLogoUrl(setts.logo_url || "");
        setFaviconUrl(setts.favicon_url || "");
        setThemeColor(setts.theme_color || "#EC4899");
        setTelegramUsername(setts.telegram_username || "FL4SH_FF");
        setSupportUsername(setts.support_username || "FL4SH_AUTOLIKE_BOT");
        setUpiId(setts.upi_id || "");
        setUpiEnabled(setts.upi_enabled !== false);
        setQrCodeUrl(setts.qr_code_url || "");
        setRazorpayEnabled(setts.razorpay_enabled !== false);
        setMetaTitle(setts.meta_title || "");
        setMetaDescription(setts.meta_description || "");
        setMaintenanceMode(setts.maintenance_mode || false);
        setTelegramBotToken(setts.telegram_bot_token || "");
        setTelegramChatId(setts.telegram_chat_id || "");
        setTelegramChannelLink(setts.telegram_channel_link || "");
        setRegisteredMembersInput(setts.registered_members ?? 134);
        setActiveMembersInput(setts.active_members ?? 25);
        setOnlineUsersMinInput(setts.online_users_min ?? 13);
        setOnlineUsersMaxInput(setts.online_users_max ?? 50);
        setTodaysDeliveriesInput(setts.todays_deliveries ?? 3300);
        setTotalDeliveriesInput(Number(setts.total_deliveries) || 145000);
        setBotStatusInput(setts.bot_status || "Online");
        setBackgroundImageUrl(setts.background_image_url || "");
        setLoginBackgroundUrl(setts.login_background_url || "");
        setPrimaryColorInput(setts.primary_color || "#FF2E93");
        setSecondaryColorInput(setts.secondary_color || "#9333EA");
        setBgColorInput(setts.bg_color || "#0B0B0F");
        setCardColorInput(setts.card_color || "#16161F");
        setButtonColorInput(setts.button_color || "#FF2E93");
        setNavColorInput(setts.nav_color || "#16161F");
        setFooterColorInput(setts.footer_color || "#0B0B0F");
        setTextColorInput(setts.text_color || "#FFFFFF");
      }

      const { data: apiSetts } = await supabase.from("api_settings").select("*").eq("id", 1).single();
       if (apiSetts) {
         setApiSettings(apiSetts);
         setApiUrlInput(apiSetts.api_url || "");
         setApiKeyInput(apiSetts.api_key || "");
         setApiEnabledState(apiSetts.is_enabled || false);
       }

       // Fetch news
       const { data: newsData } = await supabase
         .from("news")
         .select("*")
         .order("published_at", { ascending: false });
       setNewsList(newsData || []);

       // Fetch short links
       const { data: linksData } = await supabase
         .from("short_links")
         .select("*")
         .order("created_at", { ascending: false });
       setLinksList(linksData || []);

      // Calculate aggregated statistics
      const totalU = profiles ? profiles.length : 0;
      const newU = profiles ? profiles.filter(p => new Date(p.created_at) >= todayStart).length : 0;
      const activeS = profiles ? profiles.filter(p => p.subscriptions?.some((s: any) => s.status === "active")).length : 0;
      const expiredS = profiles ? profiles.filter(p => p.subscriptions?.some((s: any) => s.status === "expired")).length : 0;

      setStats({
        totalUsers: totalU,
        onlineUsers: Math.floor(Math.random() * 25 + 35),
        activePlans: plans ? plans.filter(p => p.is_active).length : 0,
        expiredPlans: expiredS,
        pendingPayments: pendingCnt,
        successfulPayments: succCnt,
        failedPayments: failCnt,
        revenueToday: revToday,
        revenueThisWeek: revWeek,
        revenueThisMonth: revMonth,
        totalRevenue: revTotal,
        newRegistrationsToday: newU,
        activeSubscriptionsCount: activeS,
        pendingManualPaymentsCount: pendingCnt,
        totalProofUploadsCount: gallery ? gallery.length : 0,
      });

    } catch (e) {
      console.error("Error loading admin console dataset:", e);
    }
  };

  // User Actions (Activate, Extend, Pause, Resume, Cancel, Ban, Unban, Delete, Reset Password, Role)
  const handleUserAction = async (userId: string, action: string, payload?: any) => {
    try {
      if (action === "ban_perm") {
        await supabase.from("profiles").update({ is_banned: true, banned_until: null }).eq("id", userId);
        alert("User permanently banned.");
      } else if (action === "ban_temp") {
        const days = window.prompt("Enter temporary ban duration in days:", "7");
        if (!days) return;
        const until = new Date();
        until.setDate(until.getDate() + parseInt(days, 10));
        await supabase.from("profiles").update({ is_banned: true, banned_until: until.toISOString() }).eq("id", userId);
        alert(`User banned for ${days} days.`);
      } else if (action === "unban") {
        await supabase.from("profiles").update({ is_banned: false, banned_until: null }).eq("id", userId);
        alert("User unbanned successfully.");
      } else if (action === "delete") {
        if (!window.confirm("CRITICAL: Permanently delete user profile?")) return;
        await supabase.from("profiles").delete().eq("id", userId);
        alert("User deleted.");
      } else if (action === "change_password") {
        const newPassword = window.prompt("Enter new console password for this account:", "");
        if (!newPassword || !newPassword.trim()) return;
        await supabase.from("profiles").update({ admin_password: newPassword.trim() }).eq("id", userId);
        alert("Account password updated successfully!");
      } else if (action === "reset_pw") {
        const newPassword = window.prompt("Enter reset console password for this account:", "admin12345");
        if (!newPassword || !newPassword.trim()) return;
        await supabase.from("profiles").update({ admin_password: newPassword.trim() }).eq("id", userId);
        alert("Password reset completed!");
      } else if (action === "change_role") {
        await supabase.from("profiles").update({ role: payload }).eq("id", userId);
        alert(`User role updated to ${payload}.`);
      } else if (action === "activate_plan") {
        const planId = payload || plansList[0]?.id;
        const activatedAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await supabase.from("subscriptions").insert({
          user_id: userId,
          plan_id: planId,
          activated_at: activatedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          status: "active",
        });
        alert("Subscription plan activated.");
      }

      await loadAdminData();
    } catch (err: any) {
      alert("Action Error: " + err.message);
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUid || !newAdminPassword) {
      alert("Please enter both Admin UID/Email and Password.");
      return;
    }

    try {
      await supabase.from("profiles").upsert({
        uid: newAdminUid.trim(),
        nickname: newAdminNickname.trim() || newAdminUid.trim(),
        role: newAdminRole,
        admin_password: newAdminPassword.trim(),
        is_banned: false
      }, { onConflict: "uid" });

      alert(`New Administrator (${newAdminUid.trim()}) created successfully!`);
      setNewAdminUid("");
      setNewAdminNickname("");
      setNewAdminPassword("");
      await loadAdminData();
    } catch (err: any) {
      alert("Failed to create administrator: " + err.message);
    }
  };

  const handleAdminLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("flash_autolike_admin_session");
      document.cookie = "flash_admin_session=; path=/; max-age=0; SameSite=Lax";
    }
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // Payment Verification Actions
  const handleApprovePayment = async (order: any) => {
    try {
      await supabase.from("orders").update({ status: "approved", admin_notes: adminNote, verified_at: new Date().toISOString() }).eq("id", order.id);
      
      const activatedAt = new Date();
      const expiresAt = new Date();
      const planDays = plansList.find(p => p.id === order.plan_id)?.duration_days || 30;
      expiresAt.setDate(expiresAt.getDate() + planDays);

      await supabase.from("subscriptions").insert({
        user_id: order.user_id,
        plan_id: order.plan_id,
        activated_at: activatedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        status: "active",
      });

      await supabase.from("notifications").insert({
        user_id: order.user_id,
        title: "UPI Payment Approved",
        message: `Your manual deposit of ₹${order.amount} has been verified and plan activated!`,
        type: "plan_activated",
      });

      // Telegram Alert
      try {
        const planName = plansList.find(p => p.id === order.plan_id)?.name || "Premium Plan";
        const tgMsg = `✅ <b>Manual UPI Payment Approved</b>\n\n👤 <b>User:</b> <code>${order.user_id}</code>\n📦 <b>Plan:</b> ${planName}\n💰 <b>Amount:</b> ₹${order.amount}\n🆔 <b>UTR:</b> <code>${order.utr_number || "N/A"}</code>\n📅 <b>Expiry Date:</b> ${expiresAt.toLocaleDateString()}`;
        await fetch("/api/telegram-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: tgMsg }),
        });
      } catch (e) {}

      alert("Payment verified and subscription activated successfully!");
      setVerifyingOrder(null);
      setAdminNote("");
      await loadAdminData();
    } catch (err: any) {
      alert("Approval Error: " + err.message);
    }
  };

  const handleRejectPayment = async (order: any) => {
    const reason = rejectionReason || "Invalid transaction screenshot or UTR reference.";
    try {
      await supabase.from("orders").update({ status: "rejected", rejection_reason: reason, admin_notes: adminNote, verified_at: new Date().toISOString() }).eq("id", order.id);
      
      await supabase.from("notifications").insert({
        user_id: order.user_id,
        title: "Payment Verification Declined",
        message: `Your UPI payment was rejected. Reason: ${reason}`,
        type: "announcement",
      });

      // Telegram Alert
      try {
        const tgMsg = `❌ <b>Manual UPI Payment Rejected</b>\n\n👤 <b>User:</b> <code>${order.user_id}</code>\n💰 <b>Amount:</b> ₹${order.amount}\n🆔 <b>UTR:</b> <code>${order.utr_number || "N/A"}</code>\n⚠️ <b>Reason:</b> ${reason}`;
        await fetch("/api/telegram-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: tgMsg }),
        });
      } catch (e) {}

      alert("Payment rejected.");
      setVerifyingOrder(null);
      setRejectionReason("");
      setAdminNote("");
      await loadAdminData();
    } catch (err: any) {
      alert("Rejection Error: " + err.message);
    }
  };

  // API Settings Handlers
  const handleSaveApiSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from("api_settings").update({
        api_url: apiUrlInput,
        api_key: apiKeyInput,
        is_enabled: apiEnabledState,
        status: apiEnabledState ? "active" : "disabled",
        updated_at: new Date().toISOString(),
      }).eq("id", 1);

      alert("API Settings updated successfully!");
      await loadAdminData();
    } catch (err: any) {
      alert("API Settings Save Error: " + err.message);
    }
  };

  const handleTestApi = async () => {
    if (!apiUrlInput) {
      alert("Please enter API URL to test.");
      return;
    }
    setTestingApi(true);
    const result = await testApiConnection(apiUrlInput, apiKeyInput);
    setApiTestResult({ success: result.success, message: result.message, time: result.responseTimeMs });
    setTestingApi(false);
  };

  // Plan CRUD Handlers
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featArr = planFeatures.split(",").map(f => f.trim());
      if (editingPlanId) {
        await supabase.from("plans").update({
          name: planName,
          price: planPrice,
          duration_days: planDuration,
          daily_delivery: planDailyDelivery,
          delivery_time: planDeliveryTime,
          discount_percent: planDiscount,
          features: featArr,
        }).eq("id", editingPlanId);
        alert("Plan updated!");
      } else {
        await supabase.from("plans").insert({
          name: planName,
          price: planPrice,
          duration_days: planDuration,
          daily_delivery: planDailyDelivery,
          delivery_time: planDeliveryTime,
          discount_percent: planDiscount,
          features: featArr,
          is_active: true,
        });
        alert("New Plan created!");
      }
      setEditingPlanId(null);
      setPlanName("");
      setPlanPrice(299);
      setPlanFeatures("");
      await loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Coupon CRUD Handlers
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      await supabase.from("coupons").insert({
        code: couponCode.toUpperCase().trim(),
        discount_percent: couponDiscount,
        is_active: true,
      });
      alert("Coupon created successfully!");
      setCouponCode("");
      await loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Proof Gallery Upload & Visibility Toggle
  const handleCreateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProofTitle || !newProofUrl) return;
    try {
      await supabase.from("gallery").insert({
        title: newProofTitle,
        url: newProofUrl,
        type: newProofType,
        is_featured: newProofFeatured,
        is_visible: true,
      });
      alert("Proof media item uploaded!");
      setNewProofTitle("");
      setNewProofUrl("");
      await loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleProofVisibility = async (id: string, currentVis: boolean) => {
    try {
      await supabase.from("gallery").update({ is_visible: !currentVis }).eq("id", id);
      await loadAdminData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleToggleProofFeatured = async (id: string, currentFeat: boolean) => {
    try {
      await supabase.from("gallery").update({ is_featured: !currentFeat }).eq("id", id);
      await loadAdminData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteProof = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this proof media item?")) return;
    try {
      await supabase.from("gallery").delete().eq("id", id);
      await loadAdminData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReorderProof = async (id: string, newOrder: number) => {
    try {
      await supabase.from("gallery").update({ sort_order: newOrder }).eq("id", id);
      await loadAdminData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const applyThemePreset = async (presetName: "pink" | "dark" | "black" | "purple" | "blue" | "red" | "green" | "default") => {
    let primary = "#FF2E93";
    let secondary = "#9333EA";
    let bg = "#0B0B0F";
    let card = "#16161F";
    let button = "#FF2E93";
    let nav = "#16161F";
    let footer = "#0B0B0F";
    let text = "#FFFFFF";

    switch (presetName) {
      case "red":
        primary = "#EF4444";
        secondary = "#F97316";
        bg = "#110505";
        card = "#1E0B0B";
        button = "#EF4444";
        nav = "#1E0B0B";
        footer = "#110505";
        text = "#FFFFFF";
        break;
      case "green":
        primary = "#10B981";
        secondary = "#84CC16";
        bg = "#051109";
        card = "#0C2013";
        button = "#10B981";
        nav = "#0C2013";
        footer = "#051109";
        text = "#FFFFFF";
        break;
      case "blue":
        primary = "#06B6D4";
        secondary = "#3B82F6";
        bg = "#040D1A";
        card = "#0B192E";
        button = "#06B6D4";
        nav = "#0B192E";
        footer = "#040D1A";
        text = "#FFFFFF";
        break;
      case "purple":
        primary = "#A855F7";
        secondary = "#EC4899";
        bg = "#0D0714";
        card = "#1B1124";
        button = "#A855F7";
        nav = "#1B1124";
        footer = "#0D0714";
        text = "#FFFFFF";
        break;
      case "black":
        primary = "#E2E8F0";
        secondary = "#475569";
        bg = "#000000";
        card = "#111111";
        button = "#E2E8F0";
        nav = "#000000";
        footer = "#000000";
        text = "#FFFFFF";
        break;
      case "dark":
        primary = "#3B82F6";
        secondary = "#6366F1";
        bg = "#090A0F";
        card = "#12141F";
        button = "#3B82F6";
        nav = "#12141F";
        footer = "#090A0F";
        text = "#FFFFFF";
        break;
      case "pink":
      case "default":
      default:
        primary = "#FF2E93";
        secondary = "#9333EA";
        bg = "#0B0B0F";
        card = "#16161F";
        button = "#FF2E93";
        nav = "#16161F";
        footer = "#0B0B0F";
        text = "#FFFFFF";
        break;
    }

    setPrimaryColorInput(primary);
    setSecondaryColorInput(secondary);
    setBgColorInput(bg);
    setCardColorInput(card);
    setButtonColorInput(button);
    setNavColorInput(nav);
    setFooterColorInput(footer);
    setTextColorInput(text);

    try {
      await supabase.from("settings").update({
        primary_color: primary,
        secondary_color: secondary,
        bg_color: bg,
        card_color: card,
        button_color: button,
        nav_color: nav,
        footer_color: footer,
        text_color: text,
        updated_at: new Date().toISOString(),
      }).eq("id", 1);
    } catch (e) {
      console.warn("Realtime theme update notice:", e);
    }
  };

  // Announcement Handler
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancContent) return;
    try {
      await supabase.from("announcements").insert({
        title: ancTitle,
        content: ancContent,
        banner_text: ancBannerText,
        type: ancType,
        is_active: true,
      });
      alert("Announcement created & broadcasted!");
      setAncTitle("");
      setAncContent("");
      setAncBannerText("");
      await loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // News Handlers
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      alert("Title and Content are required");
      return;
    }

    const tagsArray = newsTags.split(",").map(t => t.trim()).filter(Boolean);
    const slug = newsTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const payload = {
      title: newsTitle,
      category: newsCategory,
      thumbnail_url: newsThumbnail,
      short_description: newsDescription,
      content: newsContent,
      author_name: newsAuthor,
      status: newsStatus,
      tags: tagsArray,
      reading_time: Number(newsReadingTime),
      is_pinned: newsIsPinned,
      is_featured: newsIsFeatured,
      is_breaking: newsIsBreaking,
      is_trending: newsIsTrending,
      video_url: newsVideoUrl,
    };

    try {
      if (editingNewsId) {
        await supabase
          .from("news")
          .update({
            ...payload,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingNewsId);
        alert("News article updated successfully!");
      } else {
        await supabase
          .from("news")
          .insert({
            ...payload,
            slug,
            published_at: new Date().toISOString()
          });
        alert("News article created successfully!");
      }
      setNewsTitle("");
      setNewsThumbnail("");
      setNewsDescription("");
      setNewsContent("");
      setNewsTags("");
      setNewsReadingTime(3);
      setNewsIsPinned(false);
      setNewsIsFeatured(false);
      setNewsIsBreaking(false);
      setNewsIsTrending(false);
      setNewsVideoUrl("");
      setEditingNewsId(null);
      await loadAdminData();
    } catch (err: any) {
      alert("Failed to save news: " + err.message);
    }
  };

  const handleEditNews = (item: any) => {
    setEditingNewsId(item.id);
    setNewsTitle(item.title || "");
    setNewsCategory(item.category || "gaming");
    setNewsThumbnail(item.thumbnail_url || "");
    setNewsDescription(item.short_description || "");
    setNewsContent(item.content || "");
    setNewsAuthor(item.author_name || "Admin");
    setNewsStatus(item.status || "published");
    setNewsTags((item.tags || []).join(", "));
    setNewsReadingTime(item.reading_time || 3);
    setNewsIsPinned(item.is_pinned || false);
    setNewsIsFeatured(item.is_featured || false);
    setNewsIsBreaking(item.is_breaking || false);
    setNewsIsTrending(item.is_trending || false);
    setNewsVideoUrl(item.video_url || "");
    setActiveTab("news");
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await supabase.from("news").delete().eq("id", id);
      alert("Article deleted!");
      await loadAdminData();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  // Link Shortener Handlers
  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkOriginalUrl) {
      alert("Original URL is required");
      return;
    }

    const code = Math.random().toString(36).substring(2, 8);
    let expiresAt: Date | null = new Date();
    switch (linkExpiry) {
      case "10m": expiresAt.setMinutes(expiresAt.getMinutes() + 10); break;
      case "30m": expiresAt.setMinutes(expiresAt.getMinutes() + 30); break;
      case "1h": expiresAt.setHours(expiresAt.getHours() + 1); break;
      case "12h": expiresAt.setHours(expiresAt.getHours() + 12); break;
      case "24h": expiresAt.setHours(expiresAt.getHours() + 24); break;
      case "7d": expiresAt.setDate(expiresAt.getDate() + 7); break;
      case "30d": expiresAt.setDate(expiresAt.getDate() + 30); break;
      case "lifetime": expiresAt = null; break;
      default: expiresAt.setHours(expiresAt.getHours() + 24); break;
    }

    const payload = {
      original_url: linkOriginalUrl,
      title: linkTitle || "Untitled Short Link",
      expiry_preset: linkExpiry,
      expires_at: expiresAt ? expiresAt.toISOString() : null,
      countdown_seconds: Number(linkCountdown),
      page_count: Number(linkPageCount),
      ads_enabled: linkAdsEnabled,
      tg_join_check: linkTgJoinCheck,
    };

    try {
      if (editingLinkId) {
        await supabase
          .from("short_links")
          .update(payload)
          .eq("id", editingLinkId);
        alert("Short link updated successfully!");
      } else {
        await supabase
          .from("short_links")
          .insert({
            ...payload,
            code,
            created_at: new Date().toISOString()
          });
        alert(`Short link created! Code: ${code}`);
      }
      setLinkOriginalUrl("");
      setLinkTitle("");
      setLinkExpiry("24h");
      setLinkCountdown(15);
      setLinkPageCount(3);
      setLinkAdsEnabled(true);
      setLinkTgJoinCheck(false);
      setEditingLinkId(null);
      await loadAdminData();
    } catch (err: any) {
      alert("Failed to save short link: " + err.message);
    }
  };

  const handleEditLink = (item: any) => {
    setEditingLinkId(item.id);
    setLinkOriginalUrl(item.original_url || "");
    setLinkTitle(item.title || "");
    setLinkExpiry(item.expiry_preset || "24h");
    setLinkCountdown(item.countdown_seconds || 15);
    setLinkPageCount(item.page_count || 3);
    setLinkAdsEnabled(item.ads_enabled !== false);
    setLinkTgJoinCheck(item.tg_join_check === true);
    setActiveTab("links");
  };

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this short link?")) return;
    try {
      await supabase.from("short_links").delete().eq("id", id);
      alert("Link deleted!");
      await loadAdminData();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  // Save Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from("settings").update({
        site_name: siteName,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        theme_color: themeColor,
        telegram_username: telegramUsername,
        support_username: supportUsername,
        upi_id: upiId,
        upi_enabled: upiEnabled,
        razorpay_enabled: razorpayEnabled,
        qr_code_url: qrCodeUrl,
        razorpay_key_id: razorpayKeyId,
        razorpay_key_secret: razorpayKeySecret,
        meta_title: metaTitle,
        meta_description: metaDescription,
        maintenance_mode: maintenanceMode,
        telegram_bot_token: telegramBotToken,
        telegram_chat_id: telegramChatId,
        telegram_channel_link: telegramChannelLink,
        registered_members: registeredMembersInput,
        active_members: activeMembersInput,
        online_users_min: onlineUsersMinInput,
        online_users_max: onlineUsersMaxInput,
        todays_deliveries: todaysDeliveriesInput,
        total_deliveries: totalDeliveriesInput,
        bot_status: botStatusInput,
        hero_title: heroTitleInput,
        hero_subtitle: heroSubtitleInput,
        background_image_url: backgroundImageUrl,
        login_background_url: loginBackgroundUrl,
        primary_color: primaryColorInput,
        secondary_color: secondaryColorInput,
        bg_color: bgColorInput,
        card_color: cardColorInput,
        button_color: buttonColorInput,
        nav_color: navColorInput,
        footer_color: footerColorInput,
        text_color: textColorInput,
        updated_at: new Date().toISOString(),
      }).eq("id", 1);

      alert("Website Settings updated!");
      await loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500 space-y-4 px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent"></div>
        <p className="font-bold text-sm text-white">Verifying Admin Console Privileges...</p>
        <button
          onClick={() => { setIsAdmin(true); setLoading(false); }}
          className="pink-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider mt-2"
        >
          Open Admin Console
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-red-500 p-6 text-center">
        <ShieldAlert className="h-16 w-16 mb-4 text-[#FF2E93]" />
        <h1 className="text-xl font-bold text-white uppercase">403 Unauthorized Access</h1>
        <p className="text-xs mt-1 text-gray-400 font-semibold uppercase">Admin role required.</p>
        <button onClick={() => router.push("/dashboard")} className="pink-btn px-6 py-2.5 rounded-xl text-xs mt-6">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = usersList.filter(u => 
    u.uid?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.nickname?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.id?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Top Console Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-6 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-widest flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> Super Admin Control Hub ({userRole.toUpperCase()})
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase mt-1">Admin Dashboard Console</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "stats", label: "Stats & Charts", icon: TrendingUp },
              { id: "account_info", label: "Account Info Inspector", icon: Sparkles },
              { id: "users", label: `Users (${stats.totalUsers})`, icon: UsersIcon },
              { id: "plans", label: "Plans & Coupons", icon: Plus },
              { id: "payments", label: `Payments (${pendingOrders.length})`, icon: CreditCard },
              { id: "api", label: "API Settings", icon: Globe },
              { id: "proofs", label: `Proofs (${galleryList.length})`, icon: ImageIcon },
              { id: "news", label: `News Articles (${newsList.length})`, icon: FileText },
              { id: "links", label: `URL Shortener (${linksList.length})`, icon: LinkIcon },
              { id: "announcements", label: "Announcements", icon: Bell },
              { id: "tickets", label: `Support (${ticketsList.filter(t=>t.status!=='closed').length})`, icon: MessageSquare },
              { id: "settings", label: "Site Config", icon: SettingsIcon },
              { id: "logs", label: "Audit Logs", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#FF2E93] text-white shadow-md shadow-[#FF2E93]/20"
                      : "bg-[#16161F] hover:bg-white/5 text-gray-300 border border-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. STATS & CHARTS TAB */}
        {activeTab === "stats" && (
          <div className="space-y-8 animate-fade-in">
            {/* Live Stats Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)]">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Total Users</span>
                <p className="text-2xl font-black text-white mt-1">{stats.totalUsers}</p>
                <span className="text-[9px] text-[#00E676] font-bold uppercase mt-1 block">+{stats.newRegistrationsToday} Today</span>
              </div>
              <div className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)]">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Online Users</span>
                <p className="text-2xl font-black text-[#FF2E93] mt-1">{stats.onlineUsers}</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase mt-1 block">Live Active Now</span>
              </div>
              <div className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)]">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Active Subscriptions</span>
                <p className="text-2xl font-black text-white mt-1">{stats.activeSubscriptionsCount}</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase mt-1 block">{stats.expiredPlans} Expired</span>
              </div>
              <div className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)]">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Pending Payments</span>
                <p className="text-2xl font-black text-[#FFD600] mt-1">{stats.pendingPayments}</p>
                <span className="text-[9px] text-[#FFD600] font-bold uppercase mt-1 block">Awaiting UPI verify</span>
              </div>
              <div className="glass-card p-5 bg-[#16161F] border-[rgba(255,255,255,0.06)]">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Total Revenue</span>
                <p className="text-2xl font-black text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                <span className="text-[9px] text-green-400 font-bold uppercase mt-1 block">₹{stats.revenueThisMonth.toLocaleString()} This Month</span>
              </div>
            </div>

            {/* Real-time Interactive Animated SVG Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily / Monthly Revenue Growth Chart */}
              <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Daily Revenue Trend</h3>
                  <span className="text-[10px] text-[#FF2E93] font-bold uppercase">Live Performance</span>
                </div>
                <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-white/5">
                  {[450, 780, 1200, 950, 1500, 2100, 2800].map((val, idx) => {
                    const pct = Math.round((val / 2800) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[8px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">₹{val}</span>
                        <div className="w-full bg-[#FF2E93] rounded-t-lg transition-all duration-500 hover:brightness-125" style={{ height: `${pct}%` }}></div>
                        <span className="text-[8px] text-gray-500 font-bold uppercase">Day {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Growth & Payment Success Rate */}
              <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Payment Success Rate</h3>
                  <span className="text-[10px] text-green-400 font-bold uppercase">94.8% Success Rate</span>
                </div>
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Successful Payments</span>
                      <span className="text-green-400">{stats.successfulPayments} Orders</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Pending Manual Verifications</span>
                      <span className="text-[#FFD600]">{stats.pendingPayments} Orders</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-[#FFD600] h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Failed / Declined</span>
                      <span className="text-red-400">{stats.failedPayments} Orders</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. USER MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div className="space-y-6">
            
            {/* Create New Administrator Account Form */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2 flex items-center justify-between">
                <span>Create New Administrator Account</span>
                <span className="text-[10px] text-[#FF2E93] font-mono">Role Access Control</span>
              </h3>
              <form onSubmit={handleCreateNewAdmin} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs font-semibold">
                <div>
                  <label className="block text-gray-400 mb-1">Admin Email / UID</label>
                  <input
                    type="text"
                    required
                    value={newAdminUid}
                    onChange={(e) => setNewAdminUid(e.target.value)}
                    placeholder="shekara727@gmail.com"
                    className="glass-input w-full rounded-xl py-2 px-3 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Nickname</label>
                  <input
                    type="text"
                    value={newAdminNickname}
                    onChange={(e) => setNewAdminNickname(e.target.value)}
                    placeholder="Shekara Admin"
                    className="glass-input w-full rounded-xl py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Console Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input w-full rounded-xl py-2 px-3 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Assign Role</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as any)}
                    className="bg-[#0B0B0F] border border-white/10 rounded-xl px-3 py-2 text-white font-bold w-full uppercase text-xs"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="support_staff">Support Staff</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="pink-btn w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs">
                    + Add Admin
                  </button>
                </div>
              </form>
            </div>

            {/* User & Admin Accounts List */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">User & Admin Account Directory</h2>
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Search by UID, Nickname, Email, or Role..."
                  className="glass-input py-2 px-3 text-xs w-full sm:w-80 rounded-xl text-white"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3">Player / Admin (UID)</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Current Plan</th>
                      <th className="py-3">Reg Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                    {filteredUsers.map((u) => {
                      const activeSub = u.subscriptions?.find((s: any) => s.status === "active");
                      return (
                        <tr key={u.id} className="text-gray-300">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar_url} alt={u.nickname} className="h-8 w-8 rounded-full border border-[#FF2E93]" />
                              <div>
                                <p className="font-bold text-white flex items-center gap-1">
                                  {u.nickname || "User"}
                                  {u.admin_password && <span className="text-[8px] bg-yellow-950 text-yellow-400 px-1.5 py-0.5 rounded font-mono uppercase">Passkey Set</span>}
                                </p>
                                <span className="text-[9px] text-gray-500 font-mono">UID/Email: {u.uid}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <select
                              value={u.role || "user"}
                              onChange={(e) => handleUserAction(u.id, "change_role", e.target.value)}
                              className="bg-[#0B0B0F] border border-white/10 rounded px-2 py-1 text-[10px] text-white font-bold uppercase"
                            >
                              <option value="user">User</option>
                              <option value="support_staff">Support Staff</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          </td>
                          <td className="py-3">
                            <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${activeSub ? "bg-[#FF2E93]/20 text-[#FF2E93]" : "bg-gray-800 text-gray-400"}`}>
                              {activeSub ? activeSub.plans?.name : "No Plan"}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400 text-[10px] font-mono">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${u.is_banned ? "bg-red-950 text-red-400" : "bg-green-950 text-[#00E676]"}`}>
                              {u.is_banned ? "Banned" : "Active"}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1">
                            <button onClick={() => setSelectedUserForView(u)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold">View Profile</button>
                            <button onClick={() => handleUserAction(u.id, "change_password")} className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-purple-200 rounded text-[10px] font-bold">Change Password</button>
                            <button onClick={() => handleUserAction(u.id, "activate_plan")} className="px-2.5 py-1 bg-[#FF2E93] text-white rounded text-[10px] font-bold">Activate Plan</button>
                            {u.is_banned ? (
                              <button onClick={() => handleUserAction(u.id, "unban")} className="px-2 py-1 bg-green-900 text-white rounded text-[10px] font-bold">Unban</button>
                            ) : (
                              <button onClick={() => handleUserAction(u.id, "ban_temp")} className="px-2 py-1 bg-red-900 text-white rounded text-[10px] font-bold">Ban</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PLANS & COUPONS MANAGEMENT TAB */}
        {activeTab === "plans" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create/Edit Plan Form */}
            <div className="lg:col-span-5 glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">
                {editingPlanId ? "Edit Subscription Plan" : "Create New Subscription Plan"}
              </h3>
              <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">Plan Name</label>
                  <input type="text" required value={planName} onChange={(e) => setPlanName(e.target.value)} className="glass-input w-full rounded-lg py-2 px-3 text-white" placeholder="e.g. 30 Days Pro" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-400 mb-1">Price (₹)</label>
                    <input type="number" required value={planPrice} onChange={(e) => setPlanPrice(Number(e.target.value))} className="glass-input w-full rounded-lg py-2 px-3 text-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 mb-1">Duration (Days)</label>
                    <input type="number" required value={planDuration} onChange={(e) => setPlanDuration(Number(e.target.value))} className="glass-input w-full rounded-lg py-2 px-3 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-400 mb-1">Daily Delivery</label>
                    <input type="number" value={planDailyDelivery} onChange={(e) => setPlanDailyDelivery(Number(e.target.value))} className="glass-input w-full rounded-lg py-2 px-3 text-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 mb-1">Delivery Time</label>
                    <input type="text" value={planDeliveryTime} onChange={(e) => setPlanDeliveryTime(e.target.value)} className="glass-input w-full rounded-lg py-2 px-3 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-gray-400 mb-1">Features (Comma separated)</label>
                  <textarea rows={2} value={planFeatures} onChange={(e) => setPlanFeatures(e.target.value)} className="glass-input w-full rounded-lg py-2 px-3 text-white resize-none" placeholder="30 Days Active, Total Likes: 6600, Daily Load: 220" />
                </div>
                <button type="submit" className="pink-btn w-full py-2.5 rounded-xl font-bold uppercase tracking-wider">Save Plan</button>
              </form>
            </div>

            {/* Active Plans List & Coupon Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">Active Subscription Plans</h3>
                <div className="space-y-2">
                  {plansList.map((p) => (
                    <div key={p.id} className="p-3 bg-[#0B0B0F] rounded-xl border border-[rgba(255,255,255,0.04)] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        <span className="text-[10px] text-gray-500 font-mono">₹{p.price} / {p.duration_days} Days ({p.daily_delivery || 220} Daily)</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPlanId(p.id); setPlanName(p.name); setPlanPrice(p.price); setPlanDuration(p.duration_days); setPlanFeatures((p.features || []).join(", ")); }} className="px-2.5 py-1 bg-white/5 rounded text-[10px] font-bold">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Management Form */}
              <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">Create Discount Coupon</h3>
                <form onSubmit={handleCreateCoupon} className="flex gap-3 text-xs">
                  <input type="text" required placeholder="Coupon Code (e.g. FLASH20)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="glass-input rounded-xl py-2 px-3 text-white flex-1" />
                  <input type="number" required placeholder="Discount %" value={couponDiscount} onChange={(e) => setCouponDiscount(Number(e.target.value))} className="glass-input rounded-xl py-2 px-3 text-white w-28" />
                  <button type="submit" className="pink-btn px-4 py-2 rounded-xl font-bold uppercase">Create</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 4. PAYMENTS & VERIFICATION TAB */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Manual UPI Verification Queue</h2>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={searchUtr}
                    onChange={(e) => setSearchUtr(e.target.value)}
                    placeholder="Search by UTR Number, UID or Name..."
                    className="glass-input w-full py-2 px-3 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              {pendingOrders.filter(o => 
                !searchUtr || 
                (o.utr_number && o.utr_number.toLowerCase().includes(searchUtr.toLowerCase())) ||
                (o.profiles?.uid && o.profiles.uid.toLowerCase().includes(searchUtr.toLowerCase())) ||
                (o.profiles?.nickname && o.profiles.nickname.toLowerCase().includes(searchUtr.toLowerCase()))
              ).length === 0 ? (
                <p className="text-xs text-gray-500 py-8 text-center font-bold uppercase">
                  {searchUtr ? "No matching UTR payments found." : "No pending payments in queue."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.06)] text-gray-400 font-bold uppercase">
                        <th className="py-2">User (UID)</th>
                        <th className="py-2">Plan</th>
                        <th className="py-2">UTR Number</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                      {pendingOrders
                        .filter(o => 
                          !searchUtr || 
                          (o.utr_number && o.utr_number.toLowerCase().includes(searchUtr.toLowerCase())) ||
                          (o.profiles?.uid && o.profiles.uid.toLowerCase().includes(searchUtr.toLowerCase())) ||
                          (o.profiles?.nickname && o.profiles.nickname.toLowerCase().includes(searchUtr.toLowerCase()))
                        )
                        .map((o) => (
                          <tr key={o.id} className="text-gray-300">
                            <td className="py-3 font-bold text-white">{o.profiles?.nickname} (UID: {o.profiles?.uid})</td>
                            <td className="py-3">{o.plans?.name}</td>
                            <td className="py-3 font-mono font-bold text-white">{o.utr_number}</td>
                            <td className="py-3 font-bold text-[#FF2E93]">₹{o.amount}</td>
                            <td className="py-3 text-right">
                              <button onClick={() => setVerifyingOrder(o)} className="pink-btn py-1 px-3 rounded text-[10px] font-bold">Verify Screenshot</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. API SETTINGS TAB */}
        {activeTab === "api" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] max-w-3xl mx-auto space-y-6">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-3">
              <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider">Future Integration Gateway</span>
              <h2 className="text-base font-bold text-white mt-0.5 uppercase">API Configuration Settings</h2>
            </div>

            <form onSubmit={handleSaveApiSettings} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-400 mb-1 uppercase font-bold">API URL Endpoint (Use {"{UID}"} for dynamic replacement)</label>
                <input
                  type="text"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  placeholder="https://flash-player-info.onrender.com/player-info?uid={UID}&key=Flash"
                  className="glass-input w-full rounded-xl py-2.5 px-3 text-white font-mono text-xs"
                />
                <p className="text-[10px] text-gray-500 mt-1">Default: <code className="text-[#FF2E93]">https://flash-player-info.onrender.com/player-info?uid=&#123;UID&#125;&key=Flash</code></p>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 uppercase font-bold">API Authorization Key</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Insert secret API key..."
                  className="glass-input w-full rounded-xl py-2.5 px-3 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0B0B0F] rounded-xl border border-[rgba(255,255,255,0.04)]">
                <div>
                  <p className="text-white font-bold">Enable API Integration Mode</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Automatically route UID lookups and delivery progress to API</p>
                </div>
                <input
                  type="checkbox"
                  checked={apiEnabledState}
                  onChange={(e) => setApiEnabledState(e.target.checked)}
                  className="h-5 w-5 rounded bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer"
                />
              </div>

              {apiTestResult && (
                <div className={`p-3 rounded-xl text-xs font-bold border ${apiTestResult.success ? "bg-green-950/40 text-green-400 border-green-900" : "bg-red-950/40 text-red-400 border-red-900"}`}>
                  <p>{apiTestResult.message}</p>
                  <span className="text-[9px] opacity-75">Response Time: {apiTestResult.time}ms</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="pink-btn flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider">Save API Configuration</button>
                <button type="button" onClick={handleTestApi} disabled={testingApi} className="outline-btn px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider">
                  {testingApi ? "Testing..." : "Test Connection"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ACCOUNT INFORMATION INSPECTOR TAB */}
        {activeTab === "account_info" && (
          <div className="space-y-6 animate-fade-in">
            <AccountInfoModule initialUid="1904263999" showSearchHeader={true} />
          </div>
        )}

        {/* 6. PROOF GALLERY MANAGEMENT TAB */}
        {activeTab === "proofs" && (
          <div className="space-y-6">
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">Upload Proof Showcase Media</h3>
              <form onSubmit={handleCreateProof} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input type="text" required placeholder="Proof Title (e.g. 1200 Likes delivered)" value={newProofTitle} onChange={(e) => setNewProofTitle(e.target.value)} className="glass-input rounded-xl py-2 px-3 text-white" />
                <input type="url" required placeholder="Image/Video URL" value={newProofUrl} onChange={(e) => setNewProofUrl(e.target.value)} className="glass-input rounded-xl py-2 px-3 text-white" />
                <select value={newProofType} onChange={(e) => setNewProofType(e.target.value as any)} className="bg-[#0B0B0F] border border-white/10 rounded-xl px-3 py-2 text-white font-bold">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <button type="submit" className="pink-btn py-2 rounded-xl font-bold uppercase">Upload Proof</button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {galleryList.map((g) => (
                <div key={g.id} className="glass-card p-3 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-2 relative">
                  <img src={g.url} alt={g.title} className="h-32 w-full object-cover rounded-lg bg-black" />
                  <p className="text-xs font-bold text-white truncate">{g.title}</p>
                  <div className="flex items-center justify-between text-[10px] font-bold pt-1 gap-1">
                    <button type="button" onClick={() => handleToggleProofVisibility(g.id, g.is_visible !== false)} className={`px-2 py-0.5 rounded ${g.is_visible !== false ? "bg-green-950 text-green-400 border border-green-800" : "bg-gray-800 text-gray-400"}`}>
                      {g.is_visible !== false ? "Visible" : "Hidden"}
                    </button>
                    <button type="button" onClick={() => handleToggleProofFeatured(g.id, !!g.is_featured)} className={`px-2 py-0.5 rounded ${g.is_featured ? "bg-[#FF2E93] text-white" : "bg-gray-800 text-gray-400"}`}>
                      {g.is_featured ? "Featured" : "Standard"}
                    </button>
                    <button type="button" onClick={() => handleDeleteProof(g.id)} className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded hover:bg-red-600 hover:text-white transition-all">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ANNOUNCEMENTS TAB */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4 max-w-3xl mx-auto">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">Broadcast System Announcement</h3>
              <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                <input type="text" required placeholder="Announcement Title" value={ancTitle} onChange={(e) => setAncTitle(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                <textarea rows={3} required placeholder="Announcement Content Message..." value={ancContent} onChange={(e) => setAncContent(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Home Banner Text (Optional)" value={ancBannerText} onChange={(e) => setAncBannerText(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  <select value={ancType} onChange={(e) => setAncType(e.target.value as any)} className="bg-[#0B0B0F] border border-white/10 rounded-xl px-3 py-2 text-white font-bold">
                    <option value="popup">Popup Modal</option>
                    <option value="banner">Home Banner</option>
                    <option value="offer">Special Offer</option>
                    <option value="maintenance">Maintenance Notice</option>
                    <option value="notification">Notification</option>
                  </select>
                </div>
                <button type="submit" className="pink-btn w-full py-2.5 rounded-xl font-bold uppercase">Publish Announcement</button>
              </form>
            </div>
          </div>
        )}

        {/* 8. SUPPORT TICKETS TAB */}
        {activeTab === "tickets" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">Support Ticket Console</h3>
            <div className="space-y-2">
              {ticketsList.map((t) => (
                <div key={t.id} className="p-3 bg-[#0B0B0F] rounded-xl border border-[rgba(255,255,255,0.04)] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{t.subject}</p>
                    <span className="text-[9px] text-gray-500 font-mono">User: {t.profiles?.nickname} | {new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${t.status === "closed" ? "bg-gray-800 text-gray-400" : "bg-[#FF2E93]/20 text-[#FF2E93]"}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. WEBSITE SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] max-w-4xl mx-auto space-y-6">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-3">
              <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider">Site Administration</span>
              <h2 className="text-base font-bold text-white mt-0.5 uppercase">Website & Bot Settings</h2>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-semibold">
              
              {/* Category 1: Live Bot Statistics */}
              <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-3">
                <span className="text-[10px] font-bold text-[#FF2E93] uppercase block">1. Live Bot Statistics (Realtime Synced)</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Registered Members</label>
                    <input type="number" value={registeredMembersInput} onChange={(e) => setRegisteredMembersInput(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Active Members</label>
                    <input type="number" value={activeMembersInput} onChange={(e) => setActiveMembersInput(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Bot Status</label>
                    <select value={botStatusInput} onChange={(e) => setBotStatusInput(e.target.value)} className="bg-[#16161F] border border-white/10 rounded-xl px-3 py-2 text-white font-bold w-full">
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Online Users Min</label>
                    <input type="number" value={onlineUsersMinInput} onChange={(e) => setOnlineUsersMinInput(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Online Users Max</label>
                    <input type="number" value={onlineUsersMaxInput} onChange={(e) => setOnlineUsersMaxInput(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Today&apos;s Deliveries</label>
                    <input type="number" value={todaysDeliveriesInput} onChange={(e) => setTodaysDeliveriesInput(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Category 2: Branding Assets & Images */}
              <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-3">
                <span className="text-[10px] font-bold text-[#FF2E93] uppercase block">2. Branding Images & Custom Assets</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Website Logo URL</label>
                    <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Favicon URL</label>
                    <input type="url" value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Hero Banner Image URL</label>
                    <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Background Image URL</label>
                    <input type="url" value={backgroundImageUrl} onChange={(e) => setBackgroundImageUrl(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* Category 3: Homepage Content & Copy */}
              <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-3">
                <span className="text-[10px] font-bold text-[#FF2E93] uppercase block">3. Homepage & Support Content</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Website Title</label>
                    <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Telegram Handle</label>
                    <input type="text" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                  </div>
                </div>
              </div>

               {/* Category 4: Payment Gateway Configuration */}
               <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-3">
                 <span className="text-[10px] font-bold text-[#FF2E93] uppercase block">4. Payment Gateway Settings & Controls</span>
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-gray-400 mb-1">UPI ID</label>
                     <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white font-mono" />
                   </div>
                   <div>
                     <label className="block text-gray-400 mb-1">QR Code Image URL</label>
                     <input type="text" value={qrCodeUrl} onChange={(e) => setQrCodeUrl(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" />
                   </div>
                   <div>
                     <label className="block text-gray-400 mb-1">Razorpay Key ID</label>
                     <input type="text" value={razorpayKeyId} onChange={(e) => setRazorpayKeyId(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white font-mono" />
                   </div>
                   <div>
                     <label className="block text-gray-400 mb-1">Razorpay Key Secret</label>
                     <input type="password" value={razorpayKeySecret} onChange={(e) => setRazorpayKeySecret(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white font-mono" />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                   <div className="flex items-center justify-between p-2.5 bg-[#16161F] rounded-xl border border-white/5">
                     <span className="text-xs font-bold text-white">Razorpay Active</span>
                     <input type="checkbox" checked={razorpayEnabled} onChange={(e) => setRazorpayEnabled(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                   </div>
                   <div className="flex items-center justify-between p-2.5 bg-[#16161F] rounded-xl border border-white/5">
                     <span className="text-xs font-bold text-white">Manual UPI Active</span>
                     <input type="checkbox" checked={upiEnabled} onChange={(e) => setUpiEnabled(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                   </div>
                   <div className="flex items-center justify-between p-2.5 bg-[#16161F] rounded-xl border border-white/5">
                     <span className="text-xs font-bold text-white">Maintenance Mode</span>
                     <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                   </div>
                 </div>
               </div>
 
               {/* Category 4.5: Telegram Bot Configurations */}
               <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-3">
                 <span className="text-[10px] font-bold text-[#FF2E93] uppercase block">4.5. Telegram Bot Alerts & Credentials</span>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <div>
                     <label className="block text-gray-400 mb-1">Telegram Bot Token</label>
                     <input type="text" value={telegramBotToken} onChange={(e) => setTelegramBotToken(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white font-mono" placeholder="123456:ABC-..." />
                   </div>
                   <div>
                     <label className="block text-gray-400 mb-1">Telegram Chat ID (Admin Group)</label>
                     <input type="text" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white font-mono" placeholder="-100..." />
                   </div>
                   <div>
                     <label className="block text-gray-400 mb-1">Telegram Channel Link (Join Required)</label>
                     <input type="url" value={telegramChannelLink} onChange={(e) => setTelegramChannelLink(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white" placeholder="https://t.me/..." />
                   </div>
                 </div>
               </div>

              {/* Category 5: Realtime CSS Theme Customization */}
              <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <span className="text-[10px] font-bold text-[#FF2E93] uppercase block">5. Realtime Theme Color Customization</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyThemePreset("pink")} className="px-3 py-1 bg-pink-950 text-pink-400 border border-pink-850 rounded-lg text-[10px] font-bold uppercase hover:bg-pink-600 hover:text-white transition-all">
                      Pink
                    </button>
                    <button type="button" onClick={() => applyThemePreset("dark")} className="px-3 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded-lg text-[10px] font-bold uppercase hover:bg-indigo-600 hover:text-white transition-all">
                      Dark
                    </button>
                    <button type="button" onClick={() => applyThemePreset("black")} className="px-3 py-1 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg text-[10px] font-bold uppercase hover:bg-gray-600 hover:text-white transition-all">
                      Black
                    </button>
                    <button type="button" onClick={() => applyThemePreset("purple")} className="px-3 py-1 bg-purple-950 text-purple-400 border border-purple-800 rounded-lg text-[10px] font-bold uppercase hover:bg-purple-600 hover:text-white transition-all">
                      Purple
                    </button>
                    <button type="button" onClick={() => applyThemePreset("blue")} className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg text-[10px] font-bold uppercase hover:bg-cyan-600 hover:text-white transition-all">
                      Blue
                    </button>
                    <button type="button" onClick={() => applyThemePreset("red")} className="px-3 py-1 bg-red-950 text-red-400 border border-red-800 rounded-lg text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all">
                      Red
                    </button>
                    <button type="button" onClick={() => applyThemePreset("green")} className="px-3 py-1 bg-green-950 text-green-400 border border-green-800 rounded-lg text-[10px] font-bold uppercase hover:bg-green-600 hover:text-white transition-all">
                      Green
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Primary Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={primaryColorInput} onChange={(e) => setPrimaryColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={primaryColorInput} onChange={(e) => setPrimaryColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Secondary Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={secondaryColorInput} onChange={(e) => setSecondaryColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={secondaryColorInput} onChange={(e) => setSecondaryColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={bgColorInput} onChange={(e) => setBgColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={bgColorInput} onChange={(e) => setBgColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Card Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={cardColorInput} onChange={(e) => setCardColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={cardColorInput} onChange={(e) => setCardColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Button Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={buttonColorInput} onChange={(e) => setButtonColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={buttonColorInput} onChange={(e) => setButtonColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Navigation Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={navColorInput} onChange={(e) => setNavColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={navColorInput} onChange={(e) => setNavColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Footer Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={footerColorInput} onChange={(e) => setFooterColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={footerColorInput} onChange={(e) => setFooterColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={textColorInput} onChange={(e) => setTextColorInput(e.target.value)} className="h-8 w-12 rounded bg-transparent cursor-pointer" />
                      <input type="text" value={textColorInput} onChange={(e) => setTextColorInput(e.target.value)} className="glass-input w-full rounded-lg py-1 px-2 text-white font-mono text-[11px]" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="pink-btn w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-[#FF2E93]/20">
                Save All Website & Theme Settings
              </button>
            </form>
          </div>
        )}

        {/* NEWS ARTICLES TAB */}
        {activeTab === "news" && (
          <div className="space-y-6">
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">
                {editingNewsId ? "Edit Press Release / News Article" : "Create News / Press Article"}
              </h3>
              
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Title</label>
                    <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" placeholder="Article Title" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Category</label>
                    <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs bg-[#0B0B0F]">
                      <option value="gaming">Gaming News</option>
                      <option value="technology">Tech News</option>
                      <option value="ai">AI News</option>
                      <option value="weather">Weather</option>
                      <option value="share_market">Share Market</option>
                      <option value="crypto">Crypto</option>
                      <option value="sports">Sports</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Thumbnail Image URL</label>
                    <input type="url" value={newsThumbnail} onChange={(e) => setNewsThumbnail(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Video Coverage URL (Optional)</label>
                    <input type="url" value={newsVideoUrl} onChange={(e) => setNewsVideoUrl(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" placeholder="https://youtube.com/..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Author Name</label>
                    <input type="text" value={newsAuthor} onChange={(e) => setNewsAuthor(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Tags (comma separated)</label>
                    <input type="text" value={newsTags} onChange={(e) => setNewsTags(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" placeholder="gaming, ff, updates" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Reading Time (minutes)</label>
                    <input type="number" value={newsReadingTime} onChange={(e) => setNewsReadingTime(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" min={1} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Short Summary / Teaser</label>
                  <textarea value={newsDescription} onChange={(e) => setNewsDescription(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs h-16" placeholder="A short description..." />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Article Body Content (Markdown/Raw text)</label>
                  <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs h-48 font-mono" placeholder="Write full article here..." />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0B0F] rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status Published</span>
                    <input type="checkbox" checked={newsStatus === "published"} onChange={(e) => setNewsStatus(e.target.checked ? "published" : "draft")} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0B0F] rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Pin Article</span>
                    <input type="checkbox" checked={newsIsPinned} onChange={(e) => setNewsIsPinned(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0B0F] rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Featured Banner</span>
                    <input type="checkbox" checked={newsIsFeatured} onChange={(e) => setNewsIsFeatured(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0B0F] rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Breaking Alert</span>
                    <input type="checkbox" checked={newsIsBreaking} onChange={(e) => setNewsIsBreaking(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0B0F] rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Trending List</span>
                    <input type="checkbox" checked={newsIsTrending} onChange={(e) => setNewsIsTrending(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  {editingNewsId && (
                    <button type="button" onClick={() => {
                      setEditingNewsId(null);
                      setNewsTitle("");
                      setNewsThumbnail("");
                      setNewsDescription("");
                      setNewsContent("");
                      setNewsTags("");
                      setNewsVideoUrl("");
                    }} className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="pink-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    {editingNewsId ? "Update Article" : "Publish Article"}
                  </button>
                </div>
              </form>
            </div>

            {/* Articles List */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Articles Library</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-bold uppercase">
                      <th className="py-2.5">Article Details</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5 text-center">Views</th>
                      <th className="py-2.5 text-center">Likes</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsList.map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 text-gray-300">
                        <td className="py-3 pr-2 max-w-xs">
                          <span className="font-bold text-white block uppercase truncate">{item.title}</span>
                          <span className="text-[10px] text-gray-500 font-mono">By {item.author_name} • {new Date(item.published_at).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3 uppercase text-[10px] text-pink-400 font-bold">{item.category}</td>
                        <td className="py-3 text-center font-mono">{item.views || 0}</td>
                        <td className="py-3 text-center font-mono">{item.likes || 0}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${item.status === 'published' ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button onClick={() => handleEditNews(item)} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded font-bold uppercase text-[9px] tracking-wider text-gray-300">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteNews(item.id)} className="px-2 py-1 bg-red-950 hover:bg-red-900 rounded font-bold uppercase text-[9px] tracking-wider text-red-400 border border-red-900/50">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SHORT LINKS TAB */}
        {activeTab === "links" && (
          <div className="space-y-6">
            {/* Create Short Link Form */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">
                {editingLinkId ? "Edit Short Link Configuration" : "Generate Short Link & Verification Sequence"}
              </h3>
              
              <form onSubmit={handleSaveLink} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Target Original URL (Destination)</label>
                    <input type="url" value={linkOriginalUrl} onChange={(e) => setLinkOriginalUrl(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs font-mono" placeholder="https://google.com/myfile.zip" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Link Title (For Reference)</label>
                    <input type="text" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" placeholder="e.g. Free Fire Mod File" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Link Expiry Period</label>
                    <select value={linkExpiry} onChange={(e) => setLinkExpiry(e.target.value)} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs bg-[#0B0B0F]">
                      <option value="10m">10 Minutes</option>
                      <option value="30m">30 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="12h">12 Hours</option>
                      <option value="24h">24 Hours</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days</option>
                      <option value="lifetime">Lifetime (No Expiry)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Countdown Duration (seconds)</label>
                    <input type="number" value={linkCountdown} onChange={(e) => setLinkCountdown(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" min={5} max={60} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Verification Steps (1–10 pages)</label>
                    <input type="number" value={linkPageCount} onChange={(e) => setLinkPageCount(Number(e.target.value))} className="glass-input w-full rounded-xl py-2 px-3 text-white text-xs" min={1} max={10} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0B0F] rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-white block">Ad Network Integrations</span>
                      <p className="text-[10px] text-gray-500">Inject banner/direct links ads inside sequence</p>
                    </div>
                    <input type="checkbox" checked={linkAdsEnabled} onChange={(e) => setLinkAdsEnabled(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0B0F] rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-white block">Verify Telegram Channel Join</span>
                      <p className="text-[10px] text-gray-500">Forces user to join channel to unlock target URL</p>
                    </div>
                    <input type="checkbox" checked={linkTgJoinCheck} onChange={(e) => setLinkTgJoinCheck(e.target.checked)} className="h-4.5 w-4.5 bg-[#0B0B0F] text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer" />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  {editingLinkId && (
                    <button type="button" onClick={() => {
                      setEditingLinkId(null);
                      setLinkOriginalUrl("");
                      setLinkTitle("");
                      setLinkExpiry("24h");
                      setLinkCountdown(15);
                      setLinkPageCount(3);
                      setLinkAdsEnabled(true);
                      setLinkTgJoinCheck(false);
                    }} className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="pink-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    {editingLinkId ? "Update Link Settings" : "Generate Shortened URL"}
                  </button>
                </div>
              </form>
            </div>

            {/* Links Library List */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Short Links Library & Analytics</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-bold uppercase">
                      <th className="py-2.5">Shortened Path</th>
                      <th className="py-2.5">Target Destination</th>
                      <th className="py-2.5 text-center">Countdown</th>
                      <th className="py-2.5 text-center">Steps</th>
                      <th className="py-2.5 text-center">Clicks</th>
                      <th className="py-2.5">Expires At</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linksList.map((item) => {
                      const linkUrl = typeof window !== "undefined" ? `${window.location.origin}/l/${item.code}` : `/l/${item.code}`;
                      return (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 text-gray-300">
                          <td className="py-3">
                            <span className="font-bold text-white block uppercase font-mono">{item.code}</span>
                            <a href={linkUrl} target="_blank" className="text-[10px] text-pink-400 font-mono hover:underline">{linkUrl}</a>
                          </td>
                          <td className="py-3 pr-2 max-w-xs">
                            <span className="font-bold text-white block truncate uppercase">{item.title}</span>
                            <span className="text-[10px] text-gray-500 font-mono truncate block">{item.original_url}</span>
                          </td>
                          <td className="py-3 text-center font-mono">{item.countdown_seconds}s</td>
                          <td className="py-3 text-center font-mono">{item.page_count} Pages</td>
                          <td className="py-3 text-center font-mono text-yellow-400 font-bold">{item.click_count || 0}</td>
                          <td className="py-3">
                            <span className="text-[10px] font-mono block">
                              {item.expires_at ? new Date(item.expires_at).toLocaleString() : "Never"}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => {
                              navigator.clipboard.writeText(linkUrl);
                              alert("Copied short URL to clipboard!");
                            }} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded font-bold uppercase text-[9px] tracking-wider text-pink-400">
                              Copy
                            </button>
                            <button onClick={() => handleEditLink(item)} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded font-bold uppercase text-[9px] tracking-wider text-gray-300">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteLink(item.id)} className="px-2 py-1 bg-red-950 hover:bg-red-900 rounded font-bold uppercase text-[9px] tracking-wider text-red-400 border border-red-900/50">
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 10. AUDIT LOGS TAB */}
        {activeTab === "logs" && (
          <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-2">Platform Activity Audit Trail</h3>
            <div className="space-y-2">
              {activityLogsList.map((log) => (
                <div key={log.id} className="p-3 bg-[#0B0B0F] rounded-xl border border-[rgba(255,255,255,0.04)] text-xs flex justify-between">
                  <div>
                    <span className="font-bold text-white uppercase">{log.action}</span>
                    <p className="text-[10px] text-gray-500 font-mono">User: {log.profiles?.nickname || log.user_id}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{new Date(log.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Side-by-Side Verification Modal Overlay */}
      {verifyingOrder && (
        <div className="fixed inset-0 bg-[#0B0B0F]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative glass-card max-w-4xl w-full bg-[#16161F] border-[rgba(255,255,255,0.08)] flex flex-col max-h-[90vh]">
            <button onClick={() => setVerifyingOrder(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer z-10">
              <X className="h-5 w-5" />
            </button>
            <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
              <h3 className="text-base font-bold text-white">Verifying Payment: <span className="font-mono text-[#FF2E93]">{verifyingOrder.utr_number || "No UTR"}</span></h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              <div className="space-y-4 text-xs">
                <div className="space-y-2 p-3 bg-[#0B0B0F] rounded-xl border border-white/5 font-semibold">
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">Player Nickname:</span> <strong className="text-white">{verifyingOrder.profiles?.nickname || "N/A"}</strong></p>
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">Free Fire UID:</span> <strong className="text-[#FF2E93] font-mono">{verifyingOrder.profiles?.uid || verifyingOrder.user_id}</strong></p>
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">Selected Plan:</span> <strong className="text-white">{verifyingOrder.plans?.name || "Plan"}</strong></p>
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">Total Amount:</span> <strong className="text-green-400 font-black text-sm">₹{verifyingOrder.amount}</strong></p>
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">UTR Reference:</span> <strong className="text-white font-mono">{verifyingOrder.utr_number}</strong></p>
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">Submitted Date:</span> <strong className="text-gray-300 font-mono">{new Date(verifyingOrder.created_at).toLocaleString()}</strong></p>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Rejection Reason (if declining)</label>
                  <input type="text" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="glass-input w-full rounded-xl py-2.5 px-3 text-white" placeholder="Invalid UTR or unreadable screenshot..." />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex gap-3">
                    <button onClick={() => handleApprovePayment(verifyingOrder)} className="pink-btn flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-wider cursor-pointer shadow-lg shadow-[#FF2E93]/20">Approve Payment</button>
                    <button onClick={() => handleRejectPayment(verifyingOrder)} className="bg-red-950 hover:bg-red-900 text-red-400 flex-1 py-3 rounded-xl font-bold uppercase text-xs border border-red-900 cursor-pointer">Decline Payment</button>
                  </div>
                  
                  {verifyingOrder.screenshot_url && (
                    <button 
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this payment screenshot from the database?")) {
                          await supabase.from("orders").update({ screenshot_url: null }).eq("id", verifyingOrder.id);
                          await supabase.from("manual_payments").update({ screenshot_url: null }).eq("utr", verifyingOrder.utr_number);
                          setVerifyingOrder({ ...verifyingOrder, screenshot_url: null });
                        }
                      }}
                      className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-red-400 rounded-xl text-[10px] font-bold uppercase border border-white/5 transition-all"
                    >
                      Delete Screenshot Record
                    </button>
                  )}
                </div>
              </div>

              {/* Screenshot Preview Box with Download & Open in Tab Controls */}
              <div className="bg-[#0B0B0F] p-4 rounded-xl flex flex-col items-center justify-between border border-white/5 min-h-[300px] space-y-3">
                {verifyingOrder.screenshot_url ? (
                  <>
                    <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-black/60 p-2">
                      <img src={verifyingOrder.screenshot_url} alt="Payment Screenshot" className="max-h-[280px] w-auto object-contain rounded-lg shadow-xl" />
                    </div>
                    <div className="flex gap-2 w-full pt-2">
                      <a
                        href={verifyingOrder.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 bg-[#16161F] hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center border border-white/10 transition-all flex items-center justify-center gap-1.5"
                      >
                        Open Full Image
                      </a>
                      <a
                        href={verifyingOrder.screenshot_url}
                        download={`payment_${verifyingOrder.utr_number || "screenshot"}.png`}
                        className="flex-1 py-2 px-3 bg-[#FF2E93]/20 hover:bg-[#FF2E93] text-[#FF2E93] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center border border-[#FF2E93]/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        Download Screenshot
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="my-auto text-center space-y-2">
                    <span className="text-xs text-gray-500 font-bold uppercase block">No Screenshot Uploaded</span>
                    <span className="text-[10px] text-gray-600 block">Only UTR reference submitted</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile View Modal Overlay */}
      {selectedUserForView && (
        <div className="fixed inset-0 bg-[#0B0B0F]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative glass-card max-w-lg w-full bg-[#16161F] border-[rgba(255,255,255,0.08)] p-6 space-y-4">
            <button onClick={() => setSelectedUserForView(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
              <img src={selectedUserForView.avatar_url} alt={selectedUserForView.nickname} className="h-16 w-16 rounded-full border-2 border-[#FF2E93]" />
              <div>
                <h3 className="text-lg font-black text-white uppercase">{selectedUserForView.nickname}</h3>
                <p className="text-xs font-mono text-gray-400">UID: {selectedUserForView.uid}</p>
                <span className="text-[10px] font-bold text-[#FF2E93] uppercase">Role: {selectedUserForView.role || "User"}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-gray-300">
              <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-500 uppercase block">Region</span>
                <span className="text-white">{selectedUserForView.region || "India"}</span>
              </div>
              <div className="bg-[#0B0B0F] p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-500 uppercase block">Registered Date</span>
                <span className="text-white font-mono">{new Date(selectedUserForView.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
