"use client";

import React from "react";
import { prmIranProvinces } from "@/lib/prm-advertisements/prm-iran-provinces";
import type {
    PrmPublicAdNature,
    PrmPublicAdType,
} from "@/lib/prm-advertisements/prm-advertisements-public-api";

export interface PrmAdsFilterState {
    type: PrmPublicAdType | "";
    nature: PrmPublicAdNature | "";
    province: string;
    search: string;
}

interface PrmAdsFiltersProps {
    value: PrmAdsFilterState;
    onChange: (value: PrmAdsFilterState) => void;
    onSubmit: () => void;
}

const prmTypeTabs: { key: PrmPublicAdType | ""; label: string }[] = [
    { key: "", label: "همه" },
    { key: "offer", label: "عرضه" },
    { key: "demand", label: "تقاضا" },
];

export default function PrmAdsFilters({
    value,
    onChange,
    onSubmit,
}: PrmAdsFiltersProps) {
    const prmSelectClass =
        "prm-ads-filter-select h-12 w-full appearance-none rounded-xl border border-slate-200 bg-[var(--prm-white)] px-4 text-sm text-[var(--prm-text-dark)] outline-none transition-shadow focus:border-[var(--prm-secondary-color)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.18)]";

    return (
        <div className="prm-ads-filterbar relative rounded-[24px] bg-[var(--prm-white)] p-4 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.25),0_4px_12px_-4px_rgba(15,23,42,0.08)]">
            <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-70"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), rgba(245,158,11,0.5), transparent)",
                }}
            />
            <form
                className="grid items-center gap-3 md:grid-cols-[auto_auto_1fr_auto] lg:grid-cols-[auto_auto_auto_1fr_auto]"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
            >
                <div className="prm-ads-filter-tabs flex h-12 items-center gap-1 rounded-xl bg-slate-100 p-1">
                    {prmTypeTabs.map((tab) => (
                        <button
                            key={tab.key || "all"}
                            type="button"
                            onClick={() => onChange({ ...value, type: tab.key })}
                            className={`prm-ads-filter-tab h-10 rounded-lg px-5 text-sm font-bold transition-all duration-300 ${
                                value.type === tab.key
                                    ? "bg-[var(--prm-primary-color)] text-[var(--prm-white)] shadow-[0_6px_16px_-6px_rgba(15,23,42,0.6)]"
                                    : "text-[var(--prm-text-light)] hover:text-[var(--prm-text-dark)]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <select
                    value={value.nature}
                    onChange={(event) =>
                        onChange({
                            ...value,
                            nature: event.target.value as PrmAdsFilterState["nature"],
                        })
                    }
                    className={prmSelectClass}
                >
                    <option value="">همه دسته‌بندی‌ها</option>
                    <option value="goods">کالا</option>
                    <option value="services">خدمت</option>
                </select>

                <select
                    value={value.province}
                    onChange={(event) =>
                        onChange({ ...value, province: event.target.value })
                    }
                    className={prmSelectClass}
                >
                    <option value="">همه استان‌ها</option>
                    {prmIranProvinces.map((province) => (
                        <option key={province} value={province}>
                            {province}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    value={value.search}
                    onChange={(event) =>
                        onChange({ ...value, search: event.target.value })
                    }
                    placeholder="جستجو (نام کالا، خدمات...)"
                    className="prm-ads-filter-search h-12 w-full rounded-xl border border-slate-200 bg-[var(--prm-white)] px-4 text-sm text-[var(--prm-text-dark)] placeholder:text-slate-400 outline-none transition-shadow focus:border-[var(--prm-secondary-color)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.18)]"
                />

                <button
                    type="submit"
                    className="prm-ads-filter-submit flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--prm-primary-color)] px-8 text-sm font-bold text-[var(--prm-white)] shadow-[0_10px_24px_-10px_rgba(15,23,42,0.7)] transition-all duration-300 hover:shadow-[0_14px_30px_-10px_rgba(15,23,42,0.8)] active:scale-95"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.2-3.2" />
                    </svg>
                    جستجو
                </button>
            </form>
        </div>
    );
}
