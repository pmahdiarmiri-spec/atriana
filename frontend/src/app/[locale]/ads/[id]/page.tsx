"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  prmGetPublicAdvertisementBySlug,
  type PrmPublicAdvertisement,
} from "@/lib/prm-advertisements/prm-advertisements-public-api";
import PrmAdDetailView from "@/components/ads/detail/prm-ad-detail-view";

export default function PrmAdDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const locale = (params?.locale as string) || "fa";

  const [advertisement, setAdvertisement] =
    useState<PrmPublicAdvertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    prmGetPublicAdvertisementBySlug(id)
      .then((data) => {
        if (isMounted) setAdvertisement(data);
      })
      .catch(() => {
        if (isMounted) setError("آگهی موردنظر یافت نشد یا حذف شده است.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--prm-bg-light)] p-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-20 rounded-[28px] bg-slate-200/70" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="h-96 rounded-[28px] bg-slate-200/70" />
              <div className="h-64 rounded-[28px] bg-slate-200/70" />
            </div>
            <div className="lg:col-span-4 h-96 rounded-[28px] bg-slate-200/70" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !advertisement) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="max-w-md rounded-[28px] border border-white/80 bg-white/80 p-8 text-center backdrop-blur-2xl shadow-xl">
          <p className="text-base font-extrabold text-[var(--prm-text-dark)]">
            {error || "آگهی یافت نشد"}
          </p>
          <Link
            href={`/${locale}/ads`}
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-[var(--prm-primary-color)] px-6 text-xs font-bold text-white transition-transform hover:scale-105"
          >
            بازگشت به لیست آگهی‌ها
          </Link>
        </div>
      </div>
    );
  }

  return <PrmAdDetailView advertisement={advertisement} />;
}
