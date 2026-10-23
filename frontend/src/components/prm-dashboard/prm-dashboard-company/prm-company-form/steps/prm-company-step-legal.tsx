"use client";

import { ReactNode, ChangeEvent } from "react";
import { PrmCompanyFormData } from "@/types/prm-company";

interface PrmCompanyStepLegalProps {
  formData: PrmCompanyFormData;
  errors: Record<string, string[]>;
  readOnly: boolean;
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

export function PrmCompanyStepLegal({
  formData,
  errors,
  readOnly,
  onChange,
}: PrmCompanyStepLegalProps): ReactNode {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof PrmCompanyFormData, value);
  };

  const handleCheckboxChange = (name: keyof PrmCompanyFormData) => {
    onChange(name, !formData[name]);
  };

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">اطلاعات ثبتی، ساختار حقوقی و نشان‌ها</span>

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

      <div className="prm-form-field">
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
          دانش‌بنیان (سطح یک، دو یا مستعد)
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_creative}
            onChange={() => handleCheckboxChange("is_creative")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          صنایع خلاق
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_startup}
            onChange={() => handleCheckboxChange("is_startup")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          استارتاپ ثبت‌شده
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_exporter}
            onChange={() => handleCheckboxChange("is_exporter")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          صادرکننده نمونه یا فعال
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.has_iso}
            onChange={() => handleCheckboxChange("has_iso")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          دارای استانداردهای بین‌المللی ISO
        </label>
        <label className="prm-checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_emc}
            onChange={() => handleCheckboxChange("is_emc")}
            disabled={readOnly}
            className="prm-checkbox-input"
          />
          شرکت مدیریت صادرات (EMC)
        </label>
      </div>
    </div>
  );
}
