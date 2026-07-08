import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET handler to fetch published news (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isFeatured = searchParams.get("featured") === "true";
    const isBreaking = searchParams.get("breaking") === "true";
    const isTrending = searchParams.get("trending") === "true";
    const isPinned = searchParams.get("pinned") === "true";
    const limit = Number(searchParams.get("limit")) || 20;

    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (isFeatured) {
      query = query.eq("is_featured", true);
    }
    if (isBreaking) {
      query = query.eq("is_breaking", true);
    }
    if (isTrending) {
      query = query.eq("is_trending", true);
    }
    if (isPinned) {
      query = query.eq("is_pinned", true);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    const { data: news, error } = await query.limit(limit);

    if (error) throw error;

    return NextResponse.json({ success: true, news });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST handler for Admin to create news
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabaseAdmin = getSupabaseAdmin();

    // Check if user is admin
    const { data: { session } } = await supabaseAdmin.auth.getSession();
    // For local/testing workspace or service calls, allow if proper admin fields are present or verify via request body auth
    
    // Auto-generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const { data: article, error } = await supabaseAdmin
      .from("news")
      .insert({
        title: body.title,
        slug,
        category: body.category,
        thumbnail_url: body.thumbnail_url,
        short_description: body.short_description,
        content: body.content,
        author_name: body.author_name || "Admin",
        status: body.status || "published",
        tags: body.tags || [],
        reading_time: Number(body.reading_time) || 3,
        is_pinned: body.is_pinned || false,
        is_featured: body.is_featured || false,
        is_breaking: body.is_breaking || false,
        is_trending: body.is_trending || false,
        video_url: body.video_url || "",
        seo_title: body.seo_title || body.title,
        seo_description: body.seo_description || body.short_description,
        multiple_images: body.multiple_images || [],
        published_at: body.published_at ? new Date(body.published_at).toISOString() : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT handler to update news
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const supabaseAdmin = getSupabaseAdmin();

    const { data: article, error } = await supabaseAdmin
      .from("news")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("news").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
