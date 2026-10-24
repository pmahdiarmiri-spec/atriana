"use client";

import React from "react";
import { PrmCompany } from "@/types/prm-company";

interface PrmCompanyDetailMediaVaultProps {
  company: PrmCompany;
}

export default function PrmCompanyDetailMediaVault({
  company,
}: PrmCompanyDetailMediaVaultProps) {
  const gallery = company.gallery_images || [];
  const certs = company.cert_images || [];

  if (gallery.length === 0 && certs.length === 0) {
    return null;
  }

  return (
    <div
      id="prm-company-detail-media-vault"
      className="prm-liquid-card-surface p-6 sm:p-8 space-y-8"
    >
      {gallery.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-[var(--prm-text-dark)] mb-4 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-[var(--prm-secondary-color)]" />
            <span>گالری تصاویر خطوط تولید و محصولات</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gallery.map((imgUrl, idx) => (
              <a
                key={idx}
                href={imgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100"
              >
                <img
                  src={imgUrl}
                  alt={`${company.name_fa} - ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {certs.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-[var(--prm-text-dark)] mb-4 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-[var(--prm-accent-color)]" />
            <span>تصاویر گواهینامه‌ها و مجوزهای رسمی</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {certs.map((certUrl, idx) => (
              <a
                key={idx}
                href={certUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100"
              >
                <img
                  src={certUrl}
                  alt={`گواهینامه ${company.name_fa} - ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
