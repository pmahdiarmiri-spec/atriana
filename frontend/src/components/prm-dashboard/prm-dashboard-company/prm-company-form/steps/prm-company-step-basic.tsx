"use client";

import { ReactNode, ChangeEvent } from "react";
import { PrmCompanyFormData, PrmIndustry } from "@/types/prm-company";

interface PrmCompanyStepBasicProps {
  formData: PrmCompanyFormData;
  industries: PrmIndustry[];
  errors: Record<string, string[]>;
  readOnly: boolean;
  onChange: (field: keyof PrmCompanyFormData, value: any) => void;
}

export function PrmCompanyStepBasic({
  formData,
  industries,
  errors,
  readOnly,
  onChange,
}: PrmCompanyStepBasicProps): ReactNode {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof PrmCompanyFormData, value);
  };

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">اطلاعات هویتی و برندینگ</span>

      <div className={`prm-form-field ${errors.name_fa ? "prm-form-field-error" : ""}`}>
        <label>نام شرکت (فارسی) *</label>
        <input
          type="text"
          name="name_fa"
          value={formData.name_fa || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="مثال: شرکت بین‌المللی سیناتوسعه"
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
          placeholder="Sina Development International Co."
        />
      </div>

      <div className="prm-form-field">
        <label>شعار تجاری (Slogan)</label>
        <input
          type="text"
          name="slogan"
          value={formData.slogan || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="تضمین برترین نوآوری‌ها در سلامت و صنعت"
        />
      </div>

      <div className="prm-form-field">
        <label>صنعت / حوزه تخصصی فعالیت</label>
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
            <div className="prm-activity-card-title">تولیدی و آزمایشگاهی</div>
            <div className="prm-activity-card-desc">دارای خطوط تولید مستقیم، فرمولاسیون صنعتی یا کارگاه تولیدی</div>
          </div>
          <div
            className={`prm-activity-card ${formData.activity_type === "distribution" ? "prm-activity-card-selected" : ""}`}
            onClick={() => !readOnly && onChange("activity_type", "distribution")}
          >
            <div className="prm-activity-card-title">توزیعی و لجستیک</div>
            <div className="prm-activity-card-desc">شبکه توزیع گسترده، پخش سراسری، انبارداری و زنجیره تأمین مویرگی</div>
          </div>
          <div
            className={`prm-activity-card ${formData.activity_type === "trading" ? "prm-activity-card-selected" : ""}`}
            onClick={() => !readOnly && onChange("activity_type", "trading")}
          >
            <div className="prm-activity-card-title">بازرگانی و ترخیص</div>
            <div className="prm-activity-card-desc">صادرات، واردات کالاهای تخصصی، بازاریابی بین‌المللی و عقد قرارداد تجاری</div>
          </div>
        </div>
      </div>

      <div className="prm-form-field prm-company-form-full">
        <label>توضیحات و معرفی رسمی شرکت</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-textarea"
          placeholder="شرح تاریخچه تأسیس، گواهینامه‌ها، حوزه‌های متمرکز و چشم‌اندازها..."
        />
      </div>
    </div>
  );
}
