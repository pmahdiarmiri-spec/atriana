"use client";

import React from "react";
import Link from "next/link";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyCardItemProps {
  company: PrmCompany;
  locale: string;
}

const PRM_ACTIVITY_LABELS: Record<string, string> = {
  production: "تولیدی",
  distribution: "توزیعی",
  trading: "بازرگانی",
};

export default function PrmCompanyCardItem({
  company,
  locale,
}: PrmCompanyCardItemProps) {
  const locationLabel = [company.province, company.city]
    .filter(Boolean)
    .join(" ، ");

  const productsArray = company.main_products
    ? company.main_products
        .split(/[,،\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return (
    <article
      id={`prm-company-card-${company.id}`}
      className="prm-liquid-card-surface flex flex-col justify-between h-full group"
    >
      <div>
        <div className="prm-card-cover-box relative h-32 w-full bg-gradient-to-br from-[var(--prm-primary-color)] via-slate-800 to-slate-900 overflow-hidden">
          {company.cover_url ? (
            <img
              src={company.cover_url}
              alt={company.name_fa}
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
          )}

          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/15">
            <svg
              className="w-3.5 h-3.5 text-[var(--prm-secondary-color)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{(company.views_count || 0).toLocaleString("fa-IR")}</span>
          </div>

          {company.industry && (
            <span className="absolute top-3 right-3 bg-[var(--prm-secondary-color)] text-[var(--prm-primary-color)] px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow">
              {company.industry.name_fa}
            </span>
          )}
        </div>

        <div className="prm-card-body px-5 pt-0 pb-5">
          <div className="flex items-end gap-3.5 -mt-9 mb-3 relative z-10">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name_fa}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-[var(--prm-primary-color)] text-[var(--prm-secondary-color)] flex items-center justify-center text-xl font-black">
                  {company.name_fa.charAt(0)}
                </div>
              )}
            </div>

            <div className="pb-1 min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--prm-text-dark)] truncate group-hover:text-[var(--prm-accent-color)] transition-colors">
                {company.name_fa}
              </h2>
              {company.name_en && (
                <p
                  className="text-xs font-semibold text-[var(--prm-text-light)] truncate"
                  dir="ltr"
                >
                  {company.name_en}
                </p>
              )}
            </div>
          </div>

          {company.slogan && (
            <p className="text-xs font-semibold text-[var(--prm-accent-color)] mb-2 line-clamp-1">
              «{company.slogan}»
            </p>
          )}

          <p className="text-xs sm:text-sm text-[var(--prm-text-light)] line-clamp-2 leading-relaxed mb-4 min-h-[2.6rem]">
            {company.description ||
              "اطلاعات تکمیلی و شرح فعالیت‌های تجاری و بازرگانی این شرکت در پروفایل اختصاصی قابل مشاهده است."}
          </p>

          <div className="prm-card-meta-badges flex flex-wrap items-center gap-1.5 mb-4">
            {company.activity_type && (
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[var(--prm-text-dark)] text-[11px] font-bold">
                {PRM_ACTIVITY_LABELS[company.activity_type] ??
                  company.activity_type}
              </span>
            )}
            {company.is_knowledge_based && (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                دانش‌بنیان
              </span>
            )}
            {company.is_exporter && (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                صادرکننده
              </span>
            )}
            {company.has_iso && (
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
                دارای ISO
              </span>
            )}
          </div>

          {productsArray.length > 0 && (
            <div className="mb-3">
              <span className="block text-[11px] font-bold text-[var(--prm-text-light)] mb-1">
                محصولات / خدمات اصلی:
              </span>
              <div className="flex flex-wrap gap-1">
                {productsArray.map((prod, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-50 border border-slate-200/80 text-[var(--prm-text-dark)] px-2 py-0.5 rounded-md truncate max-w-[140px]"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="prm-card-footer px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--prm-text-light)] truncate">
          <svg
            className="w-4 h-4 text-[var(--prm-secondary-color)] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">
            {locationLabel || company.country || "ایران"}
          </span>
        </div>

        <Link
          href={`/${locale}/companies/${company.id}`}
          id={`prm-view-company-btn-${company.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--prm-primary-color)] text-[var(--prm-white)] hover:bg-[var(--prm-secondary-color)] hover:text-[var(--prm-primary-color)] text-xs font-extrabold transition-all shrink-0 shadow-sm"
        >
          <span>مشاهده جزئیات</span>
          <svg
            className="w-3.5 h-3.5 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
