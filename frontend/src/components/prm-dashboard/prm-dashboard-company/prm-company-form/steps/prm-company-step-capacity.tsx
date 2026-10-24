"use client";

import { ReactNode, ChangeEvent, useState, useEffect } from "react";
import { PrmCompanyFormData } from "@/types/prm-company";

interface PrmCompanyStepCapacityProps {
  formData: PrmCompanyFormData;
  errors: Record<string, string[]>;
  readOnly: boolean;
  token: string;
  onUploadFile: (
    type: "logo" | "cover" | "catalog" | "resume" | "gallery" | "certs",
    files: File | File[]
  ) => Promise<void>;
  onChange: (field: keyof PrmCompanyFormData, value: any) => void;
}

const EMPLOYEE_RANGES = [
  "۱ تا ۵ نفر",
  "۶ تا ۱۰ نفر",
  "۱۱ تا ۲۵ نفر",
  "۲۶ تا ۵۰ نفر",
  "۵۱ تا ۱۰۰ نفر",
  "۱۰۱ تا ۲۵۰ نفر",
  "۲۵۱ تا ۵۰۰ نفر",
  "بیش از ۵۰۰ نفر",
];

const ANNUAL_REVENUE_RANGES = [
  "کمتر از ۱ میلیارد تومان",
  "۱ تا ۵ میلیارد تومان",
  "۵ تا ۲۰ میلیارد تومان",
  "۲۰ تا ۵۰ میلیارد تومان",
  "۵۰ تا ۱۰۰ میلیارد تومان",
  "۱۰۰ تا ۵۰۰ میلیارد تومان",
  "بیش از ۵۰۰ میلیارد تومان",
];

const CAPACITY_UNITS = [
  "تن در سال",
  "تن در ماه",
  "کیلوگرم در ماه",
  "عدد / قطعه در سال",
  "عدد / قطعه در ماه",
  "لیتر در سال",
  "مترمکعب در سال",
  "مترمربع در سال",
  "بسته / کارتن در ماه",
  "سفارش فعال در ماه",
];

const CAPACITY_AMOUNTS = [
  "کمتر از ۵۰",
  "۵۰ تا ۱۰۰",
  "۱۰۰ تا ۲۵۰",
  "۲۵۰ تا ۵۰۰",
  "۵۰۰ تا ۱,۰۰۰",
  "۱,۰۰۰ تا ۵,۰۰۰",
  "۵,۰۰۰ تا ۱۰,۰۰۰",
  "۱۰,۰۰۰ تا ۵۰,۰۰۰",
  "بیش از ۵۰,۰۰۰",
];

