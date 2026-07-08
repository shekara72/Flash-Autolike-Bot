"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Bell, Menu, X, LogOut, LayoutDashboard, Shield, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [globalSearchInput, setGlobalSearchInput] = useState("");

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(globalSearchInput.trim())}`);
      setGlobalSearchInput("");
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    // Check session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Fetch user profile to get role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
        }
        fetchNotifications(session.user.id);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
        }
        fetchNotifications(session.user.id);
      } else {
        setUser(null);
        setUserRole("user");
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-header sticky top-0 z-50 w-full px-6 py-4 transition-all border-b-[rgba(255,255,255,0.06)]"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Minimalist Typography Logo with Pink Dot */}
        <Link href="/" className="flex items-center gap-1" id="header-logo-link">
          <span className="text-xl font-black tracking-tight text-white uppercase">
            FLASH AUTOLIKE<span className="text-[#FF2E93] text-2xl font-black">.</span>
          </span>
        </Link>

        {/* Desktop Global Search Bar */}
        <form onSubmit={handleGlobalSearch} className="hidden lg:flex items-center relative w-72 mx-4">
          <input
            type="text"
            placeholder="Search UID, News, Order ID, UTR..."
            value={globalSearchInput}
            onChange={(e) => setGlobalSearchInput(e.target.value)}
            className="w-full bg-[#0B0B0F]/90 border border-white/5 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93]/80 focus:ring-1 focus:ring-[#FF2E93]/20 transition-all"
          />
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-500" />
        </form>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-400">
          <Link href="/#features" className="hover:text-[#FF2E93] transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-[#FF2E93] transition-colors">How It Works</Link>
          <Link href="/#pricing" className="hover:text-[#FF2E93] transition-colors">Pricing</Link>
          <Link href="/#proof-gallery" className="hover:text-[#FF2E93] transition-colors">Proof Gallery</Link>
          <Link href="/#faq" className="hover:text-[#FF2E93] transition-colors">FAQ</Link>
          <Link href="/account-info" className="text-[#FF2E93] hover:underline font-bold text-xs uppercase tracking-wider flex items-center gap-1">
            <span>UID Lookup</span>
          </Link>
        </nav>

        {/* Right side Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 rounded-xl text-gray-400 hover:text-[#FF2E93] hover:bg-white/5 transition-all"
                  id="notifications-bell-btn"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-[#FF2E93]" />
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#16161F] p-4 shadow-xl z-50">
                    <div className="mb-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
                      <span className="font-bold text-white text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-[#FF2E93]/20 px-2 py-0.5 text-xs font-bold text-[#FF2E93]">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-xs text-gray-500">No new notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                              n.is_read ? "bg-white/2 text-gray-500" : "bg-[#FF2E93]/5 text-white border-l-2 border-[#FF2E93]"
                            }`}
                          >
                            <p className="text-xs font-bold text-gray-200">{n.title}</p>
                            <p className="text-[11px] mt-0.5 leading-relaxed text-gray-400">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>



              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 p-2 rounded-xl text-gray-400 hover:text-[#FF2E93] hover:bg-white/5 transition-all font-semibold text-xs uppercase tracking-wider"
                id="header-dashboard-link"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 p-2 rounded-xl text-gray-400 hover:text-[#FF2E93] hover:bg-white/5 transition-all font-semibold text-xs uppercase tracking-wider cursor-pointer"
                id="header-logout-btn"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-400 font-semibold hover:text-white transition-colors"
                id="header-login-link"
              >
                Sign In
              </Link>
              <Link
                href="/auth/login"
                className="pink-btn px-5 py-2.5 rounded-xl text-sm"
                id="header-register-link"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-gray-400 hover:bg-white/5 md:hidden"
          id="mobile-menu-toggle-btn"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[68px] left-0 w-full bg-[#0B0B0F]/95 border-b border-[rgba(255,255,255,0.06)] px-6 py-6 space-y-4 flex flex-col md:hidden z-40 backdrop-blur-md"
          >
            {/* Mobile Global Search Bar */}
            <form onSubmit={handleGlobalSearch} className="flex items-center relative w-full mb-2">
              <input
                type="text"
                placeholder="Search UID, News, Order ID, UTR..."
                value={globalSearchInput}
                onChange={(e) => setGlobalSearchInput(e.target.value)}
                className="w-full bg-[#16161F] border border-white/5 rounded-xl px-3 py-2 pl-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] transition-all"
              />
              <Search className="absolute left-3 h-4 w-4 text-gray-500" />
            </form>
            <Link
              href="/#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-400 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-400 hover:text-white"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-400 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/#proof-gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-400 hover:text-white"
            >
              Proof Gallery
            </Link>
            <Link
              href="/#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-400 hover:text-white"
            >
              FAQ
            </Link>
            <Link
              href="/account-info"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-bold text-[#FF2E93] hover:underline uppercase"
            >
              UID Lookup
            </Link>
            <hr className="border-[rgba(255,255,255,0.06)]" />
            {user ? (
              <div className="flex flex-col gap-3">

                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-semibold text-gray-400 hover:text-white"
                >
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-base font-semibold text-gray-400 hover:text-white text-left cursor-pointer"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center pink-btn px-4 py-2.5 rounded-xl font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
