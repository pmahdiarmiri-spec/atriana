"use client";

import React from "react";

interface PrmCompaniesHeroStatsProps {
  activeCompaniesCount: number;
  coveredCitiesCount: number;
  loading?: boolean;
}

export default function PrmCompaniesHeroStats({
  activeCompaniesCount,
  coveredCitiesCount,
  loading = false,
}: PrmCompaniesHeroStatsProps) {
  return (
    <div
      id="prm-companies-hero-stats-grid"
      className="prm-companies-hero-stats-grid grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg"
    >
      <div
        id="prm-stat-card-active-companies"
        className="prm-liquid-stat-card flex flex-col items-center justify-center text-center"
      >
        <span className="prm-stat-value text-3xl sm:text-4xl font-extrabold text-[var(--prm-secondary-color)] tracking-tight mb-2">
          {loading ? "..." : activeCompaniesCount.toLocaleString("fa-IR")}
        </span>
        <span className="prm-stat-label text-xs sm:text-sm font-medium text-slate-200">
          شرکت فعال
        </span>
      </div>

      <div
        id="prm-stat-card-covered-cities"
        className="prm-liquid-stat-card flex flex-col items-center justify-center text-center"
      >
        <span className="prm-stat-value text-3xl sm:text-4xl font-extrabold text-[var(--prm-secondary-color)] tracking-tight mb-2">
          {loading ? "..." : coveredCitiesCount.toLocaleString("fa-IR")}
        </span>
        <span className="prm-stat-label text-xs sm:text-sm font-medium text-slate-200">
          شهر تحت پوشش
        </span>
      </div>
    </div>
  );
}
