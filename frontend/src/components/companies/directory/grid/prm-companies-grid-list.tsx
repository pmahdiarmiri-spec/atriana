"use client";

import React from "react";
import { PrmCompany } from "@/types/prm-company";
import PrmCompanyCardItem from "./prm-company-card-item";

interface PrmCompaniesGridListProps {
  companies: PrmCompany[];
  locale: string;
  loading: boolean;
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function PrmCompaniesGridList({
  companies,
  locale,
  loading,
  currentPage,
  lastPage,
  onPageChange,
}: PrmCompaniesGridListProps) {
  if (loading) {
    return (
      <div
        id="prm-companies-loading-skeleton"
        className="max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="prm-liquid-card-surface h-80 animate-pulse p-5 flex flex-col justify-between"
          >
            <div className="h-28 bg-slate-200 rounded-xl" />
            <div className="space-y-3">
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="h-9 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div
        id="prm-companies-empty-state"
        className="prm-liquid-card-surface max-w-3xl mx-auto my-14 p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[var(--prm-secondary-color)] flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-[var(--prm-text-dark)] mb-2">
          هیچ شرکتی با فیلترهای انتخابی یافت نشد
        </h3>
        <p className="text-sm text-[var(--prm-text-light)]">
          عبارت جستجو یا فیلترهای تخصصی را تغییر دهید تا لیست شرکت‌های تجاری
          مرتبط نمایش داده شود.
        </p>
      </div>
    );
  }

  return (
    <section
      id="prm-companies-grid-section"
      className="max-w-7xl mx-auto py-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <PrmCompanyCardItem
            key={company.id}
            company={company}
            locale={locale}
          />
        ))}
      </div>

      {lastPage > 1 && (
        <div
          id="prm-companies-pagination"
          className="flex items-center justify-center gap-2 mt-12"
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-[var(--prm-text-dark)] disabled:opacity-40 hover:border-[var(--prm-secondary-color)] transition"
          >
            صفحه قبل
          </button>

          <span className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[var(--prm-primary-color)] text-[var(--prm-secondary-color)]">
            صفحه {currentPage.toLocaleString("fa-IR")} از{" "}
            {lastPage.toLocaleString("fa-IR")}
          </span>

          <button
            type="button"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-[var(--prm-text-dark)] disabled:opacity-40 hover:border-[var(--prm-secondary-color)] transition"
          >
            صفحه بعد
          </button>
        </div>
      )}
    </section>
  );
}
