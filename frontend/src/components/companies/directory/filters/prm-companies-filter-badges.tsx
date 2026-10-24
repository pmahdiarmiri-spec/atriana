"use client";

import React from "react";
import { PrmPublicCompanyFilterParams } from "@/types/prm-company";

interface PrmCompaniesFilterBadgesProps {
  filters: PrmPublicCompanyFilterParams;
  onToggleBadge: (
    badgeKey:
      | "is_knowledge_based"
      | "is_exporter"
      | "has_iso"
      | "is_startup"
      | "is_creative"
      | "is_emc"
  ) => void;
}

const PRM_BADGE_OPTIONS: Array<{
  key:
    | "is_knowledge_based"
    | "is_exporter"
    | "has_iso"
    | "is_startup"
    | "is_creative"
    | "is_emc";
  label: string;
}> = [
  { key: "is_knowledge_based", label: "دانش‌بنیان" },
  { key: "is_exporter", label: "صادرکننده نمونه" },
  { key: "has_iso", label: "دارای گواهی ISO" },
  { key: "is_startup", label: "استارتاپ" },
  { key: "is_creative", label: "خلاق و فناور" },
  { key: "is_emc", label: "شرکت مدیریت صادرات (EMC)" },
];

export default function PrmCompaniesFilterBadges({
  filters,
  onToggleBadge,
}: PrmCompaniesFilterBadgesProps) {
  return (
    <div
      id="prm-companies-filter-badges"
      className="prm-companies-filter-badges flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/70"
    >
      <span className="text-xs font-bold text-[var(--prm-text-light)] ml-2">
        ویژگی‌های تخصصی:
      </span>
      {PRM_BADGE_OPTIONS.map((badge) => {
        const isActive = Boolean(filters[badge.key]);
        return (
          <button
            key={badge.key}
            type="button"
            id={`prm-filter-badge-${badge.key}`}
            onClick={() => onToggleBadge(badge.key)}
            className={`prm-liquid-badge-chip ${
              isActive ? "prm-liquid-badge-chip-active" : ""
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isActive
                  ? "bg-[var(--prm-secondary-color)]"
                  : "bg-slate-400"
              }`}
            />
            <span>{badge.label}</span>
          </button>
        );
      })}
    </div>
  );
}
