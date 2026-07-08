import { supabase } from "@/lib/supabase";

export interface BasicInformation {
  accountId: string;
  accountType?: string | number;
  nickname: string;
  region: string;
  level: number;
  exp: number;
  expNeeded?: number;
  maxLevelExp?: number;
  levelProgress?: string;
  bannerId?: string | number;
  headPic?: string | number;
  headPicName?: string;
  rank?: string | number;
  rankingName?: string;
  rankingPoints?: number | string;
  maxRank?: string | number;
  csRank?: string | number;
  csMaxRank?: string | number;
  csRankingName?: string;
  csRankingPoints?: number | string;
  badgeId?: string | number;
  badgeCnt?: number;
  seasonId?: string | number;
  liked: number;
  lastLoginAt: string;
  createAt: string;
  pinId?: string | number;
  pinName?: string;
  title?: string | number;
  titleName?: string;
  equippedAnimationId?: string;
  equippedAnimationName?: string;
  equippedGunId?: string;
  equippedGunName?: string;
  banStatus?: string;
  releaseVersion?: string;
  weaponSkinNames?: string[];
  weaponSkinIds?: (string | number)[];
  accountPrefers?: Record<string, any>;
  externalIconInfo?: Record<string, any>;
  primeLevel?: Record<string, any>;
}

export interface ProfileInformation {
  avatarId?: string | number;
  avatarName?: string;
  clothes?: (string | number)[];
  clothesNames?: string[];
  equippedSkills?: (string | number)[];
  equippedSkillsNames?: string;
  isSelected?: boolean;
  isSelectedAwaken?: boolean;
}

export interface ClanBasicInformation {
  available: boolean;
  clanId?: string | number;
  clanName?: string;
  clanLevel?: number;
  memberNum?: number;
  capacity?: number;
  captainId?: string;
  rawDetails?: Record<string, any>;
}

export interface PetInformation {
  equipped: boolean;
  id?: string | number;
  petName?: string;
  level?: number;
  exp?: number;
  selectedSkillId?: string | number;
  skillName?: string;
  skinId?: string | number;
  skinName?: string;
  petImage?: string;
}

export interface SocialInformation {
  available: boolean;
  language?: string;
  signature?: string;
  rankShow?: string;
  rawDetails?: Record<string, any>;
}

export interface DiamondCostRes {
  diamondCost: number;
}

export interface CreditScoreInfo {
  available: boolean;
  creditScore?: number;
  periodicSummaryEndTime?: string;
  rawDetails?: Record<string, any>;
}

export interface HistoryEpInfo {
  badgeCnt?: number;
  bpIcon?: string;
  epBadge?: number;
  epEventId?: number;
  eventName?: string;
  maxLevel?: number;
  ownedPass?: boolean;
}

export interface FreeFireAccountData {
  basicInfo: BasicInformation;
  profileInfo?: ProfileInformation;
  clanBasicInfo?: ClanBasicInformation;
  petInfo?: PetInformation;
  socialInfo?: SocialInformation;
  diamondCostRes?: DiamondCostRes;
  creditScoreInfo?: CreditScoreInfo;
  historyEpInfo?: HistoryEpInfo[];
  rawApiData?: Record<string, any>;
  extraFields?: Record<string, any>;
}

export interface DeliveryProgressData {
  todayStatus: "Delivered" | "In Queue" | "Processing" | "Scheduled";
  totalEstimatedDelivery: number;
  totalDelivered: number;
  remainingEstimatedDelivery: number;
  nextScheduledTime: string;
  progressPercentage: number;
}

// In-Memory Client Cache
const clientCache = new Map<string, FreeFireAccountData>();

