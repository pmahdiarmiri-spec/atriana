"use client";

import React from "react";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyDetailContactPanelProps {
  company: PrmCompany;
}

export default function PrmCompanyDetailContactPanel({
  company,
}: PrmCompanyDetailContactPanelProps) {
  const socials = [
    { label: "LinkedIn", value: company.social_linkedin },
    { label: "Instagram", value: company.social_instagram },
    { label: "Telegram", value: company.social_telegram },
    { label: "WhatsApp", value: company.social_whatsapp },
    { label: "YouTube", value: company.social_youtube },
    { label: "Aparat", value: company.social_aparat },
  ].filter((s) => Boolean(s.value));

  return (
    <aside
      id="prm-company-detail-contact-panel"
      className="prm-liquid-card-surface p-6 space-y-5"
    >
      <h2 className="text-lg font-black text-[var(--prm-text-dark)] flex items-center gap-2">
        <span className="w-2 h-5 rounded-full bg-[var(--prm-secondary-color)]" />
        <span>اطلاعات تماس و ارتباطات</span>
      </h2>

      <div className="space-y-3.5 text-sm">
        {(company.country || company.province || company.city) && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="block text-xs font-bold text-[var(--prm-text-light)] mb-1">
              موقعیت جغرافیایی:
            </span>
            <span className="font-extrabold text-[var(--prm-text-dark)]">
              {[company.country, company.province, company.city]
                .filter(Boolean)
                .join(" - ")}
            </span>
          </div>
        )}

        {company.address && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="block text-xs font-bold text-[var(--prm-text-light)] mb-1">
              نشانی دفتر مرکزی / کارخانه:
            </span>
            <p className="font-semibold text-[var(--prm-text-dark)] leading-relaxed">
              {company.address}
            </p>
            {company.postal_code && (
              <span className="block text-xs text-[var(--prm-text-light)] mt-1">
                کد پستی: {company.postal_code}
              </span>
            )}
          </div>
        )}

        {company.phone && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-[var(--prm-text-light)]">
              تلفن ثابت:
            </span>
            <a
              href={`tel:${company.phone}`}
              className="font-extrabold text-[var(--prm-primary-color)] hover:text-[var(--prm-accent-color)]"
              dir="ltr"
            >
              {company.phone}
            </a>
          </div>
        )}

        {company.mobile && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-[var(--prm-text-light)]">
              تلفن همراه بازرگانی:
            </span>
            <a
              href={`tel:${company.mobile}`}
              className="font-extrabold text-[var(--prm-primary-color)] hover:text-[var(--prm-accent-color)]"
              dir="ltr"
            >
              {company.mobile}
            </a>
          </div>
        )}

        {company.email && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-[var(--prm-text-light)]">
              پست الکترونیک:
            </span>
            <a
              href={`mailto:${company.email}`}
              className="font-bold text-[var(--prm-primary-color)] hover:underline truncate max-w-[180px]"
              dir="ltr"
            >
              {company.email}
            </a>
          </div>
        )}

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="prm-liquid-cta-amber w-full text-center text-sm py-3"
          >
            <span>مشاهده وب‌سایت رسمی شرکت</span>
          </a>
        )}
      </div>

      {(company.catalog_file || company.resume_file) && (
        <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
          <span className="block text-xs font-extrabold text-[var(--prm-text-light)]">
            مستندات قابل دریافت:
          </span>
          {company.catalog_file && (
            <a
              href={company.catalog_file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--prm-primary-color)] text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              <span>دانلود کاتالوگ محصولات</span>
              <span className="text-[var(--prm-secondary-color)]">PDF</span>
            </a>
          )}
          {company.resume_file && (
            <a
              href={company.resume_file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 text-[var(--prm-text-dark)] border border-slate-300 text-xs font-bold hover:border-[var(--prm-secondary-color)] transition"
            >
              <span>دانلود رزومه رسمی شرکت</span>
              <span className="text-[var(--prm-accent-color)]">دریافت</span>
            </a>
          )}
        </div>
      )}

      {socials.length > 0 && (
        <div className="pt-4 border-t border-slate-200/80">
          <span className="block text-xs font-extrabold text-[var(--prm-text-light)] mb-2.5">
            شبکه‌های اجتماعی:
          </span>
          <div className="flex flex-wrap gap-2">
            {socials.map((soc, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-[var(--prm-text-dark)]"
                dir="ltr"
              >
                {soc.label}: {soc.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
