import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname, role } = await req.json();

    if (!email || !password || !nickname) {
      return NextResponse.json(
        { success: false, error: "Email, password, and nickname are required." },
        { status: 400 }
      );
    }

    // Initialize Supabase Admin Client using Service Role Key
    const supabaseAdmin = getSupabaseAdmin();

    // Create user via Admin Auth API
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nickname,
        role: role || "user",
      },
    });

    if (createUserError) {
      return NextResponse.json(
        { success: false, error: createUserError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
