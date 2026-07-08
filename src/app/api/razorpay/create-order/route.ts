import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { planId, userId } = await req.json();

    if (!planId || !userId) {
      return NextResponse.json({ error: "planId and userId are required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch Plan details
    const { data: plan, error: planErr } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planErr || !plan) {
      return NextResponse.json({ error: "Selected plan not found" }, { status: 404 });
    }

    // 2. Fetch Razorpay configuration
    const { data: settings, error: settErr } = await supabaseAdmin
      .from("settings")
      .select("razorpay_enabled, razorpay_key_id, razorpay_key_secret")
      .eq("id", 1)
      .single();

    if (settErr || !settings) {
      return NextResponse.json({ error: "Site settings not found" }, { status: 404 });
    }

    if (!settings.razorpay_enabled) {
      return NextResponse.json({ error: "Razorpay checkout is currently disabled" }, { status: 400 });
    }

    const keyId = settings.razorpay_key_id;
    const keySecret = settings.razorpay_key_secret;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay credentials are not configured" }, { status: 400 });
    }

    // 3. Request Razorpay Order Creation via REST API
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const amountInPaisa = Math.round(Number(plan.price) * 100);

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaisa,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      }),
    });

    if (!razorpayRes.ok) {
      const errText = await razorpayRes.text();
      console.error("Razorpay API error response:", errText);
      return NextResponse.json({ error: "Failed to communicate with Razorpay API", details: errText }, { status: 502 });
    }

    const razorpayOrder = await razorpayRes.json();

    // 4. Save pending order details to database
    const { data: dbOrder, error: dbErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        plan_id: planId,
        amount: Number(plan.price),
        payment_method: "razorpay",
        status: "pending",
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single();

    if (dbErr) {
      console.error("Failed to insert pending order in database:", dbErr);
      return NextResponse.json({ error: "Database error during order creation" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      key_id: keyId,
      amount: amountInPaisa,
      currency: "INR",
      db_order_id: dbOrder.id,
    });
  } catch (err: any) {
    console.error("Create order handler error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
