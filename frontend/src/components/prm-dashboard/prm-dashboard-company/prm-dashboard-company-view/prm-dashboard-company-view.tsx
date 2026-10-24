"use client";

import { ReactNode, useEffect, useState } from "react";
import { PrmCompany, PrmCompanyFormData, PrmIndustry } from "@/types/prm-company";
import {
  prmGetCompanyIndustries,
  prmGetCompanyPaymentQuote,
  prmGetMyCompany,
  prmRenewCompany,
  prmSaveCompanyDraft,
  prmSubmitCompany,
  prmUploadCompanyFile,
  PrmCompanyApiError,
} from "@/lib/prm-companies/prm-companies-api";
import { PrmCompanyStatusBadge } from "../prm-company-status-badge/prm-company-status-badge";
import { PrmCompanyForm } from "../prm-company-form/prm-company-form";
import { PrmCompanyPaymentModal } from "../prm-company-payment-modal/prm-company-payment-modal";
import "@/styles/dashboard/prm-dashboard-company.css";

interface PrmDashboardCompanyViewProps {
  token: string;
}

const initialFormData: PrmCompanyFormData = {
  name_fa: "",
  name_en: null,
  slogan: null,
  description: null,
  email: null,
  mobile: null,
  country: "ایران",
  phone: null,
  fax: null,
  website: null,
  province: null,
  city: null,
  address: null,
  postal_code: null,
  registration_number: null,
  national_id: null,
  economic_code: null,
  established_year: null,
  legal_structure: null,
  ownership_type: null,
  activity_type: null,
  is_knowledge_based: false,
  is_creative: false,
  is_startup: false,
  is_exporter: false,
  has_iso: false,
  is_emc: false,
  employee_count: null,
  annual_revenue: null,
  industry_id: null,
  main_products: null,
  service_id: null,
  product_category_id: null,
  production_capacity: null,
  business_model: null,
  certifications: null,
  major_clients: null,
  activity_scope: null,
  social_linkedin: null,
  social_instagram: null,
  social_telegram: null,
  social_whatsapp: null,
  social_twitter: null,
  social_facebook: null,
  social_youtube: null,
  social_aparat: null,
  logo_path: null,
  cover_path: null,
  catalog_path: null,
  resume_path: null,
  gallery_paths: null,
  cert_paths: null,
};