export function formatUnixTimestamp(val: string | number | undefined | null): string {
  if (!val) return "Not Available";
  const num = Number(val);
  if (!isNaN(num) && num > 1000000000) {
    const date = new Date(num * (num < 10000000000 ? 1000 : 1));
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return String(val);
}

export function getMockAccountData(uid: string): FreeFireAccountData {
  return {
    basicInfo: {
      accountId: uid,
      nickname: `Player_${uid.slice(-4)}`,
      region: "IND",
      level: 64,
      liked: 17545,
      exp: 1567221,
      createAt: formatUnixTimestamp("1624948311"),
      lastLoginAt: formatUnixTimestamp("1783220343"),
      rankingName: "Heroic II (4102)",
      csRankingName: "Master (86 Star)",
      titleName: "5 Years Old",
      equippedGunName: "MP5 - Platinum Divinity",
      equippedAnimationName: "Golden Heist",
      banStatus: "Not Banned",
    },
    profileInfo: {
      avatarName: "Wolfrahh",
      clothesNames: [
        "Fracture Freestyle (Top)",
        "Fracture Freestyle (Head)",
        "Classic Jazz Pants",
        "EWC 2025 Bandana",
      ],
      equippedSkillsNames: "Wolfrahh (Passive), Oscar (Active), Elite Hayato (Passive), Jota (Passive)",
    },
    clanBasicInfo: {
      available: true,
      clanName: "FLASH_ELITE",
      clanLevel: 4,
      memberNum: 28,
      capacity: 30,
      clanId: "3052268070",
    },
    petInfo: {
      equipped: true,
      petName: "Beaston",
      skillName: "Helping Hand",
      skinName: "Pet Skin: Default",
      level: 4,
      exp: 540,
    },
    socialInfo: {
      available: true,
      language: "English",
      signature: "⚡ FLASH AUTOLIKE BOT USER ⚡",
    },
    diamondCostRes: {
      diamondCost: 390,
    },
    creditScoreInfo: {
      available: true,
      creditScore: 100,
    },
    historyEpInfo: [
      { badgeCnt: 152, bpIcon: "UI_BP_Emoji_Gemini25", epBadge: 1001000097, eventName: "Booyah Pass Season 97", ownedPass: true }
    ],
    rawApiData: {},
  };
}

export function getMockDeliveryProgress(durationDays: number = 30): DeliveryProgressData {
  const totalEst = durationDays * 220;
  const elapsedDays = Math.min(12, durationDays);
  const delivered = elapsedDays * 220;
  const remaining = Math.max(0, totalEst - delivered);
  const pct = Math.round((delivered / totalEst) * 100);

  return {
    todayStatus: "Delivered",
    totalEstimatedDelivery: totalEst,
    totalDelivered: delivered,
    remainingEstimatedDelivery: remaining,
    nextScheduledTime: "4:00 AM IST Tomorrow",
    progressPercentage: pct,
  };
}

export async function fetchPlayerAccountDetails(uid: string): Promise<FreeFireAccountData> {
  const cleanUid = uid.trim();
  if (!cleanUid) throw new Error("UID is required.");

  // Check In-Memory Cache
  if (clientCache.has(cleanUid)) {
    return clientCache.get(cleanUid)!;
  }

  // Check SessionStorage Cache
  if (typeof window !== "undefined") {
    try {
      const cachedSession = sessionStorage.getItem(`ff_player_${cleanUid}`);
      if (cachedSession) {
        const parsed = JSON.parse(cachedSession);
        clientCache.set(cleanUid, parsed);
        return parsed;
      }
    } catch (e) {}
  }

  let errorDetails = "";

  // Attempt 1: Server Proxy Route (`/api/player-info`)
  try {
    const response = await fetch(`/api/player-info?uid=${encodeURIComponent(cleanUid)}`);
    const resData = await response.json();

    if (response.ok) {
      const dataPayload = resData.data || resData.basicInfo ? resData : resData.data;
      if (dataPayload) {
        const normalized = normalizeApiResponse(cleanUid, dataPayload);
        clientCache.set(cleanUid, normalized);

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(`ff_player_${cleanUid}`, JSON.stringify(normalized));
          } catch (e) {}
        }

        // Upsert into Supabase `ff_accounts` table asynchronously
        try {
          await supabase.from("ff_accounts").upsert({
            uid: cleanUid,
            nickname: normalized.basicInfo.nickname,
            region: normalized.basicInfo.region,
            level: normalized.basicInfo.level,
            likes: normalized.basicInfo.liked,
            last_login: normalized.basicInfo.lastLoginAt,
            created_at: normalized.basicInfo.createAt,
            raw_json: normalized,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {}

        return normalized;
      }
    } else {
      errorDetails = resData.error || `HTTP ${response.status}`;
    }
  } catch (err: any) {
    console.warn("API proxy fetch failed:", err);
    errorDetails = err.message || "Network error";
  }

  // Attempt 2: Direct Fallback Service
  try {
    const directRes = await fetch(`https://info.killersharmabot.online/player-info?uid=${encodeURIComponent(cleanUid)}`);
    if (directRes.ok) {
      const rawData = await directRes.json();
      if (rawData.error === "Player not found." || rawData.error) {
        throw new Error("Player Not Found");
      }
      const payload = rawData.data || rawData;
      const normalized = normalizeApiResponse(cleanUid, payload);
      clientCache.set(cleanUid, normalized);
      return normalized;
    }
  } catch (err: any) {
    console.warn("Direct external API fetch notice:", err);
    if (err.message === "Player Not Found") {
      throw err;
    }
  }

  // Never return fake/mock data - throw error instead
  throw new Error(errorDetails || "Player Not Found");
}

function normalizeApiResponse(uid: string, raw: any): FreeFireAccountData {
  const b = raw.basicInfo || raw.basic || raw.captainBasicInfo || raw || {};
  const p = raw.profileInfo || raw.profile || {};
  const c = raw.clanBasicInfo || raw.clan || {};
  const pet = raw.petInfo || raw.pet || {};
  const s = raw.socialInfo || raw.social || {};
  const d = raw.diamondCostRes || raw.diamond || {};
  const cr = raw.creditScoreInfo || raw.credit || {};
  const ep = Array.isArray(raw.historyEpInfo) ? raw.historyEpInfo : [];

  const basicInfo: BasicInformation = {
    accountId: String(b.accountId || b.uid || uid),
    accountType: b.accountType,
    nickname: b.nickname || b.name || `Player_${uid.slice(-4)}`,
    region: b.region || "IND",
    level: Number(b.level) || 0,
    exp: Number(b.exp) || 0,
    expNeeded: Number(b.expNeeded) || undefined,
    maxLevelExp: Number(b.maxLevelExp) || undefined,
    levelProgress: b.levelProgress,
    bannerId: b.bannerId,
    headPic: b.headPic,
    headPicName: b.headPicName || "Default Avatar",
    rank: b.rank,
    rankingName: b.rankingName || "N/A",
    rankingPoints: b.rankingPoints,
    maxRank: b.maxRank,
    csRank: b.csRank,
    csMaxRank: b.csMaxRank,
    csRankingName: b.csRankingName || "N/A",
    csRankingPoints: b.csRankingPoints,
    badgeId: b.badgeId,
    badgeCnt: b.badgeCnt,
    seasonId: b.seasonId || "Current Season",
    liked: Number(b.liked || b.likes) || 0,
    lastLoginAt: formatUnixTimestamp(b.lastLoginAt),
    createAt: formatUnixTimestamp(b.createAt),
    pinId: b.pinId,
    pinName: b.pinName,
    title: b.title,
    titleName: b.titleName || "None",
    equippedAnimationId: b.equippedAnimationId,
    equippedAnimationName: b.equippedAnimationName || "Default Motion",
    equippedGunId: b.equippedGunId,
    equippedGunName: b.equippedGunName || "Evo Gun Skin",
    banStatus: b.banStatus || (b.isBanned ? "Banned" : "Not Banned"),
    releaseVersion: b.releaseVersion,
    weaponSkinNames: b.weaponSkinNames || [],
    weaponSkinIds: b.weaponSkinIds || [],
    accountPrefers: b.accountPrefers || {},
    externalIconInfo: b.externalIconInfo || {},
    primeLevel: b.primeLevel || {},
  };

  const profileInfo: ProfileInformation = {
    avatarId: p.avatarId,
    avatarName: p.avatarName || "Kelly / Alok",
    clothes: p.clothes || [],
    clothesNames: p.clothesNames || [],
    equippedSkills: p.equippedSkills || [],
    equippedSkillsNames: p.equippedSkillsNames || "Wolfrahh, Alok, Hayato",
    isSelected: p.isSelected,
    isSelectedAwaken: p.isSelectedAwaken,
  };

  const hasClan = c && (c.clanName || c.clanId || Object.keys(c).length > 0);
  const clanBasicInfo: ClanBasicInformation = {
    available: !!hasClan,
    clanId: c.clanId,
    clanName: c.clanName || "No Guild",
    clanLevel: Number(c.clanLevel) || 1,
    memberNum: Number(c.memberNum) || 0,
    capacity: Number(c.capacity) || 50,
    captainId: c.captainId,
    rawDetails: c,
  };

  const hasPet = pet && (pet.petName || pet.name || Object.keys(pet).length > 0);
  const petInfo: PetInformation = {
    equipped: !!hasPet,
    id: pet.id,
    petName: pet.petName || pet.name || "None",
    level: Number(pet.level) || 1,
    exp: Number(pet.exp) || 0,
    selectedSkillId: pet.selectedSkillId,
    skillName: pet.skillName || "Standard Skill",
    skinId: pet.skinId,
    skinName: pet.skinName || "Default Skin",
  };

  const hasSocial = s && Object.keys(s).length > 0;
  const socialInfo: SocialInformation = {
    available: !!hasSocial,
    language: s.language || "English",
    signature: s.signature || "Welcome to my Free Fire Profile!",
    rankShow: s.rankShow,
    rawDetails: s,
  };

  const diamondCostRes: DiamondCostRes = {
    diamondCost: Number(d.diamondCost) || 0,
  };

  const hasCredit = cr && Object.keys(cr).length > 0;
  const creditScoreInfo: CreditScoreInfo = {
    available: !!hasCredit,
    creditScore: Number(cr.creditScore || cr.score) || 100,
    periodicSummaryEndTime: formatUnixTimestamp(cr.periodicSummaryEndTime),
    rawDetails: cr,
  };

  return {
    basicInfo,
    profileInfo,
    clanBasicInfo,
    petInfo,
    socialInfo,
    diamondCostRes,
    creditScoreInfo,
    historyEpInfo: ep,
    rawApiData: raw,
  };
}

export async function testApiConnection(apiUrl: string, apiKey?: string): Promise<{ success: boolean; message: string; responseTimeMs: number }> {
  const startTime = Date.now();
  try {
    let testUrl = "";
    if (apiUrl.includes("{UID}")) {
      testUrl = apiUrl.replace("{UID}", "916487927");
    } else {
      testUrl = `${apiUrl.replace(/\/$/, "")}?uid=916487927&key=${encodeURIComponent(apiKey || "Flash")}`;
    }

    const res = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseTimeMs = Date.now() - startTime;

    if (res.ok) {
      return { success: true, message: `API Connected successfully (${res.status} OK)`, responseTimeMs };
    } else {
      return { success: false, message: `API responded with status: ${res.status}`, responseTimeMs };
    }
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to reach API endpoint", responseTimeMs: Date.now() - startTime };
  }
}
