"use client";

import React from "react";
import { PrmCompanyAdminDetails } from "@/types/prm-companies/prm-company-admin";
import { ShieldCheck, Check, X, RefreshCw } from "lucide-react";

interface PrmAdminCompanyLegalTabProps {
  locale: string;
  company: PrmCompanyAdminDetails;
}

export const PrmAdminCompanyLegalTab: React.FC<
  PrmAdminCompanyLegalTabProps
> = ({ locale, company }) => {
  const pendingData = company.pending_update_data || {};

  const renderDiffText = (
    originalValue: string | null | undefined,
    fieldKey: string,
    isMono = false
  ) => {
    const hasUpdate = fieldKey in pendingData;
    const newValue = pendingData[fieldKey];
    const baseClass = isMono
      ? "font-mono font-bold text-sm tracking-wider"
      : "text-slate-200";

    if (!hasUpdate) {
      return (
        <span className={`text-white block ${baseClass}`}>
          {originalValue || "-"}
        </span>
      );
    }

    return (
      <div className="flex flex-col gap-1 mt-1">
        <span className={`line-through text-slate-500/70 text-[10px] ${isMono ? "font-mono" : ""}`}>
          {originalValue || "-"}
        </span>
        <span
          className={`text-violet-300 font-semibold bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(139,92,246,0.15)] inline-block w-fit ${baseClass}`}
        >
          {newValue || "-"}
        </span>
      </div>
    );
  };

  const badges = [
    {
      key: "is_knowledge_based",
      label: locale === "fa" ? "دانش‌بنیان" : "Knowledge Based",
      active: company.is_knowledge_based,
    },
    {
      key: "is_creative",
      label: locale === "fa" ? "خلاق" : "Creative",
      active: company.is_creative,
    },
    {
      key: "is_startup",
      label: locale === "fa" ? "استارتاپ" : "Startup",
      active: company.is_startup,
    },
    {
      key: "is_exporter",
      label: locale === "fa" ? "صادرکننده" : "Exporter",
      active: company.is_exporter,
    },
    {
      key: "has_iso",
      label: locale === "fa" ? "دارای ایزو" : "Has ISO",
      active: company.has_iso,
    },
    {
      key: "is_emc",
      label: locale === "fa" ? "EMC" : "EMC",
      active: company.is_emc,
    },
  ];

  return (
    <div className="space-y-4 text-xs prm-company-legal">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "شناسه ملی" : "National ID"}
          </span>
          {renderDiffText(company.national_id, "national_id", true)}
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "شماره ثبت" : "Reg Number"}
          </span>
          {renderDiffText(company.registration_number, "registration_number", true)}
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "کد اقتصادی" : "Economic Code"}
          </span>
          {renderDiffText(company.economic_code, "economic_code", true)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "ساختار حقوقی" : "Legal Structure"}
          </span>
          {renderDiffText(company.legal_structure, "legal_structure")}
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "نوع مالکیت" : "Ownership Type"}
          </span>
          {renderDiffText(company.ownership_type, "ownership_type")}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>
            {locale === "fa"
              ? "صلاحیت‌ها و مجوزهای ویژه"
              : "Special Qualifications & Badges"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {badges.map((badge, idx) => {
            const hasUpdate = badge.key in pendingData;
            const newValue = pendingData[badge.key];
            const isCurrentlyActive = hasUpdate ? newValue : badge.active;

            return (
              <div
                key={idx}
                className={`relative flex items-center justify-between p-2.5 rounded-lg border text-[11px] transition-all overflow-hidden ${
                  hasUpdate
                    ? "bg-violet-500/10 border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                    : isCurrentlyActive
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-white/[0.01] border-white/5 text-slate-500"
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {hasUpdate && <RefreshCw className="w-3 h-3 animate-spin-slow opacity-70" />}
                  {badge.label}
                </span>
                <span className="relative z-10">
                  {isCurrentlyActive ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {(company.certifications || "certifications" in pendingData) && (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa"
              ? "گواهینامه‌ها و استانداردها"
              : "Certifications"}
          </span>
          {renderDiffText(company.certifications, "certifications")}
        </div>
      )}
    </div>
  );
};

export default PrmAdminCompanyLegalTab;
