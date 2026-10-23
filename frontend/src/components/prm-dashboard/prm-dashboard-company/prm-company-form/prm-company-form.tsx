"use client";

import { ReactNode, ChangeEvent } from "react";
import {
  PrmCompanyActivityType,
  PrmCompanyFormData,
  PrmIndustry,
} from "@/types/prm-company";

interface PrmCompanyFormProps {
  formData: PrmCompanyFormData;
  industries: PrmIndustry[];
  errors: Record<string, string[]>;
  readOnly: boolean;
  onChange: (field: keyof PrmCompanyFormData, value: any) => void;
}

export function PrmCompanyForm({
  formData,
  industries,
  errors,
  readOnly,
  onChange,
}: PrmCompanyFormProps): ReactNode {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof PrmCompanyFormData, value);
  };

  const handleCheckboxChange = (name: keyof PrmCompanyFormData) => {
    onChange(name, !formData[name]);
  };

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">اطلاعات هویتی و عمومی شرکت</span>

      <div className={`prm-form-field ${errors.name_fa ? "prm-form-field-error" : ""}`}>
        <label>نام شرکت (فارسی) *</label>
        <input
          type="text"
          name="name_fa"
          value={formData.name_fa || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: آتریانا تجارت پیشرو"
        />
        {errors.name_fa && <span className="prm-field-error-msg">{errors.name_fa[0]}</span>}
      </div>

      <div className="prm-form-field">
        <label>نام شرکت (انگلیسی)</label>
        <input
          type="text"
          name="name_en"
          value={formData.name_en || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="ATRIANA Commercial Co."
        />
      </div>

      <div className="prm-form-field">
        <label>شعار تجاری</label>
        <input
          type="text"
          name="slogan"
          value={formData.slogan || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field">
        <label>صنعت / حوزه فعالیت</label>
        <select
          name="industry_id"
          value={formData.industry_id || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-select"
        >
          <option value="">انتخاب صنعت</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name_fa}
            </option>
          ))}
        </select>
      </div>

      <div className="prm-form-field prm-company-form-full">
        <label>نوع فعالیت شرکت</label>
        <div className="prm-activity-type-selector">
          <div
            className={`prm-activity-card ${formData.activity_type === "production" ? "prm-activity-card-selected" : ""}`}
            onClick={() => !readOnly && onChange("activity_type", "production")}
          >
            <div className="prm-activity-card-title">تولیدی</div>
            <div className="prm-activity-card-desc">دارای کارخانه، خط تولید مستقیم یا کارگاه‌های صنعتی فعال</div>
          </div>
          <div
            className={`prm-activity-card ${formData.activity_type === "distribution" ? "prm-activity-card-selected" : ""}`}
            onClick={() => !readOnly && onChange("activity_type", "distribution")}
          >
            <div className="prm-activity-card-title">توزیعی / پخش</div>
            <div className="prm-activity-card-desc">پخش عمده، انبارداری و زنجیره تأمین مویرگی در سطح کشور یا بین‌الملل</div>
          </div>
          <div
            className={`prm-activity-card ${formData.activity_type === "trading" ? "prm-activity-card-selected" : ""}`}
            onClick={() => !readOnly && onChange("activity_type", "trading")}
          >
            <div className="prm-activity-card-title">بازرگانی و تجاری</div>
            <div className="prm-activity-card-desc">صادرات، واردات و ترخیص کالا بدون مداخله مستقیم در فرآیند تولید</div>
          </div>
        </div>
      </div>

      <div className="prm-form-field prm-company-form-full">
        <label>توضیحات و معرفی شرکت</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-textarea"
          placeholder="شرح کامل تاریخچه، دستاوردها و حوزه فعالیت..."
        />
      </div>

      <span className="prm-section-title">اطلاعات ثبتی و حقوقی</span>

      <div className="prm-form-field">
        <label>شماره ثبت</label>
        <input
          type="text"
          name="registration_number"
          value={formData.registration_number || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field">
        <label>شناسه ملی</label>
        <input
          type="text"
          name="national_id"
          value={formData.national_id || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
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
        />
      </div>

      <div className="prm-form-field">
        <label>سال تأسیس</label>
        <input
          type="number"
          name="established_year"
          value={formData.established_year || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: 1395"
        />
      </div>

      <div className="prm-form-field">
        <label>ساختار حقوقی</label>
        <input
          type="text"
          name="legal_structure"
          value={formData.legal_structure || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: سهامی خاص / با مسئولیت محدود"
        />
      </div>

      <div className="prm-form-field">
        <label>نوع مالکیت</label>
        <input
          type="text"
          name="ownership_type"
          value={formData.ownership_type || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: خصوصی / دولتی / تعاونی"
        />
      </div>

      <div className="prm-form-checkboxes">
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_knowledge_based}
            onChange={() => handleCheckboxChange("is_knowledge_based")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          دانش‌بنیان
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_creative}
            onChange={() => handleCheckboxChange("is_creative")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          خلاق
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_startup}
            onChange={() => handleCheckboxChange("is_startup")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          استارتاپ
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_exporter}
            onChange={() => handleCheckboxChange("is_exporter")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          صادرکننده
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.has_iso}
            onChange={() => handleCheckboxChange("has_iso")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          دارای ایزو
        </label>
      </div>

      <span className="prm-section-title">اطلاعات تماس و آدرس</span>

      <div className="prm-form-field">
        <label>تلفن ثابت</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field">
        <label>شماره موبایل ارتباطی</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field">
        <label>ایمیل سازمانی</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field">
        <label>وب‌سایت</label>
        <input
          type="url"
          name="website"
          value={formData.website || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="https://..."
        />
      </div>

      <div className="prm-form-field">
        <label>استان</label>
        <input
          type="text"
          name="province"
          value={formData.province || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field">
        <label>شهر</label>
        <input
          type="text"
          name="city"
          value={formData.city || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field prm-company-form-full">
        <label>نشانی کامل پستی</label>
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <span className="prm-section-title">محصولات و ظرفیت‌ها</span>

      <div className="prm-form-field prm-company-form-full">
        <label>محصولات و خدمات اصلی</label>
        <input
          type="text"
          name="main_products"
          value={formData.main_products || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: کودهای ارگانیک، ریزمغذی‌ها"
        />
      </div>

      <div className="prm-form-field">
        <label>ظرفیت تولید / تأمین سالیانه</label>
        <input
          type="text"
          name="production_capacity"
          value={formData.production_capacity || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
        />
      </div>

      <div className="prm-form-field">
        <label>تعداد پرسنل</label>
        <input
          type="text"
          name="employee_count"
          value={formData.employee_count || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: ۱۰ تا ۵۰ نفر"
        />
      </div>
    </div>
  );
}
