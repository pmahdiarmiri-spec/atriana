"use client";

import React from "react";
import type { PrmPublicAdvertisement } from "@/lib/prm-advertisements/prm-advertisements-public-api";

interface PrmAdInfoGridProps {
  advertisement: PrmPublicAdvertisement;
}

const prmFaNumber = (value: number | string): string => {
  const num = typeof value === "number" ? value : Number(value);
  return isNaN(num) ? String(value) : num.toLocaleString("fa-IR");
};

const prmPriceTypeLabels: Record<string, string> = {
  fixed: "قیمت مشخص",
  agreement: "توافقی",
  call: "تماس بگیرید",
};

export default function PrmAdInfoGrid({
  advertisement,
}: PrmAdInfoGridProps) {
  const prmDetails = [
    {
      label: "نوع آگهی",
      value: advertisement.type === "offer" ? "عرضه (فروش)" : "تقاضا (خرید)",
    },
    {
      label: "ماهیت",
      value: advertisement.nature === "goods" ? "کالا" : "خدمات",
    },
    {
      label: "دسته‌بندی",
      value: advertisement.category || "-",
    },
    {
      label: "زیردسته‌بندی",
      value: advertisement.sub_category || "-",
    },
    {
      label: "استان / شهر",
      value: `${advertisement.province || ""} ${
        advertisement.city ? `- ${advertisement.city}` : ""
      }`.trim() || "-",
    },
    {
      label: "مبدا / ساخت",
      value: advertisement.origin || "ایران",
    },
    {
      label: "حداقل سفارش (MOQ)",
      value: advertisement.moq
        ? `${prmFaNumber(advertisement.moq)} ${advertisement.moq_unit || "واحد"}`
        : "توافقی",
    },
    {
      label: "نوع قیمت‌گذاری",
      value: prmPriceTypeLabels[advertisement.price_type] || "توافقی",
    },
    {
      label: "مبلغ نهایی",
      value:
        advertisement.price_type === "fixed" && advertisement.price
          ? `${prmFaNumber(advertisement.price)} ${
              advertisement.currency === "IRT"
                ? "تومان"
                : advertisement.currency === "USD"
                ? "دلار"
                : advertisement.currency || ""
            }`
          : prmPriceTypeLabels[advertisement.price_type] || "توافقی",
    },
  ];

  return (
    <div className="prm-ad-info-grid grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {prmDetails.map((item, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-xl shadow-[0_10px_25px_-10px_rgba(15,23,42,0.06)]"
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-0 h-px opacity-70"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)",
            }}
          />
          <span className="block text-xs font-semibold text-[var(--prm-text-light)]">
            {item.label}
          </span>
          <span className="mt-1 block text-sm font-extrabold text-[var(--prm-text-dark)]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
