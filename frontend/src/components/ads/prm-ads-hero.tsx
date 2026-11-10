"use client";

import React from "react";

interface PrmAdsHeroProps {
    stats: {
        total: number;
        offersCount: number;
        demandsCount: number;
    };
}

const prmFaNumber = (value: number): string =>
    value.toLocaleString("fa-IR");

export default function PrmAdsHero({ stats }: PrmAdsHeroProps) {
    return (
        <section className="prm-ads-hero relative overflow-hidden rounded-[28px] bg-[var(--prm-primary-color)] px-6 py-10 md:px-12">
            <div
                className="prm-ads-hero-glow pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full opacity-30 blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle, rgba(245,158,11,0.55) 0%, rgba(234,88,12,0.25) 55%, transparent 80%)",
                }}
            />
            <div
                className="prm-ads-hero-specular pointer-events-none absolute inset-0 opacity-40"
                style={{
                    background:
                        "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 28%, transparent 45%, rgba(255,255,255,0.04) 78%, transparent 100%)",
                }}
            />

            <div className="prm-ads-hero-content relative grid items-center gap-10 lg:grid-cols-2">
                <div className="prm-ads-hero-copy order-2 text-center lg:order-1 lg:text-right">
                    <h1 className="text-3xl font-extrabold leading-snug text-[var(--prm-white)] md:text-4xl">
                        دسترسی سریع به
                        <span className="block text-[var(--prm-secondary-color)]">
                            بهترین فرصت‌های تجاری
                        </span>
                    </h1>
                    <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                        بانک جامع اطلاعات خرید و فروش کالا و خدمات. کسبوکار خود را همین امروز
                        جهانی کنید.
                    </p>
                    <a
                        href="/fa/ads/new"
                        className="prm-ads-hero-cta group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[var(--prm-secondary-color)] px-8 py-3.5 text-sm font-bold text-[var(--prm-primary-color)] shadow-[0_10px_30px_-8px_rgba(245,158,11,0.6)] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                    >
                        <span
                            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                            }}
                        />
                        <span className="text-lg leading-none">+</span>
                        ثبت آگهی جدید
                    </a>
                </div>

                <div className="prm-ads-hero-stats order-1 flex flex-col gap-4 lg:order-2">
                    <div className="prm-ads-hero-stat-main relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]">
                        <div
                            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-80"
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                            }}
                        />
                        <div className="flex items-center justify-between">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                                <span className="grid grid-cols-2 gap-1">
                                    <span className="h-1.5 w-1.5 rounded-[3px] bg-[var(--prm-white)]" />
                                    <span className="h-1.5 w-1.5 rounded-[3px] bg-[var(--prm-white)]" />
                                    <span className="h-1.5 w-1.5 rounded-[3px] bg-[var(--prm-white)]" />
                                    <span className="h-1.5 w-1.5 rounded-[3px] bg-[var(--prm-white)]" />
                                </span>
                            </span>
                            <div className="text-left">
                                <p className="text-xs text-slate-400">کل آگهی‌ها</p>
                                <p className="mt-1 text-2xl font-extrabold text-[var(--prm-white)]">
                                    {prmFaNumber(stats.total)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="prm-ads-hero-stat-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center backdrop-blur-xl">
                            <span className="mx-auto block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                            <p className="mt-3 text-xl font-extrabold text-emerald-400">
                                {prmFaNumber(stats.offersCount)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">آگهی‌های عرضه</p>
                        </div>
                        <div className="prm-ads-hero-stat-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center backdrop-blur-xl">
                            <span className="mx-auto block h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
                            <p className="mt-3 text-xl font-extrabold text-rose-500">
                                {prmFaNumber(stats.demandsCount)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">آگهی‌های تقاضا</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