export function PrmCompanyStepCapacity({
  formData,
  errors,
  readOnly,
  onUploadFile,
  onChange,
}: PrmCompanyStepCapacityProps): ReactNode {
  const [capacityAmount, setCapacityAmount] = useState<string>("");
  const [capacityUnit, setCapacityUnit] = useState<string>(CAPACITY_UNITS[0]);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.production_capacity) {
      for (const unit of CAPACITY_UNITS) {
        if (formData.production_capacity.endsWith(unit)) {
          const rawAmount = formData.production_capacity.replace(unit, "").trim();
          setCapacityAmount(rawAmount);
          setCapacityUnit(unit);
          return;
        }
      }
      setCapacityAmount(formData.production_capacity);
    }
  }, [formData.production_capacity]);

  const handleCapacityChange = (amount: string, unit: string) => {
    setCapacityAmount(amount);
    setCapacityUnit(unit);
    if (!amount) {
      onChange("production_capacity", null);
    } else {
      onChange("production_capacity", `${amount} ${unit}`.trim());
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof PrmCompanyFormData, value);
  };

  const handleFileChange = async (
    type: "logo" | "cover" | "catalog" | "resume" | "gallery" | "certs",
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploadingField(type);
    try {
      if (type === "gallery" || type === "certs") {
        await onUploadFile(type, Array.from(fileList));
      } else {
        await onUploadFile(type, fileList[0]);
      }
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">ظرفیت‌های تولیدی، عملیاتی و مقیاس سازمانی</span>

      <div className="prm-form-field prm-company-form-full">
        <label>محصولات، خدمات یا پکیج‌های شاخص</label>
        <input
          type="text"
          name="main_products"
          value={formData.main_products || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: کیت‌های استخراج سلول، نانوذرات بیولوژیک، خدمات تله‌مدیسین"
        />
      </div>

      <div className="prm-form-field">
        <label>تعداد پرسنل فعال</label>
        <select
          name="employee_count"
          value={formData.employee_count || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-select"
        >
          <option value="">انتخاب محدوده پرسنل</option>
          {EMPLOYEE_RANGES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="prm-form-field">
        <label>گردش مالی سالیانه تقریبی</label>
        <select
          name="annual_revenue"
          value={formData.annual_revenue || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-select"
        >
          <option value="">انتخاب بازه درآمد سالیانه</option>
          {ANNUAL_REVENUE_RANGES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="prm-form-field">
        <label>بازه ظرفیت تولید / تأمین</label>
        <select
          value={capacityAmount}
          onChange={(e) => handleCapacityChange(e.target.value, capacityUnit)}
          disabled={readOnly}
          className="prm-form-select"
        >
          <option value="">انتخاب میزان تقریبی</option>
          {CAPACITY_AMOUNTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="prm-form-field">
        <label>واحد سنجش ظرفیت</label>
        <select
          value={capacityUnit}
          onChange={(e) => handleCapacityChange(capacityAmount, e.target.value)}
          disabled={readOnly}
          className="prm-form-select"
        >
          {CAPACITY_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div className="prm-form-field">
        <label>گواهینامه‌های کیفی و دستاوردها</label>
        <input
          type="text"
          name="certifications"
          value={formData.certifications || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="GMP, CE, ISO 13485, مجوز وزارت بهداشت"
        />
      </div>

      <div className="prm-form-field">
        <label>مشتریان عمده یا طرف‌های قرارداد کلیدی</label>
        <input
          type="text"
          name="major_clients"
          value={formData.major_clients || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="بیمارستان‌ها، مراکز دانشگاهی، هلدینگ‌های بین‌المللی"
        />
      </div>

      <span className="prm-section-title">رسانه‌ها و مدارک هویتی شرکت</span>

      <div className="prm-upload-box">
        <div className="prm-upload-main-row">
          <div className="prm-upload-info">
            <label>لوگوی شرکت</label>
            <span>فرمت PNG، JPG یا SVG (حداکثر ۲۰ مگابایت)</span>
            {formData.logo_path && (
              <span className="prm-upload-success-chip">✓ ذخیره شده در سامانه</span>
            )}
          </div>
          <div className="prm-upload-action">
            {uploadingField === "logo" ? (
              <div className="prm-uploading-indicator">
                <span className="prm-radar-spinner"></span>
                در حال بارگذاری...
              </div>
            ) : (
              <label className="prm-upload-btn-label">
                انتخاب لوگو
                <input
                  type="file"
                  accept="image/*"
                  disabled={readOnly}
                  onChange={(e) => handleFileChange("logo", e)}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>
        {formData.logo_path && (
          <div className="prm-preview-container">
            <img
              src={formData.logo_path}
              alt="Logo Preview"
              className="prm-preview-image"
            />
          </div>
        )}
      </div>

      <div className="prm-upload-box">
        <div className="prm-upload-main-row">
          <div className="prm-upload-info">
            <label>تصویر هدر / کاور رسمی شرکت</label>
            <span>نسبت ۱۶:۹ افقی برای پس‌زمینه پروفایل</span>
            {formData.cover_path && (
              <span className="prm-upload-success-chip">✓ کاور رسمی ذخیره شد</span>
            )}
          </div>
          <div className="prm-upload-action">
            {uploadingField === "cover" ? (
              <div className="prm-uploading-indicator">
                <span className="prm-radar-spinner"></span>
                در حال بارگذاری...
              </div>
            ) : (
              <label className="prm-upload-btn-label">
                انتخاب کاور
                <input
                  type="file"
                  accept="image/*"
                  disabled={readOnly}
                  onChange={(e) => handleFileChange("cover", e)}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>
        {formData.cover_path && (
          <div className="prm-preview-container">
            <img
              src={formData.cover_path}
              alt="Cover Preview"
              className="prm-cover-preview-image"
            />
          </div>
        )}
      </div>

      <div className="prm-upload-box">
        <div className="prm-upload-main-row">
          <div className="prm-upload-info">
            <label>کاتالوگ رسمی شرکت (PDF)</label>
            <span>معرفی محصولات، تجهیزات و مشخصات فنی</span>
            {formData.catalog_path && (
              <span className="prm-upload-success-chip">✓ کاتالوگ ذخیره شد</span>
            )}
          </div>
          <div className="prm-upload-action">
            {uploadingField === "catalog" ? (
              <div className="prm-uploading-indicator">
                <span className="prm-radar-spinner"></span>
                در حال بارگذاری...
              </div>
            ) : (
              <label className="prm-upload-btn-label">
                انتخاب کاتالوگ
                <input
                  type="file"
                  accept=".pdf"
                  disabled={readOnly}
                  onChange={(e) => handleFileChange("catalog", e)}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>
        {formData.catalog_path && (
          <div className="prm-preview-container">
            <span className="prm-pdf-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              فایل کاتالوگ PDF پیوست شده است
            </span>
          </div>
        )}
      </div>

      <div className="prm-upload-box">
        <div className="prm-upload-main-row">
          <div className="prm-upload-info">
            <label>رزومه حقوقی / پروفایل رسمی (PDF)</label>
            <span>پیشینه سازمانی، افتخارات، چارت و صلاحیت‌ها</span>
            {formData.resume_path && (
              <span className="prm-upload-success-chip">✓ رزومه ثبت شد</span>
            )}
          </div>
          <div className="prm-upload-action">
            {uploadingField === "resume" ? (
              <div className="prm-uploading-indicator">
                <span className="prm-radar-spinner"></span>
                در حال بارگذاری...
              </div>
            ) : (
              <label className="prm-upload-btn-label">
                انتخاب رزومه
                <input
                  type="file"
                  accept=".pdf"
                  disabled={readOnly}
                  onChange={(e) => handleFileChange("resume", e)}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>
        {formData.resume_path && (
          <div className="prm-preview-container">
            <span className="prm-pdf-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              فایل رزومه PDF پیوست شده است
            </span>
          </div>
        )}
      </div>

      <div className="prm-upload-box prm-company-form-full">
        <div className="prm-upload-main-row">
          <div className="prm-upload-info">
            <label>گالری تصاویر خطوط تولید و کارخانه</label>
            <span>امکان انتخاب همزمان چندین تصویر</span>
            {formData.gallery_paths && formData.gallery_paths.length > 0 && (
              <span className="prm-upload-success-chip">
                ✓ {formData.gallery_paths.length} تصویر بارگذاری شده
              </span>
            )}
          </div>
          <div className="prm-upload-action">
            {uploadingField === "gallery" ? (
              <div className="prm-uploading-indicator">
                <span className="prm-radar-spinner"></span>
                در حال بارگذاری تصاویر...
              </div>
            ) : (
              <label className="prm-upload-btn-label">
                افزودن تصاویر گالری
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={readOnly}
                  onChange={(e) => handleFileChange("gallery", e)}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>
        {formData.gallery_paths && formData.gallery_paths.length > 0 && (
          <div className="prm-gallery-preview-grid">
            {formData.gallery_paths.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`Gallery ${idx + 1}`}
                className="prm-gallery-preview-item"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
