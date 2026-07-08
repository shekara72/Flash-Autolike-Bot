"use client";

import { useEffect, useState } from "react";
import { Calendar, AlertTriangle, RefreshCw, Clock } from "lucide-react";

interface Subscription {
  id: string;
  activated_at: string;
  expires_at: string;
  status: string;
  plans: {
    name: string;
    duration_days: number;
  };
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
  onRenewClick: () => void;
}

export default function SubscriptionCard({ subscription, onRenewClick }: SubscriptionCardProps) {
  const [timeLeftStr, setTimeLeftStr] = useState("00:00:00:00");
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);

  useEffect(() => {
    if (!subscription) return;

    const updateTime = () => {
      const expiryDate = new Date(subscription.expires_at);
      const activatedDate = new Date(subscription.activated_at);
      const today = new Date();
      
      const totalDurationMs = expiryDate.getTime() - activatedDate.getTime();
      const remainingMs = expiryDate.getTime() - today.getTime();
      
      const days = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
      setDaysRemaining(days);

      // Progress calculations
      const progress = totalDurationMs > 0 ? Math.min(1, Math.max(0, remainingMs / totalDurationMs)) : 0;
      setProgressRatio(progress);

      if (remainingMs <= 0) {
        setTimeLeftStr("00:00:00:00");
      } else {
        const d = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
        const h = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remainingMs % (1000 * 60)) / 1000);
        
        const pad = (num: number) => String(num).padStart(2, "0");
        setTimeLeftStr(`${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [subscription]);

  if (!subscription) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4 bg-[#16161F] border-[rgba(255,255,255,0.06)]">
        <AlertTriangle className="h-10 w-10 text-[#FF2E93]" />
        <div>
          <h4 className="text-base font-bold text-white">No Active Plan</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-xs font-semibold">
            Subscribe to one of our premium packages to start enjoying instant autolike interactions.
          </p>
        </div>
        <button
          onClick={onRenewClick}
          className="pink-btn px-5 py-2.5 rounded-xl text-xs w-full sm:w-auto cursor-pointer"
        >
          Browse Plans
        </button>
      </div>
    );
  }

  // Circular calculations: radius 40, circumference 251.2
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  const strokeDashoffset = circumference * (1 - progressRatio);

  const isExpiringSoon = daysRemaining <= 3;

  return (
    <div className="glass-card p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center bg-[#16161F] border-[rgba(255,255,255,0.06)]">
      {/* Circle countdown visual */}
      <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          {/* Foreground progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-[#FF2E93] fill-none transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white leading-none">{daysRemaining}</span>
          <span className="text-[9px] text-gray-500 font-bold uppercase mt-1">Days Left</span>
        </div>
      </div>

      {/* Subscription details */}
      <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
        <div>
          <span className="inline-flex px-2 py-0.5 rounded-full bg-[#FF2E93]/10 text-[10px] font-bold text-[#FF2E93] uppercase tracking-wide">
            Active Subscription
          </span>
          <h3 className="text-xl font-black text-white mt-1">{subscription.plans.name}</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 text-xs text-gray-400 font-semibold">
          <span className="flex items-center gap-1 justify-center sm:justify-start">
            <Calendar className="h-4 w-4 text-[#FF2E93]" />
            <span>Activated: {new Date(subscription.activated_at).toLocaleDateString()}</span>
          </span>
          <span className="hidden sm:inline text-gray-700">|</span>
          <span className="flex items-center gap-1 justify-center sm:justify-start">
            <Calendar className="h-4 w-4 text-[#FF2E93]" />
            <span>Expiry: {new Date(subscription.expires_at).toLocaleDateString()}</span>
          </span>
        </div>

        {/* Real-time Clock Countdown Interface */}
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Clock className="h-4 w-4 text-[#FF2E93]" />
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Remaining Time:</span>
          <span className="font-mono text-sm text-white font-bold bg-[#0B0B0F] px-2.5 py-1 rounded-lg border border-[rgba(255,255,255,0.06)] shadow-inner">
            {timeLeftStr}
          </span>
        </div>

        {isExpiringSoon && (
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-semibold justify-center sm:justify-start">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Renewal recommended! Your plan is expiring in {daysRemaining} days.</span>
          </div>
        )}
      </div>

      {/* Action Renew */}
      <div className="shrink-0 w-full sm:w-auto">
        <button
          onClick={onRenewClick}
          className="pink-btn w-full px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider"
          id="subscription-renew-btn"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Renew Subscription</span>
        </button>
      </div>
    </div>
  );
}
