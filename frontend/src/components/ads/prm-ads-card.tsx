"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { PrmPublicAdvertisement } from "@/lib/prm-advertisements/prm-advertisements-public-api";

interface PrmAdsCardProps {
  advertisement: PrmPublicAdvertisement;
}

const prmFaNumber = (value: number): string => value.toLocaleString("fa-IR");

const prmPriceTypeLabels: Record<string, string> = {
  fixed: "قیمت مشخص",
  agreement: "توافقی",
  call: "تماس بگیرید",
};

export default function PrmAdsCard({ advertisement }: PrmAdsCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isOffer = advertisement.type === "offer";
  const targetId = advertisement.slug || String(advertisement.id);

  return (
    <Link
      href={`/${locale}/ads/${targetId}`}
      className="prm-ads-card group relative flex flex-col overflow-hidden rounded-[26px] border border-white/60 bg-white/75 p-3 backdrop-blur-2xl shadow-[0_20px_45px_-15px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--prm-secondary-color)]/60 hover:shadow-[0_30px_60px_-15px_rgba(245,158,11,0.25)]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(245,158,11,0.18), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-[1.5px] opacity-70"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), rgba(245,158,11,0.5), transparent)",
        }}
      />

      <div className="prm-ads-card-media relative h-48 w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-slate-100 to-slate-200">
        {advertisement.image_url ? (
          <img
            src={advertisement.image_url}
            alt={advertisement.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-4.5-4.5L7 20" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--prm-primary-color)]/70 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span
            className={`prm-ads-card-type-badge rounded-xl border border-white/25 px-3 py-1 text-[11px] font-extrabold text-[var(--prm-white)] backdrop-blur-md shadow-lg ${
              isOffer ? "bg-emerald-600/85" : "bg-rose-600/85"
            }`}
          >
            {isOffer ? "عرضه" : "تقاضا"}
          </span>
          <span className="prm-ads-card-nature-badge rounded-xl border border-white/20 bg-[var(--prm-primary-color)]/80 px-2.5 py-1 text-[11px] font-bold text-[var(--prm-white)] backdrop-blur-md shadow-lg">
            {advertisement.nature === "goods" ? "کالا" : "خدمت"}
          </span>
        </div>

        {advertisement.has_verified_badge && (
          <span className="prm-ads-card-verified-badge absolute left-3 top-3 flex items-center gap-1 rounded-xl border border-amber-300/40 bg-[var(--prm-secondary-color)] px-2.5 py-1 text-[11px] font-black text-[var(--prm-primary-color)] backdrop-blur-md shadow-lg">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1 14-3-3 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6Z" />
            </svg>
            تایید شده
          </span>
        )}
      </div>

      <div className="prm-ads-card-body flex flex-1 flex-col p-3.5">
        <h3 className="prm-ads-card-title line-clamp-2 text-sm font-extrabold leading-6 text-[var(--prm-text-dark)] transition-colors group-hover:text-[var(--prm-accent-color)]">
          {advertisement.title}
        </h3>

        <div className="prm-ads-card-meta mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-[var(--prm-text-light)]">
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {advertisement.city || advertisement.province || "سراسر کشور"}
          </span>
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {advertisement.category}
          </span>
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {prmFaNumber(advertisement.views)}
          </span>
        </div>

        <div className="prm-ads-card-footer mt-auto border-t border-slate-200/60 pt-3">
          <div className="flex items-center justify-between">
            <span className="prm-ads-card-price text-sm font-black text-[var(--prm-secondary-color)]">
              {advertisement.price_type === "fixed" && advertisement.price
                ? `${prmFaNumber(Number(advertisement.price))} ${
                    advertisement.currency === "IRT"
                      ? "تومان"
                      : advertisement.currency === "USD"
                      ? "دلار"
                      : advertisement.currency || ""
                  }`
                : prmPriceTypeLabels[advertisement.price_type] || "توافقی"}
            </span>
            {advertisement.company_name && (
              <span className="prm-ads-card-company max-w-[50%] truncate text-[11px] font-semibold text-[var(--prm-text-light)]">
                {advertisement.company_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
