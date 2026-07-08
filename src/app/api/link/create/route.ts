import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, expiry, verificationPages } = body;

    if (!url) {
      return NextResponse.json({ success: false, message: "url is required" }, { status: 400 });
    }

    const verificationPagesCount = verificationPages ? Math.min(10, Math.max(3, Number(verificationPages))) : 5;
    const code = Math.random().toString(36).substring(2, 8);

    let expiresAt: Date | null = new Date();
    const expStr = String(expiry || "24h").toLowerCase();
    
    if (expStr === "10m" || expStr === "10 minutes") {
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    } else if (expStr === "30m" || expStr === "30 minutes") {
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    } else if (expStr === "1h" || expStr === "1 hour") {
      expiresAt.setHours(expiresAt.getHours() + 1);
    } else if (expStr === "6h" || expStr === "6 hours") {
      expiresAt.setHours(expiresAt.getHours() + 6);
    } else if (expStr === "12h" || expStr === "12 hours") {
      expiresAt.setHours(expiresAt.getHours() + 12);
    } else if (expStr === "24h" || expStr === "24 hours") {
      expiresAt.setHours(expiresAt.getHours() + 24);
    } else if (expStr === "7d" || expStr === "7 days") {
      expiresAt.setDate(expiresAt.getDate() + 7);
    } else if (expStr === "30d" || expStr === "30 days") {
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else if (expStr === "6m" || expStr === "6 months") {
      expiresAt.setMonth(expiresAt.getMonth() + 6);
    } else if (expStr === "lifetime" || expStr === "never") {
      expiresAt = null;
    } else {
      expiresAt.setHours(expiresAt.getHours() + 24);
    }

    const host = req.headers.get("host") || "yourdomain.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const shortUrl = `${protocol}://${host}/l/${code}`;

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("short_links").insert({
      code,
      original_url: url,
      title: "API Generated Link",
      expiry_preset: expStr,
      expires_at: expiresAt ? expiresAt.toISOString() : null,
      countdown_seconds: 15,
      verification_pages_count: verificationPagesCount,
      telegram_required: false,
      ads_banner: true,
      ads_reward: true,
      ads_interstitial: true,
      clicks_count: 0,
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    // Log Activity
    try {
      await supabaseAdmin.from("activity_logs").insert({
        action: "Link Created (API)",
        details: { code, url, shortUrl },
        ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      shortUrl,
      expiry: expiresAt ? expiresAt.toISOString().split("T")[0] : "Lifetime",
      verificationPages: verificationPagesCount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
