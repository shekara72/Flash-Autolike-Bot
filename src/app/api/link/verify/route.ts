import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, step } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: "code is required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: link, error } = await supabaseAdmin
      .from("short_links")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !link) {
      return NextResponse.json({ success: false, message: "Link not found" }, { status: 404 });
    }

    // Insert analytical click
    const ua = req.headers.get("user-agent") || "";
    let device = "Desktop";
    if (/mobile/i.test(ua)) device = "Mobile";
    else if (/tablet/i.test(ua)) device = "Tablet";

    let os = "Unknown OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

    let browser = "Unknown Browser";
    if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";

    const country = req.headers.get("x-vercel-ip-country") || "IND";

    await supabaseAdmin.from("link_clicks").insert({
      link_id: link.id,
      ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1",
      user_agent: ua,
      referrer: req.headers.get("referer") || "Direct",
      country,
      device,
      browser,
      os,
    });

    // Increment click counts on the final step
    if (step && Number(step) >= Number(link.verification_pages_count)) {
      const newCount = (link.clicks_count || 0) + 1;
      await supabaseAdmin
        .from("short_links")
        .update({ clicks_count: newCount })
        .eq("id", link.id);
    }

    return NextResponse.json({
      success: true,
      currentStep: Number(step || 1),
      totalSteps: link.verification_pages_count,
      verified: step && Number(step) >= Number(link.verification_pages_count)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