export function PrmDashboardCompanyView({
  token,
}: PrmDashboardCompanyViewProps): ReactNode {
  const [company, setCompany] = useState<PrmCompany | null>(null);
  const [formData, setFormData] = useState<PrmCompanyFormData>(initialFormData);
  const [industries, setIndustries] = useState<PrmIndustry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<"registration" | "renewal">("registration");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [companyRes, industriesRes, quoteRes] = await Promise.all([
          prmGetMyCompany(token),
          prmGetCompanyIndustries(token),
          prmGetCompanyPaymentQuote(token, "registration"),
        ]);

        if (!isMounted) return;

        setIndustries(industriesRes.industries);
        setQuoteAmount(quoteRes.amount_rials);

        if (companyRes.company) {
          setCompany(companyRes.company);
          setFormData({
            ...initialFormData,
            ...companyRes.company,
          });
        }
      } catch {
        if (isMounted) {
          setGeneralError("بارگذاری اطلاعات اولیه شرکت با خطا مواجه شد.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleFieldChange = (field: keyof PrmCompanyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setGeneralError(null);
    setErrors({});

    try {
      const res = await prmSaveCompanyDraft(token, formData);
      setCompany(res.company);
      setFormData((prev) => ({ ...prev, ...res.company }));
    } catch (err: any) {
      if (err instanceof PrmCompanyApiError && err.errors) {
        setErrors(err.errors);
      }
      setGeneralError(err.message || "خطایی در ذخیره پیش‌نویس رخ داد.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadFile = async (
    type: "logo" | "cover" | "catalog" | "resume" | "gallery" | "certs",
    files: File | File[]
  ) => {
    setGeneralError(null);
    try {
      const res = await prmUploadCompanyFile(token, type, files);
      setCompany(res.company);
      setFormData((prev) => ({ ...prev, ...res.company }));
    } catch (err: any) {
      if (err instanceof PrmCompanyApiError && err.errors) {
        setErrors(err.errors);
      }
      setGeneralError(err.message || "بارگذاری فایل با خطا مواجه شد.");
    }
  };

  const handleInitiateSubmit = async () => {
    if (!formData.name_fa) {
      setErrors({ name_fa: ["نام فارسی شرکت الزامی است."] });
      setGeneralError("لطفاً نام فارسی شرکت را تکمیل کنید.");
      return;
    }

    try {
      await handleSaveDraft();
      const quote = await prmGetCompanyPaymentQuote(token, "registration");
      setQuoteAmount(quote.amount_rials);
      setPaymentType("registration");
      setIsModalOpen(true);
    } catch {
    }
  };

  const handleInitiateRenewal = async () => {
    try {
      setIsSaving(true);
      const quote = await prmGetCompanyPaymentQuote(token, "renewal");
      setQuoteAmount(quote.amount_rials);
      setPaymentType("renewal");
      setIsModalOpen(true);
    } catch (err: any) {
      setGeneralError(err.message || "دریافت استعلام هزینه تمدید با خطا مواجه شد.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmPaymentAndAction = async () => {
    setIsSubmitting(true);
    setGeneralError(null);

    try {
      if (paymentType === "renewal") {
        const res = await prmRenewCompany(token, "fake");
        setCompany(res.company);
      } else {
        const res = await prmSubmitCompany(token, "fake");
        setCompany(res.company);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      if (err instanceof PrmCompanyApiError && err.errors) {
        setErrors(err.errors);
      }
      setGeneralError(err.message || "پرداخت یا عملیات با خطا مواجه شد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="prm-luxury-card" style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
        در حال بارگذاری اطلاعات شرکت...
      </div>
    );
  }

  const isReadOnly =
    company !== null &&
    company.status !== "draft" &&
    company.status !== "needs_edit";

  const isExpiredOrNearExpiry =
    company &&
    (company.status === "expired" ||
      company.is_expired ||
      (company.status === "approved" &&
        company.expires_at &&
        new Date(company.expires_at).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000));

  return (
    <div className="prm-company-container">
      <div className="prm-luxury-card">
        <div className="prm-company-header">
          <div className="prm-company-header-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
            </svg>
            <h1>مدیریت و ثبت اطلاعات شرکت</h1>
          </div>
          {company && <PrmCompanyStatusBadge status={company.status} />}
        </div>
      </div>

      {company?.expires_at && (
        <div className="prm-luxury-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>تاریخ انقضای اعتبار یک‌ساله:</span>
            <strong style={{ color: company.is_expired ? "var(--accent-color)" : "var(--secondary-color)" }}>
              {new Date(company.expires_at).toLocaleDateString("fa-IR")}
            </strong>
          </div>
          {isExpiredOrNearExpiry && (
            <button
              type="button"
              className="prm-btn-primary"
              onClick={handleInitiateRenewal}
              disabled={isSaving}
            >
              تمدید اعتبار سالانه (۳۰٪ تعرفه)
            </button>
          )}
        </div>
      )}

      {company?.status === "needs_edit" && company.admin_message && (
        <div className="prm-company-alert">
          <strong>پیام بازبینی ادمین:</strong>
          <span>{company.admin_message}</span>
        </div>
      )}

      {company?.status === "rejected" && company.admin_message && (
        <div className="prm-company-alert prm-company-alert-danger">
          <strong>درخواست شما رد شد:</strong>
          <span>{company.admin_message}</span>
          <span style={{ fontSize: "0.85rem", marginTop: 4 }}>
            وجه پرداخت شده به موجودی کیف پول حساب شما بازگردانده شده است.
          </span>
        </div>
      )}

      {company?.status === "expired" && (
        <div className="prm-company-alert prm-company-alert-danger">
          <strong>اعتبار شرکت منقضی شده است:</strong>
          <span>مهلت ۱ ساله نمایش شرکت به پایان رسیده است. جهت فعال‌سازی مجدد، شرکت خود را با ۳۰٪ تعرفه تمدید فرمایید.</span>
        </div>
      )}

      {generalError && (
        <div className="prm-company-alert prm-company-alert-danger">
          <strong>خطا در عملیات:</strong>
          <span>{generalError}</span>
        </div>
      )}

      <div className="prm-luxury-card">
        <PrmCompanyForm
          formData={formData}
          industries={industries}
          errors={errors}
          readOnly={isReadOnly}
          token={token}
          isSaving={isSaving}
          onSaveDraft={handleSaveDraft}
          onSubmitInitiate={handleInitiateSubmit}
          onUploadFile={handleUploadFile}
          onChange={handleFieldChange}
        />
      </div>

      <PrmCompanyPaymentModal
        isOpen={isModalOpen}
        amountRials={quoteAmount}
        paymentType={paymentType}
        isProcessing={isSubmitting}
        onConfirm={handleConfirmPaymentAndAction}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
