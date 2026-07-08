import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch Razorpay key secret
    const { data: settings, error: settErr } = await supabaseAdmin
      .from("settings")
      .select("razorpay_key_secret")
      .eq("id", 1)
      .single();

    if (settErr || !settings) {
      return NextResponse.json({ error: "Site settings not found" }, { status: 404 });
    }

    const keySecret = settings.razorpay_key_secret;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay webhook secret is missing" }, { status: 500 });
    }

    // 2. Perform signature validation
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    // 3. Update order in database
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .update({
        status: "success",
        razorpay_payment_id: razorpay_payment_id,
        verified_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .maybeSingle();

    if (orderErr || !order) {
      console.warn("Could not find order to fulfill for order ID:", razorpay_order_id);
      return NextResponse.json({ error: "Associated order record not found" }, { status: 404 });
    }

    // If order was already successful, don't duplicate subscription activation
    if (order.status === "success" && order.verified_at && (Date.now() - new Date(order.verified_at).getTime() > 10000)) {
      return NextResponse.json({ success: true, message: "Order already completed" });
    }

    // 4. Load Plan info to get duration days
    const { data: plan } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("id", order.plan_id)
      .single();

    const durationDays = plan?.duration_days || 30;

    // 5. Create active subscription
    const activatedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const { error: subErr } = await supabaseAdmin.from("subscriptions").insert({
      user_id: order.user_id,
      plan_id: order.plan_id,
      activated_at: activatedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      status: "active",
    });

    if (subErr) {
      console.error("Subscription insert failure:", subErr);
    }

    // 6. Dispatch Notification
    await supabaseAdmin.from("notifications").insert({
      user_id: order.user_id,
      title: "Razorpay Checkout Complete",
      message: `Your payment for ₹${order.amount} has been successfully validated. The plan "${plan?.name || "Active Tier"}" is now active!`,
      type: "plan_activated",
    });

    // 7. Dispatch Activity Log
    await supabaseAdmin.from("activity_logs").insert({
      user_id: order.user_id,
      action: "razorpay_payment_verified",
      details: { order_id: order.id, razorpay_payment_id },
    });

    // 8. Telegram notification
    try {
      const msg = `⚡ <b>Payment Approved (Razorpay Client)</b>\n\n👤 <b>User:</b> <code>${order.user_id}</code>\n📦 <b>Plan:</b> ${plan?.name || "Premium Plan"}\n💰 <b>Amount:</b> ₹${order.amount}\n🆔 <b>Payment ID:</b> <code>${razorpay_payment_id}</code>\n📅 <b>Expiry:</b> ${expiresAt.toLocaleDateString()}`;
      await sendTelegramNotification(msg);
    } catch (e) {
      console.warn("Telegram checkout notification failed:", e);
    }

    return NextResponse.json({ success: true, orderId: order.id, planId: order.plan_id });
  } catch (err: any) {
    console.error("Verify payment handler error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
