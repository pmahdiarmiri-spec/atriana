"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PrmAdsHeroProps {
  stats: {
    total: number;
    offersCount: number;
    demandsCount: number;
  };
}

const prmFaNumber = (value: number): string => value.toLocaleString("fa-IR");

export default function PrmAdsHero({ stats }: PrmAdsHeroProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";

  return (
    <header
      id="prm-ads-main-header"
      className="prm-ads-hero relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[var(--prm-primary-color)] px-6 py-12 backdrop-blur-3xl shadow-[0_30px_70px_-20px_rgba(15,23,42,0.85)] md:px-14 md:py-16"
    >
      <div
        className="prm-ads-hero-glow-1 pointer-events-none absolute -left-20 -top-24 h-96 w-96 rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.6) 0%, rgba(234,88,12,0.3) 50%, transparent 75%)",
        }}
      />
      <div
        className="prm-ads-hero-glow-2 pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.5) 0%, rgba(15,23,42,0) 70%)",
        }}
      />
      <div
        className="prm-ads-hero-specular pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-12 top-0 h-[1.5px] opacity-80"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(245,158,11,0.7), transparent)",
        }}
      />

      <div className="prm-ads-hero-content relative grid items-center gap-12 lg:grid-cols-12">
        <div className="prm-ads-hero-copy order-2 text-center lg:order-1 lg:col-span-7 lg:text-right">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 animate-ping rounded-full bg-[var(--prm-secondary-color)]" />
            <span className="text-xs font-bold text-amber-300">
              سامانه معاملات تخصصی آتریانا
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black leading-snug tracking-tight text-[var(--prm-white)] md:text-5xl md:leading-tight">
            دسترسی سریع به
            <span className="mt-2 block bg-gradient-to-l from-amber-300 via-[var(--prm-secondary-color)] to-[var(--prm-accent-color)] bg-clip-text text-transparent">
              بهترین فرصت‌های تجاری
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
            مرکز مبادلات کالا، تامین مواد اولیه، ماشین‌آلات و خدمات تخصصی بدون
            واسطه بین شرکت‌های تجاری، خریداران و تولیدکنندگان منتخب کشور.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              href={`/${locale}/ads/new`}
              className="prm-btn-primary group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-[var(--prm-secondary-color)] to-amber-500 px-8 py-4 text-sm font-extrabold text-[var(--prm-primary-color)] shadow-[0_15px_35px_-10px_rgba(245,158,11,0.65)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
                }}
              />
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-[var(--prm-primary-color)]/10 text-lg leading-none">
                +
              </span>
              ثبت آگهی جدید
            </Link>

            <a
              href="#prm-ads-list-anchor"
              className="prm-btn-secondary inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-[var(--prm-white)] backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/15"
            >
              مشاهده آخرین آگهی‌ها
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="prm-ads-hero-stats order-1 flex flex-col gap-4 lg:order-2 lg:col-span-5">
          <div className="prm-ads-hero-stat-main relative overflow-hidden rounded-[24px] border border-white/15 bg-white/10 p-6 backdrop-blur-2xl shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
              }}
            />
            <div className="flex items-center justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-amber-300"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-300">
                  فرصت‌های فعال تجاری
                </p>
                <p className="mt-1 text-3xl font-black text-[var(--prm-white)]">
                  {prmFaNumber(stats.total)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="prm-ads-hero-stat-card relative overflow-hidden rounded-[22px] border border-emerald-400/25 bg-emerald-500/10 p-5 text-center backdrop-blur-2xl">
              <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
              <p className="mt-3 text-2xl font-black text-emerald-300">
                {prmFaNumber(stats.offersCount)}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-300">
                فرصت‌های عرضه
              </p>
            </div>

            <div className="prm-ads-hero-stat-card relative overflow-hidden rounded-[22px] border border-rose-400/25 bg-rose-500/10 p-5 text-center backdrop-blur-2xl">
              <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,1)]" />
              <p className="mt-3 text-2xl font-black text-rose-300">
                {prmFaNumber(stats.demandsCount)}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-300">
                فرصت‌های تقاضا
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
