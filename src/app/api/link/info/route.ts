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
    const { data, error } = await supabaseAdmin
      .from("short_links")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: "Link not found or expired" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      code: data.code,
      url: data.original_url,
      expiresAt: data.expires_at,
      verificationPages: data.verification_pages_count,
      countdownSeconds: data.countdown_seconds,
      clicksCount: data.clicks_count || 0,
      createdAt: data.created_at,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
