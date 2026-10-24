"use client";

import React from "react";
import Link from "next/link";
import PrmCompaniesHeroStats from "./prm-companies-hero-stats";

interface PrmCompaniesHeroBannerProps {
  locale: string;
  activeCompaniesCount: number;
  coveredCitiesCount: number;
  loading?: boolean;
}

export default function PrmCompaniesHeroBanner({
  locale,
  activeCompaniesCount,
  coveredCitiesCount,
  loading = false,
}: PrmCompaniesHeroBannerProps) {
  return (
    <section
      id="prm-companies-hero-banner"
      className="prm-liquid-hero-wrapper text-[var(--prm-white)] pt-6 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-16"
    >
      <div className="prm-liquid-hero-ambient-orb-one" />
      <div className="prm-liquid-hero-ambient-orb-two" />

      <div className="prm-hero-container max-w-7xl mx-auto relative z-10">
        <div
          id="prm-companies-hero-topbar"
          className="prm-companies-hero-topbar flex items-center justify-between gap-4 pb-10 sm:pb-14"
        >
          <div className="prm-hero-brand flex items-center">
            <Link
              href={`/${locale}`}
              id="prm-trade-portfolio-logo"
              className="prm-trade-portfolio-logo text-xl sm:text-2xl font-black tracking-tight select-none"
              dir="ltr"
            >
              <span className="text-[var(--prm-white)]">Trade</span>
              <span className="text-[var(--prm-secondary-color)]">Portfolio</span>
            </Link>
          </div>

          <div className="prm-hero-top-actions flex items-center gap-3">
            <Link
              href={`/${locale}`}
              id="prm-hero-home-btn"
              className="prm-liquid-glass-nav-pill text-xs sm:text-sm font-semibold"
            >
              <svg
                className="w-4 h-4 text-[var(--prm-white)]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>خانه</span>
            </Link>

            <Link
              href={`/${locale}/login`}
              id="prm-hero-login-btn"
              className="prm-liquid-glass-nav-pill text-xs sm:text-sm font-semibold"
            >
              <svg
                className="w-4 h-4 text-[var(--prm-white)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>ورود</span>
            </Link>
          </div>
        </div>

        <div
          id="prm-companies-hero-main-grid"
          className="prm-companies-hero-main-grid grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center"
        >
          <div className="prm-hero-right-content lg:col-span-6 flex flex-col items-start text-right">
            <h1
              id="prm-companies-hero-title"
              className="prm-companies-hero-title text-3xl sm:text-5xl lg:text-[3.25rem] font-black leading-[1.28] tracking-tight mb-5"
            >
              <span className="block text-[var(--prm-white)]">
                بانک جامع اطلاعات
              </span>
              <span className="block text-[var(--prm-secondary-color)] mt-1">
                شرکت‌های تجاری
              </span>
            </h1>

            <p
              id="prm-companies-hero-subtitle"
              className="prm-companies-hero-subtitle text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mb-8 font-normal"
            >
              دسترسی به اطلاعات کامل، محصولات و سوابق برترین شرکت‌های ایرانی و
              بین‌المللی
            </p>

            <div className="prm-hero-cta-wrapper flex flex-wrap items-center gap-4">
              <Link
                href={`/${locale}/dashboard/company`}
                id="prm-register-new-company-btn"
                className="prm-liquid-cta-amber text-sm sm:text-base"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--prm-primary-color)] text-[var(--prm-secondary-color)]">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
                <span>ثبت شرکت جدید</span>
              </Link>
            </div>
          </div>

          <div className="prm-hero-left-stats lg:col-span-6 flex lg:justify-end justify-center">
            <PrmCompaniesHeroStats
              activeCompaniesCount={activeCompaniesCount}
              coveredCitiesCount={coveredCitiesCount}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
