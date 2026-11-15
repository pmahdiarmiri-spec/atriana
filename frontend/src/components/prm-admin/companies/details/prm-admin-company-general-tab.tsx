"use client";

import React from "react";
import { PrmCompanyAdminDetails } from "@/types/prm-companies/prm-company-admin";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Building,
  Calendar,
  Layers,
} from "lucide-react";

interface PrmAdminCompanyGeneralTabProps {
  locale: string;
  company: PrmCompanyAdminDetails;
}

export const PrmAdminCompanyGeneralTab: React.FC<
  PrmAdminCompanyGeneralTabProps
> = ({ locale, company }) => {
  const pendingData = company.pending_update_data || {};

  const renderDiffText = (
    originalValue: string | number | null | undefined,
    fieldKey: string,
    isBlock = false
  ) => {
    const hasUpdate = fieldKey in pendingData;
    const newValue = pendingData[fieldKey];

    if (!hasUpdate) {
      return (
        <span className={isBlock ? "block text-slate-200" : "text-slate-200 truncate block"}>
          {originalValue || "-"}
        </span>
      );
    }

    return (
      <div className="flex flex-col gap-1 mt-0.5">
        <span className="line-through text-slate-500/70 text-[10px]">
          {originalValue || "-"}
        </span>
        <span className="text-violet-300 font-semibold bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(139,92,246,0.15)] inline-block w-fit">
          {newValue || "-"}
        </span>
      </div>
    );
  };

  const renderDiffLocation = () => {
    const addressKeys = ["country", "province", "city", "address"];
    const hasAddressUpdate = addressKeys.some((k) => k in pendingData);

    const oldAddress = `${company.country || ""} ${
      company.province ? `- ${company.province}` : ""
    } ${company.city ? `- ${company.city}` : ""} ${
      company.address ? `- ${company.address}` : ""
    }`;

    if (!hasAddressUpdate) {
      return <p className="text-slate-200 leading-relaxed">{oldAddress}</p>;
    }

    const newCountry = pendingData.country ?? company.country;
    const newProvince = pendingData.province ?? company.province;
    const newCity = pendingData.city ?? company.city;
    const newAddressDetail = pendingData.address ?? company.address;

    const newAddress = `${newCountry || ""} ${
      newProvince ? `- ${newProvince}` : ""
    } ${newCity ? `- ${newCity}` : ""} ${
      newAddressDetail ? `- ${newAddressDetail}` : ""
    }`;

    return (
      <div className="flex flex-col gap-1.5 mt-1">
        <p className="line-through text-slate-500/70 text-[11px] leading-relaxed">
          {oldAddress}
        </p>
        <p className="text-violet-300 font-semibold bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(139,92,246,0.15)] leading-relaxed">
          {newAddress}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4 text-xs prm-company-general">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "نام فارسی" : "Name (FA)"}
          </span>
          {renderDiffText(company.name_fa, "name_fa")}
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "نام انگلیسی" : "Name (EN)"}
          </span>
          {renderDiffText(company.name_en, "name_en")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
          <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 block">
              {locale === "fa" ? "ایمیل شرکت" : "Email"}
            </span>
            {renderDiffText(company.email, "email")}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
          <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 block">
              {locale === "fa" ? "تلفن ثابت" : "Phone"}
            </span>
            {renderDiffText(company.phone, "phone")}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 block">
              {locale === "fa" ? "وبسایت" : "Website"}
            </span>
            {renderDiffText(company.website, "website")}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 block">
              {locale === "fa" ? "صنعت" : "Industry"}
            </span>
            {renderDiffText(company.industry?.name_fa, "industry_id")}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 block">
              {locale === "fa" ? "سال تاسیس" : "Established"}
            </span>
            {renderDiffText(company.established_year, "established_year")}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
          <Building className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 block">
              {locale === "fa" ? "تعداد پرسنل" : "Employees"}
            </span>
            {renderDiffText(company.employee_count, "employee_count")}
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 flex flex-col">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-1">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {locale === "fa" ? "نشانی و موقعیت جغرافیایی" : "Address & Location"}
          </span>
        </div>
        {renderDiffLocation()}
        <div className="pt-2 mt-2 border-t border-white/5">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "کد پستی:" : "Postal Code:"}
          </span>
          {renderDiffText(company.postal_code, "postal_code")}
        </div>
      </div>

      {(company.description || "description" in pendingData) && (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 block">
            {locale === "fa" ? "شرح فعالیت و معرفی" : "Description"}
          </span>
          {renderDiffText(company.description, "description", true)}
        </div>
      )}
    </div>
  );
};

export default PrmAdminCompanyGeneralTab;
