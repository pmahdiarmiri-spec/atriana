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
        <div className="prm-ads-page min-h-screen bg-[var(--prm-bg-light)]">
            <div className="prm-ads-container mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
                <PrmAdsHero
                    stats={{
                        total: stats.total,
                        offersCount: stats.offers_count,
                        demandsCount: stats.demands_count,
                    }}
                />

                <div className="mt-8">
                    <PrmAdsFilters
                        value={filters}
                        onChange={setFilters}
                        onSubmit={handleSubmit}
                    />
                </div>

                {error && (
                    <div className="prm-ads-error mt-8 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="prm-ads-grid mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="prm-ads-skeleton h-80 animate-pulse rounded-[20px] bg-slate-200/60"
                            />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="prm-ads-empty mt-8 rounded-[24px] border border-slate-200 bg-[var(--prm-white)] px-6 py-16 text-center">
                        <p className="text-base font-bold text-[var(--prm-text-dark)]">
                            آگهی‌ای یافت نشد
                        </p>
                        <p className="mt-2 text-sm text-[var(--prm-text-light)]">
                            فیلترها را تغییر دهید یا جستجوی دیگری امتحان کنید.
                        </p>
                    </div>
                ) : (
                    <div className="prm-ads-grid mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((advertisement) => (
                            <PrmAdsCard
                                key={advertisement.id}
                                advertisement={advertisement}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-10">
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
