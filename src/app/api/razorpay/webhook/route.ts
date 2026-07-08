import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch Razorpay key secret (used as webhook secret)
    const { data: settings, error: settErr } = await supabaseAdmin
      .from("settings")
      .select("razorpay_key_secret")
      .eq("id", 1)
      .single();

    if (settErr || !settings) {
      return NextResponse.json({ error: "Site settings not found" }, { status: 404 });
    }

    const webhookSecret = settings.razorpay_key_secret || "";
    if (!webhookSecret) {
      return NextResponse.json({ error: "Razorpay credentials are not configured" }, { status: 500 });
    }

    // 2. Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Razorpay Webhook: Invalid signature received");
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    // 3. Process Event
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Razorpay Webhook Event Received]: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100;

      // Find the pending order
      const { data: order, error: orderFindErr } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("razorpay_order_id", orderId)
        .maybeSingle();

      if (orderFindErr) {
        console.error("Error searching order in webhook:", orderFindErr);
      }

      if (order && order.status !== "success" && order.status !== "approved") {
        // Update order status to success
        const { error: updateErr } = await supabaseAdmin
          .from("orders")
          .update({
            status: "success",
            razorpay_payment_id: paymentId,
            verified_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        if (updateErr) {
          console.error("Failed to update order status in webhook:", updateErr);
        }

        // Fetch plan to get duration_days
        const { data: plan } = await supabaseAdmin
          .from("plans")
          .select("*")
          .eq("id", order.plan_id)
          .single();

        const durationDays = plan?.duration_days || 30;

        // Activate/extend subscription
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
          console.error("Failed to insert subscription in webhook:", subErr);
        }

        // Insert notification
        await supabaseAdmin.from("notifications").insert({
          user_id: order.user_id,
          title: "Payment Success & Plan Activated",
          message: `Your payment of ₹${amount} has been verified automatically. The plan "${plan?.name || "Active Tier"}" is now active!`,
          type: "plan_activated",
        });

        // Insert activity log
        await supabaseAdmin.from("activity_logs").insert({
          user_id: order.user_id,
          action: "razorpay_webhook_fulfilled",
          details: { order_id: order.id, razorpay_payment_id: paymentId },
        });

        // Telegram Notification
        try {
          const msg = `⚡ <b>Payment Approved (Razorpay Webhook)</b>\n\n👤 <b>User:</b> <code>${order.user_id}</code>\n📦 <b>Plan:</b> ${plan?.name || "Premium Plan"}\n💰 <b>Amount:</b> ₹${amount}\n🆔 <b>Payment ID:</b> <code>${paymentId}</code>\n📅 <b>Expiry:</b> ${expiresAt.toLocaleDateString()}`;
          await sendTelegramNotification(msg);
        } catch (e) {
          console.warn("Telegram webhook notification failed:", e);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Razorpay webhook handler error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
