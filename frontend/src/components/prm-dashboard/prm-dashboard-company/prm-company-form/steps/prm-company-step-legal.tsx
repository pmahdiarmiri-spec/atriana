"use client";

import { ReactNode, ChangeEvent, useState } from "react";
import { PrmCompanyFormData } from "@/types/prm-company";

interface PrmCompanyStepLegalProps {
  formData: PrmCompanyFormData;
  errors: Record<string, string[]>;
  readOnly: boolean;
  onUploadFile: (
    type: "logo" | "cover" | "catalog" | "resume" | "gallery" | "certs",
    files: File | File[]
  ) => Promise<void>;
  onChange: (field: keyof PrmCompanyFormData, value: any) => void;
}

const LEGAL_STRUCTURE_OPTIONS = [
  "سهامی خاص",
  "سهامی عام",
  "با مسئولیت محدود",
  "تعاونی",
  "تضامنی",
  "مختلط سهامی",
  "مختلط غیرسهامی",
  "نسبی",
  "مؤسسه غیرتجاری (انتفاعی)",
  "مؤسسه غیرتجاری (غیرانتفاعی)",
  "شعبه شرکت خارجی",
  "نمایندگی شرکت خارجی",
  "سایر",
];

const OWNERSHIP_TYPE_OPTIONS = [
  "خصوصی",
  "دولتی",
  "عمومی غیردولتی",
  "نیمه‌دولتی (خصولتی)",
  "تعاونی",
  "سرمایه‌گذاری مشترک (Joint Venture)",
  "خارجی (۱۰۰٪)",
  "سهامی عام در بورس",
];

interface PrmBadgeOption {
  field:
    | "is_knowledge_based"
    | "is_creative"
    | "is_startup"
    | "is_exporter"
    | "has_iso"
    | "is_emc";
  title: string;
  subtitle: string;
}

const BADGE_OPTIONS: PrmBadgeOption[] = [
  {
    field: "is_knowledge_based",
    title: "دانش‌بنیان (سطح ۱، ۲ یا مستعد)",
    subtitle: "دارای تاییدیه رسمی از معاونت علمی و فناوری",
  },
  {
    field: "is_creative",
    title: "صنایع خلاق و نوآور",
    subtitle: "عضو زیست‌بوم شرکت‌های خلاق و فرهنگی",
  },
  {
    field: "is_startup",
    title: "استارتاپ ثبت‌شده",
    subtitle: "کسب‌وکار نوپا مستقر در پارک علم و فناوری یا شتاب‌دهنده",
  },
  {
    field: "is_exporter",
    title: "صادرکننده نمونه یا فعال",
    subtitle: "دارای کارت بازرگانی و سابقه صادرات رسمی گمرکی",
  },
  {
    field: "has_iso",
    title: "استانداردهای بین‌المللی ISO",
    subtitle: "دارای گواهینامه‌های مدیریت کیفیت و استاندارد جهانی",
  },
  {
    field: "is_emc",
    title: "شرکت مدیریت صادرات (EMC)",
    subtitle: "مجوز تخصصی توسعه بازار و صادرات بین‌الملل",
  },
];

