import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch counts
    const { count: usersCount } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: linksCount } = await supabaseAdmin
      .from("short_links")
      .select("*", { count: "exact", head: true });

    const { count: newsCount } = await supabaseAdmin
      .from("news")
      .select("*", { count: "exact", head: true });

    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("amount, status");

    let totalRevenue = 0;
    let pendingPayments = 0;
    let completedPayments = 0;

    orders?.forEach(o => {
      if (o.status === "approved" || o.status === "success") {
        totalRevenue += Number(o.amount || 0);
        completedPayments++;
      } else if (o.status === "pending") {
        pendingPayments++;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: usersCount || 0,
        totalLinks: linksCount || 0,
        totalArticles: newsCount || 0,
        totalRevenue,
        pendingPayments,
        completedPayments
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
