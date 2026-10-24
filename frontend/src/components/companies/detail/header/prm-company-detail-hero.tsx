"use client";

import React from "react";
import Link from "next/link";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyDetailHeroProps {
  company: PrmCompany;
  locale: string;
}

const PRM_ACTIVITY_LABELS: Record<string, string> = {
  production: "واحد تولیدی",
  distribution: "واحد توزیعی و پخش",
  trading: "واحد بازرگانی و تجاری",
};

export default function PrmCompanyDetailHero({
  company,
  locale,
}: PrmCompanyDetailHeroProps) {
  return (
    <section
      id="prm-company-detail-hero"
      className="prm-liquid-hero-wrapper text-[var(--prm-white)] pt-6 pb-14 px-4 sm:px-8 lg:px-16"
    >
      <div className="prm-liquid-hero-ambient-orb-one" />
      <div className="prm-liquid-hero-ambient-orb-two" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between gap-4 pb-8">
          <Link
            href={`/${locale}/companies`}
            id="prm-back-to-companies-btn"
            className="prm-liquid-glass-nav-pill text-xs sm:text-sm font-bold"
          >
            <svg
              className="w-4 h-4 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>بازگشت به بانک شرکت‌ها</span>
          </Link>

          <Link
            href={`/${locale}`}
            className="text-xl font-black tracking-tight"
            dir="ltr"
          >
            <span className="text-[var(--prm-white)]">Trade</span>
            <span className="text-[var(--prm-secondary-color)]">Portfolio</span>
          </Link>
        </div>

        {company.cover_url && (
          <div className="w-full h-48 sm:h-64 rounded-3xl overflow-hidden mb-8 border border-white/15 shadow-2xl">
            <img
              src={company.cover_url}
              alt={company.name_fa}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2 shadow-2xl border-2 border-[var(--prm-secondary-color)] flex items-center justify-center shrink-0">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name_fa}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-[var(--prm-primary-color)] text-[var(--prm-secondary-color)] flex items-center justify-center text-3xl font-black">
                  {company.name_fa.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {company.industry && (
                  <span className="px-3 py-1 rounded-full bg-[var(--prm-secondary-color)] text-[var(--prm-primary-color)] text-xs font-extrabold">
                    {company.industry.name_fa}
                  </span>
                )}
                {company.activity_type && (
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200">
                    {PRM_ACTIVITY_LABELS[company.activity_type] ??
                      company.activity_type}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-amber-300">
                  {company.views_count.toLocaleString("fa-IR")} بازدید
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white mb-1">
                {company.name_fa}
              </h1>

              {company.name_en && (
                <p
                  className="text-sm sm:text-base text-slate-300 font-semibold"
                  dir="ltr"
                >
                  {company.name_en}
                </p>
              )}

              {company.slogan && (
                <p className="text-sm text-[var(--prm-secondary-color)] font-bold mt-2">
                  «{company.slogan}»
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {company.is_knowledge_based && (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold">
                دانش‌بنیان
              </span>
            )}
            {company.is_exporter && (
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold">
                صادرکننده
              </span>
            )}
            {company.has_iso && (
              <span className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-extrabold">
                دارای گواهی ISO
              </span>
            )}
            {company.is_startup && (
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-extrabold">
                استارتاپ
              </span>
            )}
            {company.is_creative && (
              <span className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-extrabold">
                خلاق و فناور
              </span>
            )}
            {company.is_emc && (
              <span className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-extrabold">
                مدیریت صادرات (EMC)
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
