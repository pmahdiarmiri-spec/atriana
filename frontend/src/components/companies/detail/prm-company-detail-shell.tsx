"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PrmCompany } from "@/types/prm-company";
import { prmGetPublicCompanyDetail } from "@/lib/prm-companies/prm-companies-api";
import PrmCompanyDetailHero from "./header/prm-company-detail-hero";
import PrmCompanyDetailOverview from "./sections/prm-company-detail-overview";
import PrmCompanyDetailSpecsGrid from "./sections/prm-company-detail-specs-grid";
import PrmCompanyDetailContactPanel from "./sections/prm-company-detail-contact-panel";
import PrmCompanyDetailMediaVault from "./sections/prm-company-detail-media-vault";
import "@/styles/prm-companies/prm-companies-liquid-glass.css";

interface PrmCompanyDetailShellProps {
  companyId: string;
  locale: string;
}

export default function PrmCompanyDetailShell({
  companyId,
  locale,
}: PrmCompanyDetailShellProps) {
  const [company, setCompany] = useState<PrmCompany | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    prmGetPublicCompanyDetail(companyId)
      .then((res) => {
        if (isMounted) {
          setCompany(res.company);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "اطلاعات این شرکت یافت نشد.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--prm-bg-light)] p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-64 bg-slate-800 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-96 bg-slate-200 rounded-3xl" />
            <div className="lg:col-span-4 h-96 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[var(--prm-bg-light)] flex items-center justify-center p-6">
        <div className="prm-liquid-card-surface max-w-md w-full p-8 text-center">
          <h2 className="text-xl font-black text-[var(--prm-text-dark)] mb-3">
            شرکت مورد نظر یافت نشد
          </h2>
          <p className="text-sm text-[var(--prm-text-light)] mb-6">
            {error || "ممکن است پروفایل این شرکت منقضی شده یا در حال بررسی باشد."}
          </p>
          <Link
            href={`/${locale}/companies`}
            className="prm-liquid-cta-amber text-sm"
          >
            بازگشت به لیست شرکت‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main
      id="prm-company-detail-page"
      className="min-h-screen bg-[var(--prm-bg-light)] pb-20"
    >
      <PrmCompanyDetailHero company={company} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <PrmCompanyDetailOverview company={company} />
            <PrmCompanyDetailSpecsGrid company={company} />
            <PrmCompanyDetailMediaVault company={company} />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <PrmCompanyDetailContactPanel company={company} />
          </div>
        </div>
      </div>
    </main>
  );
}
