import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, message: "code is required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    // 1. Fetch the short link record
    const { data: link, error } = await supabaseAdmin
      .from("short_links")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !link) {
      return NextResponse.json({ success: false, message: "Link not found or expired" }, { status: 404 });
    }

    // 2. Fetch all clicks for this link
    const { data: clicks } = await supabaseAdmin
      .from("link_clicks")
      .select("*")
      .eq("link_id", link.id)
      .order("created_at", { ascending: false });

    // 3. Compute country and device aggregates
    const countryStats: Record<string, number> = {};
    const deviceStats: Record<string, number> = {};
    const browserStats: Record<string, number> = {};
    const osStats: Record<string, number> = {};

    clicks?.forEach((c: any) => {
      const country = c.country || "Unknown";
      const device = c.device || "Unknown";
      const browser = c.browser || "Unknown";
      const os = c.os || "Unknown";

      countryStats[country] = (countryStats[country] || 0) + 1;
      deviceStats[device] = (deviceStats[device] || 0) + 1;
      browserStats[browser] = (browserStats[browser] || 0) + 1;
      osStats[os] = (osStats[os] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      code: link.code,
      clicksCount: link.clicks_count || 0,
      aggregates: {
        country: countryStats,
        device: deviceStats,
        browser: browserStats,
        os: osStats,
      },
      clicks: clicks?.slice(0, 100).map(c => ({
        ip: c.ip_address ? c.ip_address.replace(/\.\d+\.\d+$/, ".xx.xx") : "Unknown",
        country: c.country,
        device: c.device,
        browser: c.browser,
        os: c.os,
        referrer: c.referrer,
        timestamp: c.created_at,
      })) || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
