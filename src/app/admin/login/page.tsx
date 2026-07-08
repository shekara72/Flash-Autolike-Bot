"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Home } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

function AdminLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (errorParam === "unauthorized") {
      setErrorMsg("Unauthorized access. Administrator privileges required.");
    }
  }, [errorParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // 1. Check for Default Master Admin Credentials (shekara727@gmail.com)
      if (cleanEmail === "shekara727@gmail.com" && cleanPassword === "shekara727@gmail.com") {
        if (typeof window !== "undefined") {
          localStorage.setItem("flash_autolike_admin_session", JSON.stringify({
            email: "shekara727@gmail.com",
            role: "super_admin",
            authenticated_at: new Date().toISOString()
          }));
          document.cookie = `flash_admin_session=super_admin; path=/; max-age=2592000; SameSite=Lax`;
        }

        // Upsert super_admin profile in database
        try {
          await supabase.from("profiles").upsert({
            uid: "ADMIN_SHEKARA",
            nickname: "Shekara Super Admin",
            role: "super_admin",
            is_banned: false
          }, { onConflict: "uid" });
        } catch (e) {}

        setSuccessMsg("Master Authorization successful! Opening Admin Console...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
        return;
      }

      // 2. Query Supabase profiles table for custom created Admin accounts
      const { data: dbProfiles } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["super_admin", "admin", "moderator", "support_staff"]);

      const matchedAdmin = dbProfiles?.find(
        (p: any) =>
          (p.nickname?.toLowerCase() === cleanEmail || p.uid?.toLowerCase() === cleanEmail) &&
          (p.admin_password ? p.admin_password === cleanPassword : true)
      );

      if (matchedAdmin) {
        if (typeof window !== "undefined") {
          localStorage.setItem("flash_autolike_admin_session", JSON.stringify({
            uid: matchedAdmin.uid,
            nickname: matchedAdmin.nickname,
            role: matchedAdmin.role,
            authenticated_at: new Date().toISOString()
          }));
          document.cookie = `flash_admin_session=${matchedAdmin.role}; path=/; max-age=2592000; SameSite=Lax`;
        }

        setSuccessMsg(`Welcome ${matchedAdmin.nickname}! Opening Admin Console...`);
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
        return;
      }

      // 3. Try standard Supabase Auth signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile && ["super_admin", "admin", "moderator", "support_staff"].includes(profile.role)) {
          if (typeof window !== "undefined") {
            localStorage.setItem("flash_autolike_admin_session", JSON.stringify({
              id: data.user.id,
              email: cleanEmail,
              role: profile.role,
              authenticated_at: new Date().toISOString()
            }));
          }
          setSuccessMsg("Authorization successful! Redirecting to dashboard...");
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 1000);
          return;
        }
      }

      throw new Error("Access Denied: Invalid administrator credentials or role.");

    } catch (err: any) {
      setErrorMsg(err.message || "Invalid administrator credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="glass-card w-full max-w-md p-8 md:p-10 bg-[#16161F] border-[rgba(255,255,255,0.06)] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[#FF2E93]/5 blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF2E93]/10 text-[#FF2E93] border border-[#FF2E93]/20 mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Admin Console</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Access secure dashboard tools</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-red-950/20 p-4 text-xs text-red-400 border border-red-900/50">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="font-bold leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-green-950/20 p-4 text-xs text-[#00E676] border border-green-900/50">
              <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="font-bold leading-relaxed">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Admin Email / Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full rounded-xl py-3 pl-11 pr-4 text-xs text-white"
                  placeholder="shekara727@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Console Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full rounded-xl py-3 pl-11 pr-4 text-xs text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pink-btn w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF2E93]/20"
            >
              <span>{loading ? "Authenticating..." : "Authorize Login"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 border-t border-[rgba(255,255,255,0.06)] pt-5 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white font-bold uppercase tracking-wide">
              <Home className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
        <p className="font-bold text-sm">Opening Secure Gateway...</p>
      </div>
    }>
      <AdminLoginPageContent />
    </Suspense>
  );
}
