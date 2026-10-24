"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  PrmCompany,
  PrmIndustry,
  PrmPublicCompanyFilterParams,
} from "@/types/prm-company";
import { prmGetPublicCompanies } from "@/lib/prm-companies/prm-companies-api";
import PrmCompaniesHeroBanner from "./hero/prm-companies-hero-banner";
import PrmCompaniesFilterPanel from "./filters/prm-companies-filter-panel";
import PrmCompaniesGridList from "./grid/prm-companies-grid-list";
import "@/styles/prm-companies/prm-companies-liquid-glass.css";

interface PrmCompaniesDirectoryShellProps {
  locale: string;
}

const PRM_INITIAL_FILTERS: PrmPublicCompanyFilterParams = {
  q: "",
  industry_id: "",
  activity_type: "",
  province: "",
  city: "",
  is_knowledge_based: false,
  is_exporter: false,
  has_iso: false,
  is_startup: false,
  is_creative: false,
  is_emc: false,
  sort: "newest",
  page: 1,
  per_page: 12,
};

export default function PrmCompaniesDirectoryShell({
  locale,
}: PrmCompaniesDirectoryShellProps) {
  const [filters, setFilters] =
    useState<PrmPublicCompanyFilterParams>(PRM_INITIAL_FILTERS);
  const [companies, setCompanies] = useState<PrmCompany[]>([]);
  const [industries, setIndustries] = useState<PrmIndustry[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stats, setStats] = useState<{
    active_companies: number;
    covered_cities: number;
  }>({
    active_companies: 0,
    covered_cities: 0,
  });
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const loadCompaniesDirectory = useCallback(
    async (activeFilters: PrmPublicCompanyFilterParams) => {
      setLoading(true);
      try {
        const res = await prmGetPublicCompanies(activeFilters);
        setCompanies(res.companies || []);
        setStats(
          res.stats || {
            active_companies: 0,
            covered_cities: 0,
          }
        );
        if (res.filters_meta) {
          setIndustries(res.filters_meta.industries || []);
          setProvinces(res.filters_meta.provinces || []);
          setCities(res.filters_meta.cities || []);
        }
        if (res.meta) {
          setMeta({
            current_page: res.meta.current_page,
            last_page: res.meta.last_page,
            total: res.meta.total,
          });
        }
      } catch {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCompaniesDirectory(filters);
    }, 220);

    return () => clearTimeout(timer);
  }, [filters, loadCompaniesDirectory]);

  const handleFilterChange = (
    updated: Partial<PrmPublicCompanyFilterParams>
  ) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleResetFilters = () => {
    setFilters(PRM_INITIAL_FILTERS);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  return (
    <main
      id="prm-companies-directory-page"
      className="prm-companies-directory-page min-h-screen bg-[var(--prm-bg-light)] pb-20"
    >
      <PrmCompaniesHeroBanner
        locale={locale}
        activeCompaniesCount={stats.active_companies}
        coveredCitiesCount={stats.covered_cities}
        loading={loading && companies.length === 0}
      />

      <div className="px-4 sm:px-8 lg:px-16">
        <PrmCompaniesFilterPanel
          filters={filters}
          industries={industries}
          provinces={provinces}
          cities={cities}
          totalResults={meta.total}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <PrmCompaniesGridList
          companies={companies}
          locale={locale}
          loading={loading}
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
