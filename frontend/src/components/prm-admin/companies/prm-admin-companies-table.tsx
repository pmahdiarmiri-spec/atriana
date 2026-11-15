"use client";

import React from "react";
import {
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  PrmCompanyAdminDetails,
  PrmCompanyStatusType,
} from "@/types/prm-companies/prm-company-admin";

interface PrmAdminCompaniesTableProps {
  locale: string;
  companies: PrmCompanyAdminDetails[];
  onSelectReview: (company: PrmCompanyAdminDetails) => void;
}

export const PrmAdminCompaniesTable: React.FC<PrmAdminCompaniesTableProps> = ({
  locale,
  companies,
  onSelectReview,
}) => {
  const getStatusBadge = (
    status: PrmCompanyStatusType,
    hasUpdateRequest?: boolean
  ) => {
    if (hasUpdateRequest) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)] backdrop-blur-md">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          {locale === "fa" ? "درخواست ویرایش اطلاعات" : "Update Requested"}
        </span>
      );
    }

    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {locale === "fa" ? "تایید شده" : "Approved"}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            {locale === "fa" ? "در انتظار بررسی" : "Pending"}
          </span>
        );
      case "needs_edit":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            {locale === "fa" ? "نیازمند اصلاح" : "Needs Edit"}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            {locale === "fa" ? "رد شده" : "Rejected"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {locale === "fa" ? "پیش‌نویس" : "Draft"}
          </span>
        );
    }
  };

  return (
    <div className="prm-companies-table-wrapper w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_0_rgba(15,23,42,0.37)]">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-start font-semibold">
                {locale === "fa" ? "نام شرکت" : "Company Name"}
              </th>
              <th className="px-6 py-4 text-start font-semibold">
                {locale === "fa" ? "شناسه / شماره ثبت" : "Identifiers"}
              </th>
              <th className="px-6 py-4 text-start font-semibold">
                {locale === "fa" ? "صنعت" : "Industry"}
              </th>
              <th className="px-6 py-4 text-start font-semibold">
                {locale === "fa" ? "وضعیت" : "Status"}
              </th>
              <th className="px-6 py-4 text-start font-semibold">
                {locale === "fa" ? "عملیات" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  {locale === "fa"
                    ? "هیچ شرکتی یافت نشد."
                    : "No companies found."}
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className={`transition-colors ${
                    company.has_update_request
                      ? "bg-violet-500/5 hover:bg-violet-500/10"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold text-white">
                        {company.name_fa}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {company.name_en || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {locale === "fa" ? "ملی:" : "National:"}{" "}
                      {company.national_id || "-"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {locale === "fa" ? "ثبت:" : "Reg:"}{" "}
                      {company.registration_number || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {company.industry?.name_fa || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(company.status, company.has_update_request)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onSelectReview(company)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
                        company.has_update_request
                          ? "bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                          : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>
                        {company.has_update_request
                          ? locale === "fa"
                            ? "بررسی ویرایش"
                            : "Review Update"
                          : locale === "fa"
                          ? "بررسی پرونده"
                          : "Audit Dossier"}
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
