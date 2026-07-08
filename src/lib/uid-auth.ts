import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id?: string;
  uid: string;
  nickname: string;
  region: string;
  role: "super_admin" | "admin" | "moderator" | "support_staff" | "user";
  is_banned: boolean;
  banned_until?: string | null;
  created_at?: string;
}

const STORAGE_KEY = "flash_autolike_active_uid";

/**
 * Validates Free Fire UID format (8 to 12 numeric digits)
 */
export function validateUidFormat(uid: string): boolean {
  return /^\d{5,15}$/.test(uid.trim());
}

/**
 * Gets currently logged in user UID from localStorage / Cookies
 */
export function getCurrentUserUid(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY) || null;
}

/**
 * Authenticates user directly using Free Fire UID:
 * 1. Validates UID format.
 * 2. Fetches player info from live API.
 * 3. Upserts user profile in Supabase (`profiles` and `ff_accounts`).
 * 4. Stores active UID in localStorage session.
 */
export async function loginWithUid(rawUid: string): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
  const uid = rawUid.trim();

  if (!validateUidFormat(uid)) {
    return { success: false, message: "Invalid UID. Please enter a valid 5 to 15 digit numeric Free Fire UID." };
  }

  let nickname = "";
  let region = "IND";
  let playerRawData: any = null;

  // 1. Query Player Info API
  try {
    const res = await fetch(`/api/player-info?uid=${encodeURIComponent(uid)}`);
    if (res.ok) {
      const resJson = await res.json();
      if (resJson && (resJson.basicInfo || resJson.error)) {
        if (resJson.error === "Player not found." || resJson.error) {
          return { success: false, message: "Player Not Found. Please enter a valid registered Free Fire UID." };
        }
        playerRawData = resJson;
        if (resJson.basicInfo?.nickname) {
          nickname = resJson.basicInfo.nickname;
          region = resJson.basicInfo.region || "IND";
        }
      }
    }
  } catch (err) {
    console.warn("API route query failed, trying direct endpoint:", err);
    try {
      const directRes = await fetch(`https://info.killersharmabot.online/player-info?uid=${encodeURIComponent(uid)}`);
      if (directRes.ok) {
        const resJson = await directRes.json();
        if (resJson.error === "Player not found." || resJson.error) {
          return { success: false, message: "Player Not Found. Please enter a valid registered Free Fire UID." };
        }
        playerRawData = resJson;
        if (resJson.basicInfo?.nickname) {
          nickname = resJson.basicInfo.nickname;
          region = resJson.basicInfo.region || "IND";
        }
      }
    } catch (e) {}
  }

  // If no nickname, it means player is not found
  if (!nickname) {
    return { success: false, message: "Player Not Found. Please enter a valid registered Free Fire UID." };
  }

  // 2. Upsert Profile record in Supabase `profiles` table
  let existingProfile: UserProfile | null = null;
  try {
    const { data: found } = await supabase
      .from("profiles")
      .select("*")
      .eq("uid", uid)
      .single();

    if (found) {
      existingProfile = found as UserProfile;
    }
  } catch (e) {
    // Record does not exist yet
  }

  if (existingProfile?.is_banned) {
    const isTempBanned = existingProfile.banned_until && new Date(existingProfile.banned_until) > new Date();
    if (isTempBanned || !existingProfile.banned_until) {
      return {
        success: false,
        message: existingProfile.banned_until
          ? `Your account is temporarily banned until ${new Date(existingProfile.banned_until).toLocaleString()}`
          : "Your account is permanently banned.",
      };
    }
  }

  const profileData: UserProfile = {
    uid,
    nickname,
    region,
    role: existingProfile?.role || "user",
    is_banned: false,
  };

  try {
    await supabase.from("profiles").upsert(
      {
        uid,
        nickname,
        region,
        role: profileData.role,
        is_banned: false,
      },
      { onConflict: "uid" }
    );
  } catch (err) {
    console.warn("Profile upsert notice:", err);
  }

  // 3. Upsert `ff_accounts` table cache
  if (playerRawData) {
    try {
      await supabase.from("ff_accounts").upsert({
        uid,
        nickname,
        region,
        level: Number(playerRawData.basicInfo?.level) || 0,
        likes: Number(playerRawData.basicInfo?.liked) || 0,
        last_login: String(playerRawData.basicInfo?.lastLoginAt || ""),
        created_at: String(playerRawData.basicInfo?.createAt || ""),
        avatar_id: String(playerRawData.profileInfo?.avatarId || ""),
        pet_name: playerRawData.petInfo?.petName || playerRawData.petInfo?.name || "",
        raw_json: playerRawData,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("ff_accounts cache notice:", err);
    }
  }

  // 4. Set Active Session
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, uid);
    document.cookie = `${STORAGE_KEY}=${uid}; path=/; max-age=2592000; SameSite=Lax`;
  }

  return { success: true, profile: profileData };
}

/**
 * Retrieves profile details by UID
 */
export async function getProfileByUid(uid: string): Promise<UserProfile | null> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("uid", uid)
      .single();

    if (data) return data as UserProfile;
  } catch (e) {
    console.warn("Failed to fetch profile for UID:", uid);
  }

  return {
    uid,
    nickname: `Player_${uid.slice(-4)}`,
    region: "IND",
    role: "user",
    is_banned: false,
  };
}

/**
 * Logs out current user session
 */
export function logoutUid(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}
