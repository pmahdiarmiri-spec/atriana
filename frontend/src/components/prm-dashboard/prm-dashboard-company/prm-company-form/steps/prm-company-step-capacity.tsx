"use client";

import { ReactNode, ChangeEvent, useState, useEffect, KeyboardEvent } from "react";
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

const PRODUCT_SUGGESTIONS = [
  "مواد اولیه صنعتی",
  "تجهیزات پزشکی و آزمایشگاهی",
  "قطعات خودرو و ماشین‌آلات",
  "محصولات پتروشیمی و پلیمری",
  "صنایع غذایی و کشاورزی",
  "خدمات لجستیک و ترخیص",
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

  const [productInput, setProductInput] = useState<string>("");
  const productsList = formData.main_products
    ? formData.main_products
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [brandInput, setBrandInput] = useState<string>("");
  const brandsList = formData.major_clients
    ? formData.major_clients
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

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

  const addProductTag = (rawValue: string) => {
    const cleaned = rawValue.replace(/[,،]/g, "").trim();
    if (!cleaned || readOnly) return;
    if (!productsList.includes(cleaned)) {
      const newList = [...productsList, cleaned];
      onChange("main_products", newList.join(", "));
    }
    setProductInput("");
  };

  const handleProductKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "،") {
      e.preventDefault();
      addProductTag(productInput);
    } else if (e.key === "Backspace" && !productInput && productsList.length > 0) {
      removeProduct(productsList.length - 1);
    }
  };

  const removeProduct = (idx: number) => {
    if (readOnly) return;
    const newList = productsList.filter((_, i) => i !== idx);
    onChange("main_products", newList.join(", "));
  };

  const addBrandTag = (rawValue: string) => {
    const cleaned = rawValue.replace(/[|،,]/g, "").trim();
    if (!cleaned || readOnly) return;
    if (!brandsList.includes(cleaned)) {
      const newList = [...brandsList, cleaned];
      onChange("major_clients", newList.join(" | "));
    }
    setBrandInput("");
  };

  const handleBrandKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "،") {
      e.preventDefault();
      addBrandTag(brandInput);
    } else if (e.key === "Backspace" && !brandInput && brandsList.length > 0) {
      removeBrand(brandsList.length - 1);
    }
  };

  const removeBrand = (idx: number) => {
    if (readOnly) return;
    const newList = brandsList.filter((_, i) => i !== idx);
    onChange("major_clients", newList.join(" | "));
  };

  const logoPreviewUrl = (formData as any).logo_url || formData.logo_path;
  const coverPreviewUrl = (formData as any).cover_url || formData.cover_path;
  const galleryPreviewUrls: string[] =
    (formData as any).gallery_images && Array.isArray((formData as any).gallery_images) && (formData as any).gallery_images.length > 0
      ? (formData as any).gallery_images
      : Array.isArray(formData.gallery_paths)
      ? formData.gallery_paths
      : [];

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">ظرفیت‌های تولیدی، عملیاتی و مقیاس سازمانی</span>

      <div className="prm-form-field prm-company-form-full">
        <div className="prm-tag-section-header">
          <div>
            <label>کلمات کلیدی، محصولات و خدمات استراتژیک شرکت</label>
            <span className="prm-tag-helper-hint">
              عبارت را تایپ کرده و دکمه «افزودن» یا کلید Enter را بزنید
            </span>
          </div>
          <span className="prm-tag-count-badge">
            {productsList.length} مورد ثبت شده
          </span>
        </div>

        <div className="prm-modern-tag-box">
          {!readOnly && (
            <div className="prm-modern-tag-input-bar">
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyDown={handleProductKeyDown}
                className="prm-modern-tag-input"
                placeholder="مثال: ورق فولادی، تجهیزات آزمایشگاهی، ترخیص کالا..."
              />
              <button
                type="button"
                onClick={() => addProductTag(productInput)}
                disabled={!productInput.trim()}
                className="prm-modern-tag-add-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                افزودن کلیدواژه
              </button>
            </div>
          )}

          {productsList.length > 0 ? (
            <div className="prm-modern-tags-list">
              {productsList.map((prod, idx) => (
                <div key={`prod-${idx}`} className="prm-modern-tag-chip">
                  <span className="prm-modern-tag-index">{idx + 1}</span>
                  <span className="prm-modern-tag-label">{prod}</span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => removeProduct(idx)}
                      className="prm-modern-tag-remove"
                      aria-label="حذف"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="prm-modern-tag-empty">
              هنوز هیچ محصول یا کلیدواژه‌ای ثبت نشده است.
            </div>
          )}

          {!readOnly && (
            <div className="prm-tag-suggestions-row">
              <span className="prm-suggestion-label">پیشنهاد سریع:</span>
              {PRODUCT_SUGGESTIONS.map((sug) => {
                const isAdded = productsList.includes(sug);
                return (
                  <button
                    key={sug}
                    type="button"
                    disabled={isAdded}
                    onClick={() => addProductTag(sug)}
                    className={`prm-suggestion-pill ${
                      isAdded ? "prm-suggestion-pill-added" : ""
                    }`}
                  >
                    {isAdded ? `✓ ${sug}` : `+ ${sug}`}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="prm-form-field prm-company-form-full">
        <div className="prm-tag-section-header">
          <div>
            <label>مشتریان شاخص و سابقه همکاری با برندهای معتبر</label>
            <span className="prm-tag-helper-hint">
              نام سازمان یا برند طرف قرارداد را وارد کرده و اضافه کنید
            </span>
          </div>
          <span className="prm-tag-count-badge">
            {brandsList.length} برند ثبت شده
          </span>
        </div>

        <div className="prm-modern-tag-box prm-brand-tag-box">
          {!readOnly && (
            <div className="prm-modern-tag-input-bar">
              <input
                type="text"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                onKeyDown={handleBrandKeyDown}
                className="prm-modern-tag-input"
                placeholder="مثال: فولاد مبارکه، ایران‌خودرو، پتروشیمی جم..."
              />
              <button
                type="button"
                onClick={() => addBrandTag(brandInput)}
                disabled={!brandInput.trim()}
                className="prm-modern-tag-add-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                افزودن برند
              </button>
            </div>
          )}

          {brandsList.length > 0 ? (
            <div className="prm-modern-tags-list">
              {brandsList.map((brand, idx) => (
                <div
                  key={`brand-${idx}`}
                  className="prm-modern-tag-chip prm-modern-brand-chip"
                >
                  <span className="prm-modern-tag-index">★</span>
                  <span className="prm-modern-tag-label">{brand}</span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => removeBrand(idx)}
                      className="prm-modern-tag-remove"
                      aria-label="حذف"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="prm-modern-tag-empty">
              سابقه همکاری با شرکت‌ها یا سازمان‌های شاخص را در این بخش وارد نمایید.
            </div>
          )}
        </div>
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
        <label>کد تعرفه گمرکی (HS Code)</label>
        <input
          type="text"
          name="tariff_code"
          value={formData.tariff_code || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: 30049090"
        />
      </div>

      <div className="prm-form-field">
        <label>عناوین گواهینامه‌های کیفی و استانداردها</label>
        <input
          type="text"
          name="certifications"
          value={formData.certifications || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: GMP, CE, ISO 9001, ISO 13485"
        />
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

      <span className="prm-section-title">رسانه‌ها، هویت بصری و اسناد تجاری شرکت</span>

      <div className="prm-upload-box">
        <div className="prm-upload-main-row">
          <div className="prm-upload-info">
            <label>لوگوی رسمی شرکت</label>
            <span>فرمت PNG، JPG یا SVG (حداکثر ۲۰ مگابایت)</span>
            {formData.logo_path && (
              <span className="prm-upload-success-chip">✓ ذخیره شده در سامانه</span>
            )}
          </div>
          <div className="prm-upload-action">
            {uploadingField === "logo" ? (
              <div className="prm-uploading-indicator">
                <span className="prm-radar-spinner" />
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
        {logoPreviewUrl && (
          <div className="prm-preview-container">
            <img
              src={logoPreviewUrl}
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
                <span className="prm-radar-spinner" />
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
        {coverPreviewUrl && (
          <div className="prm-preview-container">
            <img
              src={coverPreviewUrl}
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
                <span className="prm-radar-spinner" />
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
                <span className="prm-radar-spinner" />
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
            {galleryPreviewUrls.length > 0 && (
              <span className="prm-upload-success-chip">
                ✓ {galleryPreviewUrls.length} تصویر بارگذاری شده
              </span>
            )}
          </div>
          <div className="prm-upload-action">
            {uploadingField === "gallery" ? (
              <div className="prm-uploading-indicator">
                <span className="prm-radar-spinner" />
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
        {galleryPreviewUrls.length > 0 && (
          <div className="prm-gallery-preview-grid">
            {galleryPreviewUrls.map((imgUrl, idx) => (
              <img
                key={`gal-${idx}`}
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
