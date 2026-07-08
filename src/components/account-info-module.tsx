"use client";

import { useState, useEffect } from "react";
import { fetchPlayerAccountDetails, FreeFireAccountData } from "@/lib/api-service";
import {
  Search,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  ShoppingBag,
  Flame,
  Users,
  AlertTriangle,
  Diamond,
  Smile,
  Shield,
  Crown,
  Zap,
  Globe,
  MessageSquare,
  Swords,
  Box,
} from "lucide-react";
import { motion } from "framer-motion";

function renderFreeFireSignature(sig: string): string {
  if (!sig) return "Not Available";
  const clean = sig.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const parts = clean.split(/(\[[a-fA-F0-9]{6}\]|\[b\]|\[i\]|\[c\])/i);
  
  let result = "";
  let isBold = false;
  let isItalic = false;
  let isCentered = false;
  let currentColor = "";
  
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("[") && part.endsWith("]")) {
      const tag = part.slice(1, -1).toLowerCase();
      if (tag === "b") {
        isBold = true;
      } else if (tag === "i") {
        isItalic = true;
      } else if (tag === "c") {
        isCentered = true;
      } else if (/^[a-f0-9]{6}$/i.test(tag)) {
        currentColor = "#" + tag;
      }
    } else {
      let styles = "";
      if (isBold) styles += "font-weight: bold;";
      if (isItalic) styles += "font-style: italic;";
      if (currentColor) styles += `color: ${currentColor};`;
      
      let tokenHtml = part.replace(/\n/g, "<br />");
      if (styles) {
        tokenHtml = `<span style="${styles}">${tokenHtml}</span>`;
      }
      result += tokenHtml;
    }
  }
  
  if (isCentered) {
    return `<div style="text-align: center; width: 100%;">${result}</div>`;
  }
  return `<div>${result}</div>`;
}

