"use client";

import React from "react";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyDetailSpecsGridProps {
  company: PrmCompany;
}

export default function PrmCompanyDetailSpecsGrid({
  company,
}: PrmCompanyDetailSpecsGridProps) {
  const specs = [
    { label: "سال تأسیس", value: company.established_year },
    { label: "ساختار حقوقی", value: company.legal_structure },
    { label: "نوع مالکیت", value: company.ownership_type },
    { label: "تعداد پرسنل", value: company.employee_count },
    { label: "ظرفیت تولید / تامین", value: company.production_capacity },
    { label: "مدل کسب‌وکار", value: company.business_model },
    { label: "گستره فعالیت", value: company.activity_scope },
    { label: "گردش مالی سالانه", value: company.annual_revenue },
    { label: "شماره ثبت", value: company.registration_number },
    { label: "شناسه ملی", value: company.national_id },
  ].filter((item) => item.value !== null && item.value !== "");

  if (specs.length === 0) {
    return null;
  }

  return (
    <div
      id="prm-company-detail-specs"
      className="prm-liquid-card-surface p-6 sm:p-8"
    >
      <h2 className="text-lg sm:text-xl font-black text-[var(--prm-text-dark)] mb-5 flex items-center gap-2">
        <span className="w-2 h-6 rounded-full bg-[var(--prm-accent-color)]" />
        <span>مشخصات ثبتی و ساختار سازمانی</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specs.map((spec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between"
          >
            <span className="text-xs font-bold text-[var(--prm-text-light)] mb-1">
              {spec.label}
            </span>
            <span className="text-sm font-extrabold text-[var(--prm-text-dark)]">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
