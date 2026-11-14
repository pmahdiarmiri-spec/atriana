"use client";

import React from "react";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyDetailOverviewProps {
  company: PrmCompany;
}

export default function PrmCompanyDetailOverview({
  company,
}: PrmCompanyDetailOverviewProps) {
  const products = company.main_products
    ? company.main_products.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const partners = company.major_clients
    ? company.major_clients.split("|").map((s) => s.trim()).filter(Boolean)
    : [];

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

      {products.length > 0 && (
        <div className="pt-5 border-t border-slate-200/80">
          <h3 className="text-base font-extrabold text-[var(--prm-text-dark)] mb-3">
            محصولات و پکیج‌های شاخص
          </h3>
          <div className="flex flex-wrap gap-2">
            {products.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-extrabold text-[var(--prm-text-dark)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {partners.length > 0 && (
        <div className="pt-5 border-t border-slate-200/80">
          <h3 className="text-base font-extrabold text-[var(--prm-text-dark)] mb-3">
            سابقه همکاری با برندهای بزرگ و مشتریان کلیدی
          </h3>
          <div className="flex flex-wrap gap-2">
            {partners.map((partner, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/40 text-xs font-extrabold text-[var(--prm-text-dark)]"
              >
                ★ {partner}
              </span>
            ))}
          </div>
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
