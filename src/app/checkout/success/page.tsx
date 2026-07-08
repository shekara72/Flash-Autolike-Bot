"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { downloadInvoicePDF } from "@/utils/invoice-pdf";
import { Check, Download, Home, LayoutDashboard } from "lucide-react";
import confetti from "canvas-confetti";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const planId = searchParams.get("planId");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Fire confetti immediately
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#FF2E93", "#FF7EB9", "#ffffff"],
    });

    const loadDetails = async () => {
      if (!paymentId || !planId) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/auth/login");
          return;
        }

        // Load profile
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (prof) setProfile(prof);

        // Load order
        const { data: ord } = await supabase
          .from("orders")
          .select("*")
          .eq("id", paymentId)
          .single();
        if (ord) setOrder(ord);

        // Load plan
        const { data: pl } = await supabase
          .from("plans")
          .select("*")
          .eq("id", planId)
          .single();
        if (pl) setPlan(pl);

      } catch (e) {
        console.error("Error loading success details", e);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [paymentId, planId, router]);

  const handleDownload = () => {
    if (order && plan && profile) {
      downloadInvoicePDF(order, plan, profile);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
        <p className="font-bold text-sm">Processing verification...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="glass-card w-full max-w-xl p-8 md:p-12 bg-[#16161F] border-[rgba(255,255,255,0.06)] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-[#FF2E93]/5 blur-3xl pointer-events-none" />
          
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[#00E676]/10 text-[#00E676] shadow-inner mb-6 border border-[#00E676]/20 animate-pulse">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Payment Success!</h1>
          <p className="mt-2.5 text-xs text-gray-400 font-semibold uppercase">Your subscription has been successfully queued/activated.</p>

          {order && plan && (
            <div className="mt-8 p-6 bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-2xl text-left space-y-4 max-w-md mx-auto">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)] pb-1.5">Order Summary</h3>
              <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-gray-400">
                <span>Order ID:</span>
                <span className="text-white text-right truncate">#{order.id.slice(0, 8).toUpperCase()}</span>
                
                <span>Plan:</span>
                <span className="text-white text-right uppercase">{plan.name}</span>

                <span>Duration:</span>
                <span className="text-white text-right uppercase">{plan.duration_days} Days</span>
                
                <span>Price:</span>
                <span className="text-[#FF2E93] font-black text-right">₹{order.amount}</span>

                <span>Method:</span>
                <span className="text-white text-right uppercase">{order.payment_method}</span>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {order && plan && profile && (
              <button
                onClick={handleDownload}
                className="outline-btn px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-xs uppercase font-bold tracking-wider"
                id="success-invoice-btn"
              >
                <Download className="h-4.5 w-4.5" />
                <span>Download Invoice</span>
              </button>
            )}
            
            <Link
              href="/dashboard"
              className="pink-btn px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-lg shadow-[#FF2E93]/20 text-xs uppercase font-bold tracking-wider"
              id="success-dashboard-btn"
            >
              <span>Dashboard</span>
              <LayoutDashboard className="h-4.5 w-4.5" />
            </Link>
          </div>

          <div className="mt-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#FF2E93] font-bold uppercase tracking-wide">
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
        <p className="font-bold text-sm">Processing verification...</p>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
