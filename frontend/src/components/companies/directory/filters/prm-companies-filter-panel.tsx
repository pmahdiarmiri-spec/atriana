"use client";

import React from "react";
import {
  PrmCompanyActivityType,
  PrmIndustry,
  PrmPublicCompanyFilterParams,
} from "@/types/prm-company";
import PrmCompaniesFilterBadges from "./prm-companies-filter-badges";

interface PrmCompaniesFilterPanelProps {
  filters: PrmPublicCompanyFilterParams;
  industries: PrmIndustry[];
  provinces: string[];
  cities: string[];
  totalResults: number;
  onFilterChange: (updated: Partial<PrmPublicCompanyFilterParams>) => void;
  onResetFilters: () => void;
}

export default function PrmCompaniesFilterPanel({
  filters,
  industries,
  provinces,
  cities,
  totalResults,
  onFilterChange,
  onResetFilters,
}: PrmCompaniesFilterPanelProps) {
  const handleToggleBadge = (
    badgeKey:
      | "is_knowledge_based"
      | "is_exporter"
      | "has_iso"
      | "is_startup"
      | "is_creative"
      | "is_emc"
  ) => {
    onFilterChange({
      [badgeKey]: !filters[badgeKey],
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filters.q ||
      filters.industry_id ||
      filters.activity_type ||
      filters.province ||
      filters.city ||
      filters.is_knowledge_based ||
      filters.is_exporter ||
      filters.has_iso ||
      filters.is_startup ||
      filters.is_creative ||
      filters.is_emc ||
      (filters.sort && filters.sort !== "newest")
  );

  return (
    <div
      id="prm-companies-filter-panel"
      className="prm-liquid-filter-surface p-5 sm:p-7 -mt-10 relative z-20 max-w-7xl mx-auto"
    >
      <div className="prm-filter-top-row grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-4">
        <div className="md:col-span-5 relative">
          <input
            type="text"
            id="prm-company-search-input"
            value={filters.q ?? ""}
            onChange={(e) =>
              onFilterChange({ q: e.target.value, page: 1 })
            }
            placeholder="جستجوی نام شرکت، محصولات، شعار یا حوزه فعالیت..."
            className="prm-liquid-input-field w-full pr-11 pl-4 py-3 text-sm font-medium"
          />
          <svg
            className="w-5 h-5 text-[var(--prm-text-light)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
            />
          </svg>
        </div>

        <div className="md:col-span-3">
          <select
            id="prm-company-industry-select"
            value={filters.industry_id ?? ""}
            onChange={(e) =>
              onFilterChange({
                industry_id: e.target.value ? Number(e.target.value) : "",
                page: 1,
              })
            }
            className="prm-liquid-input-field w-full px-3.5 py-3 text-sm font-medium"
          >
            <option value="">همه صنایع و حوزه‌ها</option>
            {industries.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name_fa}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <select
            id="prm-company-activity-select"
            value={filters.activity_type ?? ""}
            onChange={(e) =>
              onFilterChange({
                activity_type: e.target.value as PrmCompanyActivityType | "",
                page: 1,
              })
            }
            className="prm-liquid-input-field w-full px-3.5 py-3 text-sm font-medium"
          >
            <option value="">نوع فعالیت (همه)</option>
            <option value="production">تولیدی</option>
            <option value="distribution">توزیعی و پخش</option>
            <option value="trading">بازرگانی و تجاری</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <select
            id="prm-company-city-select"
            value={filters.city ?? ""}
            onChange={(e) =>
              onFilterChange({
                city: e.target.value,
                page: 1,
              })
            }
            className="prm-liquid-input-field w-full px-3.5 py-3 text-sm font-medium"
          >
            <option value="">همه شهرها</option>
            {cities.map((cityItem) => (
              <option key={cityItem} value={cityItem}>
                {cityItem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="prm-filter-second-row flex flex-wrap items-center justify-between gap-4 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="prm-company-province-select"
            value={filters.province ?? ""}
            onChange={(e) =>
              onFilterChange({
                province: e.target.value,
                page: 1,
              })
            }
            className="prm-liquid-input-field px-3.5 py-2 text-xs font-semibold"
          >
            <option value="">همه استان‌ها</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          <select
            id="prm-company-sort-select"
            value={filters.sort ?? "newest"}
            onChange={(e) =>
              onFilterChange({
                sort: e.target.value as "newest" | "popular" | "oldest",
                page: 1,
              })
            }
            className="prm-liquid-input-field px-3.5 py-2 text-xs font-semibold"
          >
            <option value="newest">جدیدترین شرکت‌ها</option>
            <option value="popular">پربازدیدترین شرکت‌ها</option>
            <option value="oldest">قدیمی‌ترین سوابق</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-[var(--prm-text-light)]">
            نتایج یافت‌شده:{" "}
            <strong className="text-[var(--prm-primary-color)] text-sm">
              {totalResults.toLocaleString("fa-IR")}
            </strong>{" "}
            شرکت
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              id="prm-reset-filters-btn"
              onClick={onResetFilters}
              className="text-xs font-bold text-[var(--prm-accent-color)] hover:underline flex items-center gap-1"
            >
              <span>حذف فیلترها</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <PrmCompaniesFilterBadges
        filters={filters}
        onToggleBadge={handleToggleBadge}
      />
    </div>
  );
}
