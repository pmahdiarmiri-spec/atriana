"use client";

import React from "react";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyDetailOverviewProps {
  company: PrmCompany;
}

export default function PrmCompanyDetailOverview({
  company,
}: PrmCompanyDetailOverviewProps) {
  return (
    <div
      id="prm-company-detail-overview"
      className="prm-liquid-card-surface p-6 sm:p-8 space-y-6"
    >
      <div>
        <h2 className="text-lg sm:text-xl font-black text-[var(--prm-text-dark)] mb-3 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-[var(--prm-secondary-color)]" />
          <span>معرفی و درباره شرکت</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--prm-text-dark)] leading-8 whitespace-pre-line">
          {company.description ||
            "توضیحات تفصیلی برای این شرکت ثبت نشده است."}
        </p>
      </div>

      {company.main_products && (
        <div className="pt-5 border-t border-slate-200/80">
          <h3 className="text-base font-extrabold text-[var(--prm-text-dark)] mb-3">
            محصولات و خدمات کلیدی
          </h3>
          <p className="text-sm text-[var(--prm-text-dark)] leading-7 whitespace-pre-line">
            {company.main_products}
          </p>
        </div>
      )}

      {company.major_clients && (
        <div className="pt-5 border-t border-slate-200/80">
          <h3 className="text-base font-extrabold text-[var(--prm-text-dark)] mb-2">
            مشتریان و همکاران شاخص
          </h3>
          <p className="text-sm text-[var(--prm-text-light)] leading-7 whitespace-pre-line">
            {company.major_clients}
          </p>
        </div>
      )}

      {company.certifications && (
        <div className="pt-5 border-t border-slate-200/80">
          <h3 className="text-base font-extrabold text-[var(--prm-text-dark)] mb-2">
            استانداردها، افتخارات و گواهینامه‌ها
          </h3>
          <p className="text-sm text-[var(--prm-text-light)] leading-7 whitespace-pre-line">
            {company.certifications}
          </p>
        </div>
      )}
    </div>
  );
}
