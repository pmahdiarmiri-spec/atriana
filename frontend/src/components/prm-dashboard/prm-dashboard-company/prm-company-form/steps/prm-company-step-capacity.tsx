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

      <div className="prm-upload-card">
        <div className="prm-upload-info">
          <label>لوگوی شرکت</label>
          <span>فرمت PNG، JPG یا SVG (حداکثر ۲۰ مگابایت)</span>
          {formData.logo_path && (
            <span className="prm-upload-success">فایل با موفقیت ذخیره شده است</span>
          )}
        </div>
        <label className="prm-upload-btn-label">
          {uploadingField === "logo" ? "در حال آپلود..." : "انتخاب لوگو"}
          <input
            type="file"
            accept="image/*"
            disabled={readOnly || uploadingField !== null}
            onChange={(e) => handleFileChange("logo", e)}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="prm-upload-card">
        <div className="prm-upload-info">
          <label>تصویر هدر / کاور رسمی شرکت</label>
          <span>نسبت ۱۶:۹ افقی برای پس‌زمینه پروفایل</span>
          {formData.cover_path && (
            <span className="prm-upload-success">کاور ثبت شده است</span>
          )}
        </div>
        <label className="prm-upload-btn-label">
          {uploadingField === "cover" ? "در حال آپلود..." : "انتخاب هدر"}
          <input
            type="file"
            accept="image/*"
            disabled={readOnly || uploadingField !== null}
            onChange={(e) => handleFileChange("cover", e)}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="prm-upload-card">
        <div className="prm-upload-info">
          <label>کاتالوگ رسمی شرکت (PDF)</label>
          <span>معرفی محصولات، تجهیزات و مشخصات فنی</span>
          {formData.catalog_path && (
            <span className="prm-upload-success">کاتالوگ ثبت شده است</span>
          )}
        </div>
        <label className="prm-upload-btn-label">
          {uploadingField === "catalog" ? "در حال آپلود..." : "انتخاب فایل کاتالوگ"}
          <input
            type="file"
            accept=".pdf"
            disabled={readOnly || uploadingField !== null}
            onChange={(e) => handleFileChange("catalog", e)}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="prm-upload-card">
        <div className="prm-upload-info">
          <label>رزومه حقوقی / پروفایل رسمی (PDF)</label>
          <span>پیشینه سازمانی، افتخارات، چارت و صلاحیت‌ها</span>
          {formData.resume_path && (
            <span className="prm-upload-success">رزومه ثبت شده است</span>
          )}
        </div>
        <label className="prm-upload-btn-label">
          {uploadingField === "resume" ? "در حال آپلود..." : "انتخاب رزومه"}
          <input
            type="file"
            accept=".pdf"
            disabled={readOnly || uploadingField !== null}
            onChange={(e) => handleFileChange("resume", e)}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="prm-upload-card prm-company-form-full">
        <div className="prm-upload-info">
          <label>گالری تصاویر خطوط تولید و کارخانه</label>
          <span>امکان انتخاب همزمان چندین تصویر</span>
          {formData.gallery_paths && formData.gallery_paths.length > 0 && (
            <span className="prm-upload-success">
              {formData.gallery_paths.length} تصویر بارگذاری شده است
            </span>
          )}
        </div>
        <label className="prm-upload-btn-label">
          {uploadingField === "gallery" ? "در حال ارسال..." : "افزودن تصاویر گالری"}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={readOnly || uploadingField !== null}
            onChange={(e) => handleFileChange("gallery", e)}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );
}
