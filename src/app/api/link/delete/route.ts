import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function performDelete(code: string, req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("short_links")
    .delete()
    .eq("code", code)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, message: "Link not found or failed to delete" }, { status: 404 });
  }

  // Log Activity
  try {
    await supabaseAdmin.from("activity_logs").insert({
      action: "Link Deleted (API)",
      details: { code },
      ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });
  } catch (e) {}

  return NextResponse.json({ success: true, message: `Short link with code ${code} deleted successfully` });
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, message: "code is required" }, { status: 400 });
    }
    return await performDelete(code, req);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code } = body;
    const { searchParams } = new URL(req.url);
    const codeParam = code || searchParams.get("code");

    if (!codeParam) {
      return NextResponse.json({ success: false, message: "code is required" }, { status: 400 });
    }
    return await performDelete(codeParam, req);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
