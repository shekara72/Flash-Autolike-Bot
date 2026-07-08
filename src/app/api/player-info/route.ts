import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface RetryOptions {
  maxRetries?: number;
  timeoutMs?: number;
}

async function fetchWithRetry(url: string, options: RetryOptions = {}): Promise<Response> {
  const maxRetries = options.maxRetries ?? 3;
  const timeoutMs = options.timeoutMs ?? 8000;

  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "FlashAutolikeServerProxy/1.0",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);
      return response;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        lastError = new Error(`Request timed out after ${timeoutMs}ms (Attempt ${attempt}/${maxRetries})`);
      } else {
        lastError = err;
      }
      console.warn(`[API Proxy Attempt ${attempt}/${maxRetries} Failed for ${url}]:`, err.message || err);
    }

    if (attempt < maxRetries) {
      await new Promise(res => setTimeout(res, attempt * 600));
    }
  }

  throw lastError || new Error("Failed to fetch after multiple retries");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid")?.trim();

  // Validate: Only numbers are allowed. No text.
  if (!uid || !/^\d+$/.test(uid)) {
    return NextResponse.json(
      { error: "Invalid UID. Only numbers are allowed." },
      { status: 400 }
    );
  }

  const primaryUrl = `https://info.killersharmabot.online/player-info?uid=${encodeURIComponent(uid)}`;

  try {
    const response = await fetchWithRetry(primaryUrl, { maxRetries: 3, timeoutMs: 8000 });
    
    if (!response.ok) {
      try {
        const errJson = await response.json();
        if (errJson.error === "Player not found." || errJson.error) {
          return NextResponse.json({ error: "Player Not Found" }, { status: 404 });
        }
      } catch (e) {}
      
      return NextResponse.json(
        { error: `API responded with HTTP status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check if player not found error is in response
    if (data.error === "Player not found." || data.error) {
      return NextResponse.json({ error: "Player Not Found" }, { status: 404 });
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (primaryErr: any) {
    console.error("[API Proxy Server Error]:", primaryErr.message);
    return NextResponse.json(
      {
        error: "Free Fire player service is currently unreachable. Please check the UID or try again in a few moments.",
        details: primaryErr.message,
      },
      { status: 502 }
    );
  }
}