export function PrmCompanyStepLegal({
  formData,
  errors,
  readOnly,
  onUploadFile,
  onChange,
}: PrmCompanyStepLegalProps): ReactNode {
  const [isUploadingCerts, setIsUploadingCerts] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof PrmCompanyFormData, value);
  };

  const handleCheckboxChange = (field: PrmBadgeOption["field"]) => {
    if (readOnly) return;
    onChange(field, !Boolean(formData[field]));
  };

  const handleCertFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploadingCerts(true);
    try {
      await onUploadFile("certs", Array.from(fileList));
    } finally {
      setIsUploadingCerts(false);
      e.target.value = "";
    }
  };

  const activeBadges = BADGE_OPTIONS.filter((b) => Boolean(formData[b.field]));
  const hasAnyBadgeSelected = activeBadges.length > 0;

  const certFilesList: string[] =
    (formData as any).cert_images && Array.isArray((formData as any).cert_images) && (formData as any).cert_images.length > 0
      ? (formData as any).cert_images
      : Array.isArray(formData.cert_paths)
      ? formData.cert_paths
      : [];

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">اطلاعات ثبتی، ساختار حقوقی و نشان‌های اعتباری</span>

      <div className="prm-form-field">
        <label>ساختار حقوقی ثبتی</label>
        <select
          name="legal_structure"
          value={formData.legal_structure || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-select"
        >
          <option value="">انتخاب ساختار حقوقی</option>
          {LEGAL_STRUCTURE_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="prm-form-field">
        <label>نوع مالکیت</label>
        <select
          name="ownership_type"
          value={formData.ownership_type || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-select"
        >
          <option value="">انتخاب نوع مالکیت</option>
          {OWNERSHIP_TYPE_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="prm-form-field">
        <label>شماره ثبت شرکت</label>
        <input
          type="text"
          name="registration_number"
          value={formData.registration_number || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: 582490"
        />
      </div>

      <div className="prm-form-field">
        <label>شناسه ملی (۱۱ رقمی)</label>
        <input
          type="text"
          name="national_id"
          value={formData.national_id || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: 14009876543"
        />
      </div>

      <div className="prm-form-field">
        <label>کد اقتصادی</label>
        <input
          type="text"
          name="economic_code"
          value={formData.economic_code || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="کد ۱۲ رقمی اقتصادی"
        />
      </div>

      <div className={`prm-form-field ${errors.established_year ? "prm-form-field-error" : ""}`}>
        <label>سال تأسیس (هجری شمسی)</label>
        <input
          type="number"
          name="established_year"
          value={formData.established_year || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: 1396"
        />
        {errors.established_year && (
          <span className="prm-field-error-msg">{errors.established_year[0]}</span>
        )}
      </div>

      <div className="prm-form-field prm-company-form-full">
        <div className="prm-badges-header-row">
          <div>
            <label className="prm-badges-main-label">
              نشان‌ها و صلاحیت‌های تخصصی شرکت
            </label>
            <p className="prm-badges-sub-label">
              در صورت دارا بودن هر یک از مجوزهای زیر، روی کارت مربوطه کلیک کنید تا تیک بخورد و بخش بارگذاری مدرک در همین پایین برایتان فعال شود.
            </p>
          </div>
          {hasAnyBadgeSelected && (
            <span className="prm-badges-active-counter">
              {activeBadges.length} نشان انتخاب شده
            </span>
          )}
        </div>

        <div className="prm-badges-grid">
          {BADGE_OPTIONS.map((badge) => {
            const isChecked = Boolean(formData[badge.field]);

            return (
              <div
                key={badge.field}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={readOnly ? -1 : 0}
                onClick={() => handleCheckboxChange(badge.field)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleCheckboxChange(badge.field);
                  }
                }}
                className={`prm-liquid-checkbox-card ${
                  isChecked ? "prm-liquid-checkbox-active" : ""
                } ${readOnly ? "prm-checkbox-readonly" : ""}`}
              >
                <div className="prm-liquid-checkbox-indicator">
                  {isChecked && (
                    <svg
                      className="prm-checkbox-tick-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                <div className="prm-checkbox-content">
                  <span className="prm-checkbox-title">{badge.title}</span>
                  <span className="prm-checkbox-subtitle">{badge.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>

        {hasAnyBadgeSelected && (
          <div className="prm-inline-cert-upload-wrapper">
            <div className="prm-inline-cert-header">
              <div className="prm-inline-cert-info">
                <div className="prm-inline-cert-title-row">
                  <span className="prm-inline-cert-pulse" />
                  <h4>بارگذاری مستندات و گواهینامه‌های نشان‌های انتخابی</h4>
                </div>
                <p>
                  شما نشان‌های{" "}
                  <strong>
                    {activeBadges.map((b) => `«${b.title}»`).join("، ")}
                  </strong>{" "}
                  را انتخاب کرده‌اید. لطفاً تصویر یا فایل PDF مدارک مثبته را در همین بخش بارگذاری نمایید.
                </p>

                {certFilesList.length > 0 ? (
                  <span className="prm-upload-success-chip">
                    ✓ {certFilesList.length} فایل مدرک معتبر پیوست شده است
                  </span>
                ) : (
                  <span className="prm-inline-cert-warning-chip">
                    ! بارگذاری حداقل یک مدرک برای ثبت نهایی الزامی است
                  </span>
                )}
              </div>

              <div className="prm-upload-action">
                {isUploadingCerts ? (
                  <div className="prm-uploading-indicator">
                    <span className="prm-radar-spinner" />
                    در حال آپلود مدارک...
                  </div>
                ) : (
                  <label className="prm-upload-btn-label prm-cert-upload-trigger">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    انتخاب و آپلود مدارک
                    <input
                      type="file"
                      name="certs"
                      accept="image/*,.pdf"
                      multiple
                      disabled={readOnly}
                      onChange={handleCertFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            </div>

            {certFilesList.length > 0 && (
              <div className="prm-cert-files-preview-grid">
                {certFilesList.map((fileUrl, idx) => {
                  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
                  return (
                    <a
                      key={`cert-${idx}`}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prm-cert-preview-card"
                    >
                      {isPdf ? (
                        <div className="prm-cert-pdf-box">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span>سند PDF شماره {idx + 1}</span>
                        </div>
                      ) : (
                        <div className="prm-cert-img-box">
                          <img
                            src={fileUrl}
                            alt={`گواهینامه ${idx + 1}`}
                            className="prm-cert-thumb-img"
                          />
                          <span>مدرک تصویری {idx + 1}</span>
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
