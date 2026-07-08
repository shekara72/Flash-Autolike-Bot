import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET: Fetch short link details by code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code parameter is required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: link, error } = await supabaseAdmin
      .from("short_links")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !link) {
      return NextResponse.json({ error: "Link not found or expired" }, { status: 404 });
    }

    // Check if expired
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json({ error: "Link has expired" }, { status: 410 });
    }

    return NextResponse.json({ success: true, link });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Log Click Analytics and update click count
export async function POST(req: NextRequest) {
  try {
    const { linkId, ip, referrer, userAgent } = await req.json();

    if (!linkId) {
      return NextResponse.json({ error: "linkId is required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Parse Device, OS, and Browser from User Agent
    const ua = userAgent || req.headers.get("user-agent") || "";
    let device = "Desktop";
    if (/mobile/i.test(ua)) device = "Mobile";
    else if (/tablet/i.test(ua)) device = "Tablet";

    let os = "Unknown OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
    else if (/linux/i.test(ua)) os = "Linux";

    let browser = "Unknown Browser";
    if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";
    else if (/opr|opera/i.test(ua)) browser = "Opera";

    // Detect country from header (Vercel provides this)
    const country = req.headers.get("x-vercel-ip-country") || "IND";

    // 1. Insert Click record
    const { error: clickErr } = await supabaseAdmin.from("link_clicks").insert({
      link_id: linkId,
      ip_address: ip || req.headers.get("x-forwarded-for") || "127.0.0.1",
      user_agent: ua,
      referrer: referrer || req.headers.get("referer") || "Direct",
      country,
      device,
      browser,
      os,
    });

    if (clickErr) {
      console.error("Failed to insert link click analytics:", clickErr);
    }

    // 2. Increment click count in short_links table
    const { data: link } = await supabaseAdmin
      .from("short_links")
      .select("clicks_count")
      .eq("id", linkId)
      .single();

    const newCount = (link?.clicks_count || 0) + 1;
    await supabaseAdmin
      .from("short_links")
      .update({ clicks_count: newCount })
      .eq("id", linkId);

    return NextResponse.json({ success: true, clicks_count: newCount });
  } catch (err: any) {
    console.error("Link analytics error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
