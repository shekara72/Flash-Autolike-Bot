import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Sends a HTML-formatted message to the Telegram channel or chat configured in settings.
 */
export async function sendTelegramNotification(text: string): Promise<void> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: settings, error } = await supabaseAdmin
      .from("settings")
      .select("telegram_bot_token, telegram_chat_id")
      .eq("id", 1)
      .single();

    if (error || !settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      console.warn("Telegram bot credentials not configured in settings:", error?.message || "Missing fields");
      return;
    }

    const url = `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.telegram_chat_id,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send Telegram message:", await response.text());
    }
  } catch (err) {
    console.error("Telegram notification error:", err);
  }
}
