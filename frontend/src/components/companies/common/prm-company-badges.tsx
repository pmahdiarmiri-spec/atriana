"use client";

import React, { ReactNode } from "react";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyBadgesProps {
  company: PrmCompany;
  size?: "sm" | "md";
}

export function PrmCompanyBadges({
  company,
  size = "md",
}: PrmCompanyBadgesProps): ReactNode {
  const isSm = size === "sm";

  const badges = [
    {
      show: company.is_knowledge_based,
      title: "دانش‌بنیان",
      gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
      border: "border-amber-400/50",
      text: "text-amber-300",
      icon: (
        <svg className={isSm ? "w-3 h-3" : "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      show: company.is_creative,
      title: "صنایع خلاق",
      gradient: "from-pink-500/20 via-pink-400/10 to-transparent",
      border: "border-pink-400/50",
      text: "text-pink-300",
      icon: (
        <svg className={isSm ? "w-3 h-3" : "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      show: company.is_startup,
      title: "استارتاپ نوآور",
      gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
      border: "border-purple-400/50",
      text: "text-purple-300",
      icon: (
        <svg className={isSm ? "w-3 h-3" : "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        </svg>
      ),
    },
    {
      show: company.is_exporter,
      title: "صادرکننده برتر",
      gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
      border: "border-emerald-400/50",
      text: "text-emerald-300",
      icon: (
        <svg className={isSm ? "w-3 h-3" : "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      show: company.has_iso,
      title: "دارای استاندارد ISO",
      gradient: "from-sky-500/20 via-sky-400/10 to-transparent",
      border: "border-sky-400/50",
      text: "text-sky-300",
      icon: (
        <svg className={isSm ? "w-3 h-3" : "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      show: company.is_emc,
      title: "مدیریت صادرات EMC",
      gradient: "from-orange-500/20 via-orange-400/10 to-transparent",
      border: "border-orange-400/50",
      text: "text-orange-300",
      icon: (
        <svg className={isSm ? "w-3 h-3" : "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.show));

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((b, idx) => (
        <div
          key={idx}
          className={`relative inline-flex items-center gap-1.5 backdrop-blur-xl bg-gradient-to-r ${b.gradient} ${b.border} border shadow-lg rounded-xl ${
            isSm ? "px-2 py-0.5 text-[10px]" : "px-3.5 py-1.5 text-xs"
          } font-black ${b.text} transition-transform hover:scale-105 select-none`}
        >
          <span className="shrink-0">{b.icon}</span>
          <span>{b.title}</span>
        </div>
      ))}
    </div>
  );
}
