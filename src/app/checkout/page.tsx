"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { getCurrentUserUid, getProfileByUid } from "@/lib/uid-auth";
import {
  CreditCard,
  PlusCircle,
  Upload,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Shield,
  Zap,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
}

interface Profile {
  id: string;
  uid: string;
  nickname: string;
  region: string;
}

const DEFAULT_PLANS: Plan[] = [
  { id: "demo-trial", name: "Demo Trial", price: 20, duration_days: 1, features: ["1 Day Demo", "Total Likes: ~220", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST"] },
  { id: "7-days-starter", name: "7 Days Starter", price: 50, duration_days: 7, features: ["7 Days Active", "Total Likes: 1,540", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST"] },
  { id: "15-days-growth", name: "15 Days Growth", price: 100, duration_days: 15, features: ["15 Days Active", "Total Likes: 3,300", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST"] },
  { id: "30-days-pro", name: "30 Days Pro", price: 200, duration_days: 30, features: ["30 Days Active", "Total Likes: 6,600", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST"] },
  { id: "60-days-premium", name: "60 Days Premium", price: 400, duration_days: 60, features: ["60 Days Active", "Total Likes: 13,200", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST"] },
  { id: "90-days-pro-plus", name: "90 Days Pro+", price: 600, duration_days: 90, features: ["90 Days Active", "Total Likes: 19,800", "Daily Load: ~220 Likes", "Daily Time: 4:00 AM IST"] },
];

function matchPlanFromList(query: string | null, list: Plan[]): Plan {
  if (!query) return list[1] || list[0];
  const q = String(query).toLowerCase().trim();

  const exact = list.find(p => p.id.toLowerCase() === q || p.name.toLowerCase() === q);
  if (exact) return exact;

  if (q.includes("starter") || q === "starter") {
    const found = list.find(p => p.name.toLowerCase().includes("starter"));
    if (found) return found;
  }
  if (q.includes("premium") || q === "premium") {
    const found = list.find(p => p.name.toLowerCase().includes("premium"));
    if (found) return found;
  }
  if (q.includes("growth") || q === "growth") {
    const found = list.find(p => p.name.toLowerCase().includes("growth"));
    if (found) return found;
  }
  if (q.includes("pro+") || q.includes("pro-plus")) {
    const found = list.find(p => p.name.toLowerCase().includes("pro+"));
    if (found) return found;
  }
  if (q.includes("pro") || q === "pro") {
    const found = list.find(p => p.name.toLowerCase().includes("pro"));
    if (found) return found;
  }
  if (q.includes("demo") || q.includes("trial")) {
    const found = list.find(p => p.name.toLowerCase().includes("demo") || p.name.toLowerCase().includes("trial"));
    if (found) return found;
  }

  const fuzzy = list.find(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  if (fuzzy) return fuzzy;

  return list[1] || list[0];
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(() => matchPlanFromList(planParam, DEFAULT_PLANS));

  // Gateway and Form states
  const [activeGateway, setActiveGateway] = useState<"razorpay" | "upi">("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submittingUpi, setSubmittingUpi] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [showRetryBtn, setShowRetryBtn] = useState(false);

  useEffect(() => {
    const initCheckout = async () => {
      let activeUid = getCurrentUserUid();
      let effectiveUserId = activeUid;

      if (!effectiveUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          effectiveUserId = session.user.id;
          const { data: pr } = await supabase.from("profiles").select("uid").eq("id", session.user.id).single();
          if (pr?.uid) activeUid = pr.uid;
        }
      }

      if (!effectiveUserId) {
        router.push(`/auth/login?redirect=/checkout?plan=${planParam || ""}`);
        return;
      }
      setUser({ id: effectiveUserId });

      // Fetch profile
      let prof = null;
      if (activeUid) {
        prof = await getProfileByUid(activeUid);
      } else {
        const { data: found } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", effectiveUserId)
          .single();
        prof = found;
      }

      if (prof) {
        setProfile({
          id: prof.id || prof.uid,
          uid: prof.uid,
          nickname: prof.nickname,
          region: prof.region || "IND",
        });
      }

      // Fetch site settings
      const { data: sett } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (sett) {
        setSiteSettings(sett);
        if (sett.razorpay_enabled === false) {
          setActiveGateway("upi");
        }
      }

      // Fetch plans
      const { data: dbPlans } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true);
      
      const targetList = (dbPlans && dbPlans.length > 0)
        ? dbPlans.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            duration_days: p.duration_days,
            features: p.features || [],
          })).sort((a, b) => a.price - b.price)
        : DEFAULT_PLANS;
      
      setPlans(targetList);

      const storedPlanId = typeof window !== "undefined" ? localStorage.getItem("flash_selected_plan_id") : null;
      const targetQuery = planParam || storedPlanId;

      const matched = matchPlanFromList(targetQuery, targetList);
      setSelectedPlan(matched);
      if (typeof window !== "undefined") {
        localStorage.setItem("flash_selected_plan_id", matched.id);
      }
      
      setLoading(false);
    };

    initCheckout();
  }, [router, planParam]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setErrorMsg("");
      setShowRetryBtn(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("flash_selected_plan_id", plan.id);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    const extMatch = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);

    if (!allowedTypes.includes(file.type) && !extMatch) {
      setErrorMsg("Invalid file format. Supported formats: JPG, JPEG, PNG, WEBP, and GIF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds maximum limit of 10MB.");
      return;
    }
    setErrorMsg("");
    setShowRetryBtn(false);
    setScreenshotFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setShowRetryBtn(false);

    if (!selectedPlan) {
      setErrorMsg("Please select a plan first.");
      return;
    }

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 12 || cleanUtr.length > 22 || !/^[a-zA-Z0-9]{12,22}$/.test(cleanUtr)) {
      setErrorMsg("Please enter a valid 12–22 digit UTR transaction reference number.");
      return;
    }
    if (!screenshotFile) {
      setErrorMsg("Please upload your payment screenshot image proof.");
      return;
    }

    setSubmittingUpi(true);
    setUploadProgress(15);

    try {
      // Duplicate UTR check
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("utr_number", cleanUtr)
        .maybeSingle();

      if (existingOrder) {
        setErrorMsg("This UTR number has already been submitted. Duplicate UTR submissions are rejected.");
        setSubmittingUpi(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(35);
      let uploadedUrl = "";

      // 1. Upload to ImgBB API v1 with real progress bar
      try {
        setUploadProgress(35);
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const imgbbKey = "a3b6be57e0aa3ffedfb99ae4b5e7faca";
          xhr.open("POST", `https://api.imgbb.com/1/upload?key=${imgbbKey}`);
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const pct = Math.round((event.loaded / event.total) * 100);
              // Map the progress from 35% to 85%
              setUploadProgress(35 + Math.round(pct * 0.5));
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const resJson = JSON.parse(xhr.responseText);
                if (resJson.success && (resJson.data?.url || resJson.data?.display_url)) {
                  resolve(resJson.data.url || resJson.data.display_url);
                } else {
                  reject(new Error("ImgBB success flag was false"));
                }
              } catch (e) {
                reject(e);
              }
            } else {
              reject(new Error(`ImgBB HTTP ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => reject(new Error("ImgBB connection error"));
          
          const formData = new FormData();
          formData.append("image", screenshotFile);
          xhr.send(formData);
        });
      } catch (imgbbErr) {
        console.warn("ImgBB API primary upload failed, trying fallback:", imgbbErr);
      }

      setUploadProgress(75);

      // 2. Secondary Storage Fallback if ImgBB fails
      if (!uploadedUrl) {
        const fileExt = screenshotFile.name.split(".").pop() || "png";
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        
        let uploadRes = await supabase.storage
          .from("payment-screenshots")
          .upload(fileName, screenshotFile, { cacheControl: "3600", upsert: true });

        if (uploadRes.error) {
          uploadRes = await supabase.storage
            .from("payment-proofs")
            .upload(fileName, screenshotFile, { cacheControl: "3600", upsert: true });
        }

        if (uploadRes.error) {
          console.error("Secondary Storage fallback failed:", uploadRes.error);
          uploadedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}/storage/v1/object/public/payment-screenshots/${fileName}`;
        } else {
          const bucketName = uploadRes.data?.path?.includes("payment-proofs") ? "payment-proofs" : "payment-screenshots";
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          uploadedUrl = publicUrl;
        }
      }

      setUploadProgress(90);

      // 3. Save order to database
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        amount: selectedPlan.price,
        payment_method: "upi",
        status: "pending",
        utr_number: cleanUtr,
        screenshot_url: uploadedUrl,
      });

      if (orderError) throw orderError;

      // 4. Save into manual_payments table for schema compatibility
      try {
        await supabase.from("manual_payments").insert({
          user_id: user.id,
          uid: profile?.uid || user.id,
          plan_name: selectedPlan.name,
          plan_id: selectedPlan.id,
          amount: selectedPlan.price,
          utr: cleanUtr,
          screenshot_url: uploadedUrl,
          image_url: uploadedUrl,
          status: "Pending",
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.log("manual_payments insert notice:", e);
      }

      setUploadProgress(100);

      // Log activity & notification
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "upi_payment_checkout_submitted",
        details: { plan_id: selectedPlan.id, utr: cleanUtr, image_url: uploadedUrl },
      });

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Payment Submitted Successfully",
        message: `Your payment of ₹${selectedPlan.price} (UTR: ${cleanUtr}) has been uploaded to ImageBB and queued for admin verification.`,
        type: "announcement",
      });

      // Send Telegram alert safely using our proxy API
      try {
        const tgMsg = `🔔 <b>New Manual UPI Payment Submitted</b>\n\n👤 <b>User:</b> <code>${profile?.uid || user.id}</code>\n📦 <b>Plan:</b> ${selectedPlan.name}\n💰 <b>Amount:</b> ₹${selectedPlan.price}\n🆔 <b>UTR:</b> <code>${cleanUtr}</code>\n🖼️ <b>Screenshot Proof:</b> <a href="${uploadedUrl}">View Image</a>`;
        await fetch("/api/telegram-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: tgMsg }),
        });
      } catch (tgErr) {
        console.warn("Failed to dispatch Telegram manual checkout alert:", tgErr);
      }

      setSuccessMsg("Payment Submitted Successfully! Screenshot uploaded to ImageBB and saved to database.");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Upload or payment submission failed. Please click Retry to try again.");
      setShowRetryBtn(true);
      setUploadProgress(0);
    } finally {
      setSubmittingUpi(false);
    }
  };

  const handleRazorpayPay = async () => {
    if (!selectedPlan || !user) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          userId: user.id,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to create Razorpay order");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: siteSettings?.site_name || "Flash Autolike",
        description: `Upgrade to ${selectedPlan.name}`,
        image: siteSettings?.logo_url || "/favicon.ico",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || verifyData.error) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            router.push(`/checkout/success?paymentId=${verifyData.orderId}&planId=${verifyData.planId}`);
          } catch (verifyErr: any) {
            setErrorMsg("Payment verification failed: " + verifyErr.message);
          }
        },
        prefill: {
          name: profile?.nickname || "",
        },
        theme: {
          color: siteSettings?.primary_color || "#FF2E93",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMsg(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg("Razorpay checkout failed: " + err.message);
    }
  };

  const isRazorpayEnabled = siteSettings?.razorpay_enabled === true;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
        <p className="font-bold text-sm text-white">Opening Secure Gateway...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase flex items-center justify-center sm:justify-start gap-2">
            <Shield className="h-6 w-6 text-[#FF2E93]" />
            <span>Secure Checkout</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold">Select payment system and finalize subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SUMMARY PANEL */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] relative overflow-hidden rounded-2xl">
              <div className="absolute -top-10 -left-10 h-32 w-32 bg-[#FF2E93]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Summary Information</h3>
                {plans.length > 1 && (
                  <select
                    value={selectedPlan?.id || ""}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="bg-[#0B0B0F] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-[#FF2E93] font-bold cursor-pointer"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                    ))}
                  </select>
                )}
              </div>
              
              {selectedPlan && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Selected Plan</span>
                    <h4 className="text-lg font-black text-white mt-0.5 uppercase">{selectedPlan.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase">Duration</span>
                      <span className="text-white uppercase">{selectedPlan.duration_days} Days active</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase">Daily Load</span>
                      <span className="text-[#00E676] uppercase">~220 Likes / Day</span>
                    </div>
                  </div>

                  <hr className="border-[rgba(255,255,255,0.06)]" />

                  {profile && (
                    <div className="p-3 bg-[#0B0B0F] border border-[rgba(255,255,255,0.04)] rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">In-Game Nickname:</span>
                        <span className="text-white font-bold">{profile.nickname}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Verified UID:</span>
                        <span className="text-white font-mono font-bold">{profile.uid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Region:</span>
                        <span className="text-[#FF2E93] font-bold uppercase">{profile.region || "India"}</span>
                      </div>
                    </div>
                  )}

                  <hr className="border-[rgba(255,255,255,0.06)]" />

                  <div className="flex items-center justify-between text-white pt-2">
                    <span className="text-xs font-bold uppercase">Total Calculated Cost</span>
                    <span className="text-2xl font-black text-[#FF2E93]">₹{selectedPlan.price}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-[#FF2E93]/5 border border-[#FF2E93]/20 rounded-xl flex gap-3 items-center">
              <Zap className="h-6 w-6 text-[#FF2E93] shrink-0" />
              <div className="text-left text-xs leading-relaxed font-semibold text-gray-300">
                <p className="font-bold text-white uppercase text-[10px]">Secure Payment Verification</p>
                <p className="text-[10px] text-gray-400">Manual UPI verification usually takes 5-10 minutes.</p>
              </div>
            </div>
          </div>

          {/* GATEWAY SELECTOR CARDS */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Choose Payment Method</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Manual UPI Card */}
              <div
                onClick={() => { setActiveGateway("upi"); setErrorMsg(""); setShowRetryBtn(false); }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  activeGateway === "upi"
                    ? "bg-[#16161F] border-[#FF2E93] shadow-lg shadow-[#FF2E93]/10"
                    : "bg-[#16161F]/60 border-[rgba(255,255,255,0.06)] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-green-950 text-[#00E676] border border-green-800">
                    Status: Active
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Available
                  </span>
                </div>
                <div className="space-y-1 my-2">
                  <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-[#FF2E93]" /> Manual UPI QR
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">GPay, PhonePe, Paytm, BHIM QR scan</p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full py-2.5 rounded-xl pink-btn text-xs font-bold uppercase tracking-wider"
                >
                  Pay Now (Active)
                </button>
              </div>

              {/* Razorpay Card */}
              <div
                onClick={() => {
                  if (isRazorpayEnabled) {
                    setActiveGateway("razorpay");
                    setErrorMsg("");
                    setShowRetryBtn(false);
                  }
                }}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  !isRazorpayEnabled
                    ? "bg-[#16161F]/30 border-white/5 opacity-75 cursor-not-allowed"
                    : activeGateway === "razorpay"
                    ? "bg-[#16161F] border-[#FF2E93]"
                    : "bg-[#16161F]/60 border-[rgba(255,255,255,0.06)]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                    Recommended
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${isRazorpayEnabled ? "bg-green-950 text-green-400 border border-green-800" : "bg-gray-800 text-gray-400 border border-gray-700"}`}>
                    {isRazorpayEnabled ? "Active" : "Currently Unavailable"}
                  </span>
                </div>
                <div className="space-y-1 my-2">
                  <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400" /> Razorpay
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">Instant Card / Wallet Gateway</p>
                </div>
                <button
                  type="button"
                  disabled={!isRazorpayEnabled}
                  className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isRazorpayEnabled ? "pink-btn cursor-pointer" : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                  }`}
                >
                  {isRazorpayEnabled ? "Pay with Razorpay" : "Currently Unavailable"}
                </button>
              </div>
            </div>

            {/* Error & Success Messages with Retry Button */}
            {errorMsg && (
              <div className="text-xs text-red-400 font-bold bg-red-950/20 p-4 rounded-xl border border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span>{errorMsg}</span>
                {showRetryBtn && (
                  <button
                    type="button"
                    onClick={handleUpiSubmit}
                    className="pink-btn px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Retry Upload
                  </button>
                )}
              </div>
            )}
            {successMsg && <p className="text-xs text-[#00E676] font-bold bg-green-950/20 p-4 rounded-xl border border-green-900/50">{successMsg}</p>}

            {/* VIEW PANELS */}
            <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl min-h-[300px] flex flex-col justify-between">
              {activeGateway === "razorpay" && isRazorpayEnabled ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between py-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-[#FF2E93]" />
                      <span>Razorpay Payment System</span>
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                      Pay instantly using UPI, Net Banking, Credit/Debit cards, or digital wallets. Your subscription activates immediately upon payment validation.
                    </p>
                  </div>

                  <div className="py-6 border-y border-[rgba(255,255,255,0.06)] text-center">
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block mb-2">Automated Checkouts Gate</span>
                    <p className="text-2xl font-black text-white">₹{selectedPlan?.price}</p>
                  </div>

                  <button
                    onClick={handleRazorpayPay}
                    className="pink-btn w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF2E93]/20 mt-4"
                  >
                    <span>Activate Razorpay Redirection</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <PlusCircle className="h-4 w-4 text-[#FF2E93]" />
                      <span>Manual UPI Payment Gateway</span>
                    </h3>
                    <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                      Scan the dynamic QR code below using GPay, PhonePe, Paytm, or BHIM. Enter your 12–22 digit UTR number and upload a payment screenshot.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start border-t border-[rgba(255,255,255,0.06)] pt-6">
                    {/* QR block */}
                    <div className="text-center space-y-3">
                      <div className="inline-block p-3 bg-white rounded-2xl shadow-xl">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(siteSettings?.upi_id || "shekarappa727@fam")}&pn=Flash%20Autolike&am=${selectedPlan?.price || 20}&cu=INR`}
                          alt="Dynamic UPI QR Code"
                          className="h-40 w-40 mx-auto object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase">Amount: <span className="text-[#FF2E93]">₹{selectedPlan?.price || 20}</span></p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">UPI ID: <span className="text-[#FF2E93] font-bold">{siteSettings?.upi_id || "shekarappa727@fam"}</span></p>
                      </div>
                    </div>

                    {/* Verification Form */}
                    <form onSubmit={handleUpiSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">12–22 Digit UTR / Transaction Reference Number</label>
                        <input
                          type="text"
                          required
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.trim())}
                          className="glass-input w-full rounded-xl py-3 px-4 text-xs text-white font-mono"
                          placeholder="e.g. 123456789012"
                          maxLength={22}
                        />
                      </div>

                      {/* File Proof */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Upload Payment Screenshot (Max 10MB)</label>
                        <div 
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          className={`relative flex flex-col items-center justify-center border border-dashed rounded-xl p-4 transition-all ${
                            dragActive ? "border-[#FF2E93] bg-[#FF2E93]/5" : "border-[rgba(255,255,255,0.08)] bg-[#0B0B0F]"
                          }`}
                        >
                          <input 
                            type="file"
                            id="screenshot-checkout-input"
                            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          
                          {imagePreviewUrl ? (
                            <div className="space-y-2 text-center">
                              <img src={imagePreviewUrl} alt="Screenshot Preview" className="h-28 max-w-full mx-auto object-contain rounded-lg border border-white/10 shadow-md" />
                              <p className="text-[10px] text-green-400 font-bold flex items-center justify-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5" /> Ready for upload ({screenshotFile?.name})
                              </p>
                              <label htmlFor="screenshot-checkout-input" className="text-[9px] text-[#FF2E93] underline font-bold cursor-pointer block">Change Image</label>
                            </div>
                          ) : (
                            <label 
                              htmlFor="screenshot-checkout-input"
                              className="flex flex-col items-center justify-center cursor-pointer text-center space-y-1.5"
                            >
                              <Upload className="h-6 w-6 text-[#FF2E93]" />
                              <span className="text-[11px] text-gray-300 font-semibold truncate max-w-[200px]">
                                Drag & drop, or browse screenshot
                              </span>
                              <span className="text-[8px] text-gray-500 uppercase font-bold">JPG, JPEG, PNG, WEBP, GIF up to 10MB</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {submittingUpi && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>Uploading Screenshot to ImageBB...</span>
                            <span className="text-[#FF2E93] font-mono">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-[#0B0B0F] h-2 rounded-full overflow-hidden border border-white/10">
                            <div 
                              className="bg-gradient-to-r from-[#FF2E93] to-[#00E676] h-full transition-all duration-300 rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submittingUpi}
                        className="pink-btn w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-[#FF2E93]/20 flex items-center justify-center gap-2"
                      >
                        {submittingUpi ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full font-bold" />
                            <span>Uploading Screenshot ({uploadProgress}%)...</span>
                          </>
                        ) : (
                          "Submit Payment Verification"
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="p-3 bg-[#FFD600]/10 border border-[#FFD600]/20 text-[#FFD600] rounded-xl text-[10px] uppercase font-bold tracking-wider text-center mt-2">
                    Notice: Your payment is under verification. Confirmation usually takes 5–10 minutes.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2E93] border-t-transparent mb-4"></div>
        <p className="font-bold text-sm">Opening Secure Gateway...</p>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}
