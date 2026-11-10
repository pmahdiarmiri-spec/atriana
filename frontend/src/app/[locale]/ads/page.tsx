"use client";

import React, { useCallback, useEffect, useState } from "react";
import PrmAdsHero from "@/components/ads/prm-ads-hero";
import PrmAdsFilters, {
  type PrmAdsFilterState,
} from "@/components/ads/prm-ads-filters";
import PrmAdsCard from "@/components/ads/prm-ads-card";
import PrmAdsPagination from "@/components/ads/prm-ads-pagination";
import {
  prmGetPublicAdvertisements,
  type PrmPublicAdvertisement,
  type PrmPublicAdsStats,
} from "@/lib/prm-advertisements/prm-advertisements-public-api";
import "@/styles/prm-ads/prm-ads.css";

const prmDefaultStats: PrmPublicAdsStats = {
  total: 0,
  goods_count: 0,
  services_count: 0,
  offers_count: 0,
  demands_count: 0,
};

const prmDefaultFilters: PrmAdsFilterState = {
  type: "",
  nature: "",
  province: "",
  search: "",
};

export default function PrmAdsPage() {
  const [items, setItems] = useState<PrmPublicAdvertisement[]>([]);
  const [stats, setStats] = useState<PrmPublicAdsStats>(prmDefaultStats);
  const [filters, setFilters] = useState<PrmAdsFilterState>(prmDefaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<PrmAdsFilterState>(prmDefaultFilters);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await prmGetPublicAdvertisements({
        type: appliedFilters.type,
        nature: appliedFilters.nature,
        province: appliedFilters.province,
        search: appliedFilters.search,
        sort: "newest",
        page,
        per_page: 12,
      });

      setItems(response.items);
      setStats(response.meta.stats);
      setLastPage(response.meta.last_page);
    } catch {
      setError("خطا در بارگذاری آگهی‌ها. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  return (
    <div className="prm-ads-page">
      <div className="prm-ads-container">
        <PrmAdsHero
          stats={{
            total: stats.total,
            offersCount: stats.offers_count,
            demandsCount: stats.demands_count,
          }}
        />

        <div id="prm-ads-list-anchor" className="mt-8 w-full">
          <PrmAdsFilters
            value={filters}
            onChange={setFilters}
            onSubmit={handleSubmit}
          />
        </div>

        {error && (
          <div className="prm-ads-error mt-8 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-6 py-4 text-sm font-bold text-rose-600 backdrop-blur-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="prm-ads-grid mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="prm-ads-skeleton h-96 animate-pulse rounded-[26px] border border-white/60 bg-white/60 p-4 shadow-sm backdrop-blur-xl"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="prm-ads-empty mt-8 rounded-[30px] border border-white/80 bg-white/70 px-6 py-20 text-center backdrop-blur-2xl shadow-[0_20px_45px_-15px_rgba(15,23,42,0.08)]">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-[var(--prm-secondary-color)]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
            </div>
            <p className="text-lg font-black text-[var(--prm-text-dark)]">
              آگهی‌ای یافت نشد
            </p>
            <p className="mt-2 text-sm text-[var(--prm-text-light)]">
              فیلترها را تغییر دهید یا جستجوی دیگری را امتحان کنید.
            </p>
          </div>
        ) : (
          <div className="prm-ads-grid mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {items.map((advertisement) => (
              <PrmAdsCard
                key={advertisement.id}
                advertisement={advertisement}
              />
            ))}
          </div>
        )}

        <div className="mt-12 w-full">
          <PrmAdsPagination
            currentPage={page}
            lastPage={lastPage}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
