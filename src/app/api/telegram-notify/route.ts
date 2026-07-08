import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Call server-side Telegram dispatcher safely
    await sendTelegramNotification(message);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Telegram notification endpoint error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
