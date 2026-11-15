"use client";

import React from "react";
import { PrmCompanyAdminDetails } from "@/types/prm-companies/prm-company-admin";
import {
  FileText,
  Download,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface PrmAdminCompanyMediaTabProps {
  locale: string;
  company: PrmCompanyAdminDetails;
}

export const PrmAdminCompanyMediaTab: React.FC<
  PrmAdminCompanyMediaTabProps
> = ({ locale, company }) => {
  const pendingData = company.pending_update_data || {};

  const renderMediaBox = (
    originalUrl: string | null | undefined,
    fieldKey: string,
    label: string,
    isCover = false
  ) => {
    const hasUpdate = fieldKey in pendingData;

    return (
      <div
        className={`p-4 rounded-xl border space-y-3 transition-all ${
          hasUpdate
            ? "bg-violet-500/5 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
            : "bg-white/[0.02] border-white/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] block font-medium ${
              hasUpdate ? "text-violet-300" : "text-slate-400"
            }`}
          >
            {label}
          </span>
          {hasUpdate && (
            <span className="flex items-center gap-1 text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/30">
              <RefreshCw className="w-2.5 h-2.5" />
              {locale === "fa" ? "درخواست تغییر" : "Update requested"}
            </span>
          )}
        </div>

        {originalUrl ? (
          <div
            className={`rounded-xl overflow-hidden border bg-slate-950 flex items-center justify-center relative ${
              isCover ? "w-full h-24" : "w-24 h-24 p-2"
            } ${hasUpdate ? "border-violet-500/30 opacity-60 grayscale" : "border-white/10"}`}
          >
            <img
              src={originalUrl}
              alt={label}
              className={isCover ? "w-full h-full object-cover" : "max-w-full max-h-full object-contain"}
            />
            {hasUpdate && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
                <span className="text-[10px] text-violet-300 border border-violet-500/50 bg-violet-500/20 px-2 py-1 rounded">
                  {locale === "fa" ? "فایل جدید ارسال شده" : "New file provided"}
                </span>
              </div>
            )}
          </div>
        ) : hasUpdate ? (
          <div className="w-full h-24 rounded-xl border border-violet-500/30 border-dashed bg-violet-500/5 flex items-center justify-center text-violet-400 text-xs">
            {locale === "fa" ? "فایل جدید اضافه شده" : "New file added"}
          </div>
        ) : (
          <span className="text-slate-500 text-xs">
            {locale === "fa" ? "ثبت نشده" : "Not uploaded"}
          </span>
        )}
      </div>
    );
  };

  const renderFileLink = (
    originalUrl: string | null | undefined,
    fieldKey: string,
    label: string
  ) => {
    const hasUpdate = fieldKey in pendingData;

    return (
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
          hasUpdate
            ? "bg-violet-500/5 border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
            : "bg-white/[0.02] border-white/5"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <FileText className={`w-4 h-4 ${hasUpdate ? "text-violet-400" : "text-amber-500"}`} />
          <span className={hasUpdate ? "text-violet-300" : "text-slate-200"}>{label}</span>
          {hasUpdate && (
            <span className="flex items-center gap-1 text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/30">
              <RefreshCw className="w-2.5 h-2.5" />
              {locale === "fa" ? "تغییر یافته" : "Updated"}
            </span>
          )}
        </div>
        {hasUpdate ? (
          <span className="text-[10px] text-violet-400 italic">
            {locale === "fa" ? "بررسی از طریق فایل‌های آپدیت شده بک‌اند" : "Check updated files via backend"}
          </span>
        ) : originalUrl ? (
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] transition-all w-fit"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{locale === "fa" ? "دانلود اصلی" : "Download Original"}</span>
          </a>
        ) : (
          <span className="text-slate-500 text-xs">
            {locale === "fa" ? "ندارد" : "None"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 text-xs prm-company-media">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderMediaBox(company.logo_url, "logo_path", locale === "fa" ? "لوگو شرکت" : "Logo")}
        {renderMediaBox(company.cover_url, "cover_path", locale === "fa" ? "تصویر کاور" : "Cover", true)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {renderFileLink(company.catalog_file, "catalog_path", locale === "fa" ? "کاتالوگ رسمی شرکت" : "Official Catalog")}
        {renderFileLink(company.resume_file, "resume_path", locale === "fa" ? "رزومه شرکت" : "Company Resume")}
      </div>

      <div className={`p-4 rounded-xl border space-y-3 ${"cert_paths" in pendingData ? "bg-violet-500/5 border-violet-500/40" : "bg-white/[0.02] border-white/5"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <ImageIcon className={`w-4 h-4 ${"cert_paths" in pendingData ? "text-violet-400" : "text-amber-500"}`} />
            <span className={"cert_paths" in pendingData ? "text-violet-300" : "text-slate-300"}>
              {locale === "fa" ? "مدارک و مجوزهای بارگذاری‌شده" : "Uploaded Certs & Documents"}
            </span>
          </div>
          {"cert_paths" in pendingData && (
            <span className="flex items-center gap-1 text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/30">
              <RefreshCw className="w-2.5 h-2.5" />
              {locale === "fa" ? "لیست مدارک تغییر کرده است" : "Certificates updated"}
            </span>
          )}
        </div>
        
        {company.cert_images && company.cert_images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {company.cert_images.map((certUrl, idx) => (
              <a
                key={idx}
                href={certUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative aspect-square rounded-xl overflow-hidden border bg-slate-950 flex items-center justify-center transition-all ${"cert_paths" in pendingData ? "border-violet-500/30 opacity-60 grayscale" : "border-white/10 hover:border-amber-500/50"}`}
              >
                <img
                  src={certUrl}
                  alt={`Cert ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <span className="text-slate-500">
            {locale === "fa" ? "مدرکی بارگذاری نشده است." : "No certificates uploaded."}
          </span>
        )}
      </div>

      <div className={`p-4 rounded-xl border space-y-3 ${"gallery_paths" in pendingData ? "bg-violet-500/5 border-violet-500/40" : "bg-white/[0.02] border-white/5"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <ImageIcon className={`w-4 h-4 ${"gallery_paths" in pendingData ? "text-violet-400" : "text-amber-500"}`} />
            <span className={"gallery_paths" in pendingData ? "text-violet-300" : "text-slate-300"}>
              {locale === "fa" ? "گالری تصاویر محیط و محصولات" : "Gallery Images"}
            </span>
          </div>
          {"gallery_paths" in pendingData && (
            <span className="flex items-center gap-1 text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/30">
              <RefreshCw className="w-2.5 h-2.5" />
              {locale === "fa" ? "گالری تغییر کرده است" : "Gallery updated"}
            </span>
          )}
        </div>

        {company.gallery_images && company.gallery_images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {company.gallery_images.map((imgUrl, idx) => (
              <a
                key={idx}
                href={imgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative aspect-square rounded-xl overflow-hidden border bg-slate-950 flex items-center justify-center transition-all ${"gallery_paths" in pendingData ? "border-violet-500/30 opacity-60 grayscale" : "border-white/10 hover:border-amber-500/50"}`}
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <span className="text-slate-500">
            {locale === "fa" ? "تصویری ثبت نشده است." : "No gallery images uploaded."}
          </span>
        )}
      </div>
    </div>
  );
};

export default PrmAdminCompanyMediaTab;
