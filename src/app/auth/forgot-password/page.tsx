"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#FF2E93] border-t-transparent"></div>
        <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">Redirecting to login portal...</p>
      </div>
    </div>
  );
}