function calculateAccountAge(createAtSec: string | number | undefined): string {
  if (!createAtSec) return "N/A";
  const ts = Number(createAtSec);
  if (isNaN(ts) || ts <= 0) return "N/A";
  
  const ms = ts < 10000000000 ? ts * 1000 : ts;
  const createdDate = new Date(ms);
  const currentDate = new Date();
  
  let years = currentDate.getFullYear() - createdDate.getFullYear();
  let months = currentDate.getMonth() - createdDate.getMonth();
  let days = currentDate.getDate() - createdDate.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const parts = [];
  if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} Day${days > 1 ? "s" : ""}`);
  
  return parts.length > 0 ? parts.join(", ") : "Just Created";
}

interface AccountInfoModuleProps {
  initialUid?: string;
  showSearchHeader?: boolean;
}

export default function AccountInfoModule({ initialUid = "", showSearchHeader = true }: AccountInfoModuleProps) {
  const [uidInput, setUidInput] = useState(initialUid);
  const [activeUid, setActiveUid] = useState(initialUid);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<FreeFireAccountData | null>(null);

  const loadAccountDetails = async (uidToFetch: string) => {
    if (!uidToFetch || !uidToFetch.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await fetchPlayerAccountDetails(uidToFetch.trim());
      if (!result || !result.basicInfo?.accountId) {
        setData(null);
        setErrorMsg("No Free Fire account data found for the requested UID. Please verify your UID.");
      } else {
        setData(result);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to query Free Fire account details.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only call API if activeUid is explicitly provided and valid
    if (activeUid && activeUid.trim().length >= 5) {
      loadAccountDetails(activeUid);
    }
  }, [activeUid]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uidInput.trim() || !/^\d{5,15}$/.test(uidInput.trim())) {
      setErrorMsg("Please enter a valid 5 to 15 digit numeric Free Fire UID.");
      return;
    }
    setActiveUid(uidInput.trim());
  };

  const {
    basicInfo,
    profileInfo,
    clanBasicInfo,
    petInfo,
    socialInfo,
    diamondCostRes,
    creditScoreInfo,
    historyEpInfo,
    extraFields,
  } = data || {};

  return (
    <div className="space-y-8 text-white w-full">
      {/* SEARCH SECTION */}
      {showSearchHeader && (
        <div className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] space-y-4 rounded-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Free Fire Account Inspection Portal
              </span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Search Account Information</h2>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  value={uidInput}
                  onChange={(e) => setUidInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Free Fire UID"
                  className="glass-input w-full py-2.5 pl-9 pr-4 text-xs font-semibold rounded-xl text-white font-mono"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="pink-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <Search className="h-4 w-4" />}
                <span>{loading ? "Searching..." : "Search UID"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE DISPLAY */}
      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* LOADING SKELETON ANIMATION */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="glass-card h-64 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col justify-end">
            <div className="h-10 w-48 bg-white/10 rounded-lg mb-2"></div>
            <div className="h-4 w-32 bg-white/5 rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card h-48 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl"></div>
            <div className="glass-card h-48 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl"></div>
          </div>
        </div>
      )}

      {/* NO DATA / INITIAL EMPTY SEARCH PLACEHOLDER */}
      {!loading && !data && (
        <div className="glass-card p-12 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl text-center space-y-3">
          <Search className="h-12 w-12 mx-auto text-[#FF2E93]/60" />
          <h3 className="text-base font-bold text-white uppercase tracking-tight">Account Lookup Ready</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
            Enter Free Fire UID in the input field above and click Search to inspect live profile level, likes, badge ID, pet details, and guild information.
          </p>
        </div>
      )}

      {/* LIVE DATA CARDS DISPLAY */}
      {!loading && data && basicInfo && (
        <div className="space-y-8">
          {/* 1. BASIC INFORMATION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card bg-[#16161F] border-[rgba(255,255,255,0.06)] overflow-hidden relative rounded-2xl"
          >
            <div className="h-40 w-full relative bg-gradient-to-r from-pink-900/40 via-purple-950/40 to-pink-950/40 overflow-hidden">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="bg-[#0B0B0F]/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#FF2E93] border border-[#FF2E93]/20 uppercase">
                  Region: {basicInfo.region || "IND"}
                </span>
                {basicInfo.banStatus && (
                  <span className={`bg-[#0B0B0F]/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${basicInfo.banStatus === "Not Banned" ? "text-green-400 border-green-500/20" : "text-red-400 border-red-500/20"}`}>
                    Status: {basicInfo.banStatus}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 relative pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-6 gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
                <div className="flex items-end gap-4">
                  <div className="h-28 w-28 rounded-2xl border-4 border-[#FF2E93] bg-[#0B0B0F] p-1 shadow-xl flex items-center justify-center font-black text-2xl text-[#FF2E93] uppercase shrink-0">
                    {basicInfo.nickname.slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                      {basicInfo.nickname}
                      <ShieldCheck className="h-6 w-6 text-[#FF2E93]" />
                    </h2>
                    <p className="text-xs font-mono font-bold text-gray-400 mt-0.5">UID: {basicInfo.accountId}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {basicInfo.titleName && (
                        <span className="text-[10px] font-bold text-yellow-300 bg-yellow-950/40 border border-yellow-700 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <Crown className="h-3 w-3" /> {basicInfo.titleName}
                        </span>
                      )}
                      {basicInfo.pinName && (
                        <span className="text-[10px] font-bold text-pink-300 bg-pink-950/40 border border-pink-700 px-2.5 py-0.5 rounded-full uppercase">
                          Pin: {basicInfo.pinName}
                        </span>
                      )}
                      {basicInfo.releaseVersion && (
                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800 px-2.5 py-0.5 rounded-full uppercase font-mono">
                          Ver: {basicInfo.releaseVersion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)] text-center min-w-[90px]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Level</span>
                    <span className="text-xl font-black text-white">{basicInfo.level}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)] text-center min-w-[90px]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Likes</span>
                    <span className="text-xl font-black text-[#FF2E93]">{basicInfo.liked.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)] text-center min-w-[90px]">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">EXP</span>
                    <span className="text-sm font-black text-gray-300 font-mono">{basicInfo.exp.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Grid Mapped Basic Specifications */}
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Basic Information Fields</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-300">
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">BR Ranking</span>
                  <span className="text-yellow-400 font-bold">{basicInfo.rankingName || `Rank ${basicInfo.rank || "N/A"}`}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">BR Rank Points</span>
                  <span className="text-yellow-400 font-mono font-bold">{basicInfo.rankingPoints || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">CS Ranking</span>
                  <span className="text-purple-400 font-bold">{basicInfo.csRankingName || `CS Rank ${basicInfo.csRank || "N/A"}`}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">CS Rank Points</span>
                  <span className="text-purple-400 font-mono font-bold">{basicInfo.csRankingPoints || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Equipped Gun Skin</span>
                  <span className="text-cyan-400 font-bold text-[11px] truncate block">{basicInfo.equippedGunName || "Default Skin"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Equipped Animation</span>
                  <span className="text-pink-400 font-bold text-[11px] truncate block">{basicInfo.equippedAnimationName || "Default Animation"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Head Pic Name</span>
                  <span className="text-white font-semibold text-[11px]">{basicInfo.headPicName || basicInfo.headPic || "Standard"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Season ID</span>
                  <span className="text-white font-mono text-[11px]">Season {basicInfo.seasonId || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Equipped Badge ID</span>
                  <span className="text-white font-mono text-[11px]">{basicInfo.badgeId || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Badge Count</span>
                  <span className="text-white font-mono text-[11px]">{basicInfo.badgeCnt || 0} Badges</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Prime Level</span>
                  <span className="text-pink-400 font-bold text-[11px]">Level {(basicInfo as any).primeLevel?.level || "N/A"}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Account Age</span>
                  <span className="text-amber-400 font-bold text-[11px]">{calculateAccountAge(basicInfo.createAt)}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Account Created Date</span>
                  <span className="text-gray-300 font-mono text-[11px]">{basicInfo.createAt}</span>
                </div>
                <div className="bg-[#0B0B0F] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Last Login Timestamp</span>
                  <span className="text-green-400 font-bold text-[11px]">{basicInfo.lastLoginAt}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. PROFILE & OUTFIT / SKILLS CARD */}
          {profileInfo && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-4"
            >
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <Layers className="h-4 w-4 text-[#FF2E93]" />
                <span>Profile, Avatar & Equipped Skills</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-2">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Character Avatar</span>
                  <p className="text-sm font-black text-purple-400">{profileInfo.avatarName || `Avatar ID: ${profileInfo.avatarId || "Default"}`}</p>
                  {profileInfo.equippedSkillsNames && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Equipped Skills</span>
                      <p className="text-xs text-white font-medium">{profileInfo.equippedSkillsNames}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-2">
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Outfit Gallery (Clothes)</span>
                  {profileInfo.clothesNames && profileInfo.clothesNames.length > 0 ? (
                    <ul className="space-y-1 text-xs text-gray-300">
                      {profileInfo.clothesNames.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <Flame className="h-3 w-3 text-[#FF2E93]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-xs">Standard Clothes Equipped</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. CLAN / GUILD INFORMATION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-6"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
              <Users className="h-4 w-4 text-[#FF2E93]" />
              <span>Clan / Guild Information</span>
            </h3>

            {clanBasicInfo?.available && clanBasicInfo.clanName ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0B0B0F] p-4 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <div className="h-16 w-16 rounded-xl bg-[#FF2E93]/20 flex items-center justify-center font-black text-[#FF2E93] border border-[#FF2E93] text-lg uppercase shrink-0">
                    {clanBasicInfo.clanName.slice(0, 2)}
                  </div>
                  <div className="flex-1 text-xs text-center sm:text-left">
                    <h4 className="text-lg font-black text-white uppercase">{clanBasicInfo.clanName}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">Clan ID: {clanBasicInfo.clanId}</p>
                    {clanBasicInfo.captainId && (
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">Captain UID: {clanBasicInfo.captainId}</p>
                    )}
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="bg-[#16161F] p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)] min-w-[70px]">
                      <span className="text-[8px] text-gray-500 font-bold uppercase block">Level</span>
                      <span className="text-sm font-black text-white">{clanBasicInfo.clanLevel}</span>
                    </div>
                    <div className="bg-[#16161F] p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)] min-w-[80px]">
                      <span className="text-[8px] text-gray-500 font-bold uppercase block">Members</span>
                      <span className="text-sm font-black text-[#FF2E93]">{clanBasicInfo.memberNum} / {clanBasicInfo.capacity || 25}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#0B0B0F] rounded-xl border border-[rgba(255,255,255,0.04)] text-center text-gray-500 space-y-2">
                <Users className="h-8 w-8 mx-auto text-gray-600" />
                <p className="text-xs font-bold text-gray-400 uppercase">No Guild Information Available</p>
              </div>
            )}
          </motion.div>

          {/* 4. PET INFORMATION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
              <Smile className="h-4 w-4 text-[#FF2E93]" />
              <span>Pet Details</span>
            </h3>

            {petInfo && petInfo.petName ? (
              <div className="bg-[#0B0B0F] p-4 rounded-xl border border-[rgba(255,255,255,0.04)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white">{petInfo.petName} <span className="text-xs font-normal text-gray-500">(ID: {petInfo.id || "N/A"})</span></span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${petInfo.equipped ? "bg-green-950 text-[#00E676] border border-green-800" : "bg-gray-800 text-gray-400"}`}>
                    {petInfo.equipped ? "Equipped" : "Unequipped"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Pet Level</span>
                    <span className="text-[#FF2E93] font-bold">Level {petInfo.level || 1}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Pet EXP</span>
                    <span className="text-white font-mono">{petInfo.exp || 0}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Selected Skill</span>
                    <span className="text-purple-400 font-bold">{petInfo.skillName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase block">Skin Name</span>
                    <span className="text-gray-300 font-semibold">{petInfo.skinName || "Default Skin"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#0B0B0F] rounded-xl border border-[rgba(255,255,255,0.04)] text-center text-gray-500">
                <p className="text-xs font-bold text-gray-400 uppercase">No Pet Information Available</p>
              </div>
            )}
          </motion.div>

          {/* 5. DIAMOND COST, CREDIT SCORE & SOCIAL INFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-3"
            >
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <Diamond className="h-4 w-4 text-[#FF2E93]" />
                <span>Diamond Information</span>
              </h3>
              <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold uppercase">Diamond Cost</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{diamondCostRes?.diamondCost || 0} Diamonds</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-3"
            >
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <Shield className="h-4 w-4 text-[#FF2E93]" />
                <span>Credit Score</span>
              </h3>
              {creditScoreInfo?.available ? (
                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-bold uppercase">Score</span>
                    <span className="text-xl font-black text-green-400 font-mono">{creditScoreInfo.creditScore}</span>
                  </div>
                  {creditScoreInfo.periodicSummaryEndTime && (
                    <p className="text-[9px] text-gray-500 font-mono pt-1 border-t border-white/5">Summary End: {creditScoreInfo.periodicSummaryEndTime}</p>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 text-center text-xs font-bold text-gray-500 uppercase">
                  No Credit Score Data
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-3"
            >
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <Globe className="h-4 w-4 text-[#FF2E93]" />
                <span>Social & Language</span>
              </h3>
              {socialInfo?.available ? (
                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-bold uppercase">Language:</span>
                    <span className="text-white font-bold">{socialInfo.language || "English"}</span>
                  </div>
                  {socialInfo.signature && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Signature</span>
                      <div 
                        className="text-[10px] font-mono leading-relaxed bg-white/5 p-2.5 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: renderFreeFireSignature(socialInfo.signature) }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#0B0B0F] rounded-xl border border-white/5 text-center text-xs font-bold text-gray-500 uppercase">
                  No Social Info
                </div>
              )}
            </motion.div>
          </div>

          {/* 6. HISTORY EP / BOOYAH PASS CARD */}
          {historyEpInfo && historyEpInfo.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-4"
            >
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <Award className="h-4 w-4 text-[#FF2E93]" />
                <span>History EP / Booyah Pass Records ({historyEpInfo.length} Seasons)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {historyEpInfo.slice(0, 18).map((epItem, idx) => (
                  <div key={idx} className="p-3 bg-[#0B0B0F] rounded-xl border border-white/5 text-center space-y-1">
                    <span className="text-[9px] font-mono font-bold text-gray-500 block">Season #{epItem.epEventId || idx + 1}</span>
                    <p className="text-xs font-black text-[#FF2E93]">{epItem.badgeCnt || 0} Badges</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase ${epItem.ownedPass ? "bg-amber-950 text-amber-400 border border-amber-800" : "bg-gray-800 text-gray-400"}`}>
                      {epItem.ownedPass ? "Pass Owned" : "Standard"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 7. WEAPON SKINS SHOWCASE CARD */}
          {basicInfo.weaponSkinNames && basicInfo.weaponSkinNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-4"
            >
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <Swords className="h-4 w-4 text-[#FF2E93]" />
                <span>Equipped Weapon Skins</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {basicInfo.weaponSkinNames.map((skin, idx) => (
                  <div key={idx} className="px-4 py-2 bg-[#0B0B0F] rounded-xl border border-cyan-900/40 text-cyan-400 text-xs font-bold flex items-center gap-2">
                    <Swords className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{skin}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 8. DYNAMIC RENDERER FOR FUTURE & UNMAPPED API FIELDS */}
          {extraFields && Object.keys(extraFields).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-[#16161F] border-[rgba(255,255,255,0.06)] rounded-2xl space-y-4"
            >
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <Box className="h-4 w-4 text-[#FF2E93]" />
                <span>Additional Dynamic API Fields</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(extraFields).map(([key, val]) => (
                  <div key={key} className="p-3 bg-[#0B0B0F] rounded-xl border border-white/5 text-xs font-mono">
                    <span className="text-[9px] text-[#FF2E93] font-bold uppercase block">{key}</span>
                    <pre className="text-gray-300 text-[10px] overflow-x-auto mt-1 whitespace-pre-wrap">
                      {typeof val === "object" ? JSON.stringify(val, null, 2) : String(val)}
                    </pre>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
