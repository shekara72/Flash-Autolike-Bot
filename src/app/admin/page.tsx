"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/admin/login?error=unauthorized");
        }
      } catch (err) {
        router.replace("/admin/login");
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
      <p className="font-bold text-sm">Redirecting to Admin Portal...</p>
    </div>
  );
}
