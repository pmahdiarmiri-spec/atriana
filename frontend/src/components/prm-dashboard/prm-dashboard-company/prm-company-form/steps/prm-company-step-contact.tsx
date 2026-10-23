"use client";

import { ReactNode, ChangeEvent } from "react";
import { PrmCompanyFormData } from "@/types/prm-company";

interface PrmCompanyStepContactProps {
  formData: PrmCompanyFormData;
  errors: Record<string, string[]>;
  readOnly: boolean;
  onChange: (field: keyof PrmCompanyFormData, value: any) => void;
}

export function PrmCompanyStepContact({
  formData,
  errors,
  readOnly,
  onChange,
}: PrmCompanyStepContactProps): ReactNode {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof PrmCompanyFormData, value);
  };

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">اطلاعات ارتباطی و آدرس کارخانه / دفتر مرکزی</span>

      <div className="prm-form-field">
        <label>تلفن ثابت دفتر</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="02188000000"
        />
      </div>

      <div className="prm-form-field">
        <label>شماره تماس مستقیم / موبایل هماهنگی</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="09120000000"
        />
      </div>

      <div className={`prm-form-field ${errors.email ? "prm-form-field-error" : ""}`}>
        <label>ایمیل سازمانی رسمی</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="info@company.com"
        />
        {errors.email && <span className="prm-field-error-msg">{errors.email[0]}</span>}
      </div>

      <div className={`prm-form-field ${errors.website ? "prm-form-field-error" : ""}`}>
        <label>آدرس وب‌سایت</label>
        <input
          type="url"
          name="website"
          value={formData.website || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="https://company.com"
        />
        {errors.website && <span className="prm-field-error-msg">{errors.website[0]}</span>}
      </div>

      <div className="prm-form-field">
        <label>شماره نمابر (فکس)</label>
        <input
          type="text"
          name="fax"
          value={formData.fax || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="02188000001"
        />
      </div>

      <div className="prm-form-field">
        <label>کشور محل استقرار</label>
        <input
          type="text"
          name="country"
          value={formData.country || "ایران"}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
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
          placeholder="تهران / اصفهان..."
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
          placeholder="تهران / نجف‌آباد..."
        />
      </div>

      <div className="prm-form-field">
        <label>کد پستی ده رقمی</label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="8514900000"
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
          placeholder="خیابان، پلاک، طبقه، واحد..."
        />
      </div>

      <span className="prm-section-title">شبکه‌های اجتماعی و پیام‌رسان‌ها</span>

      <div className="prm-form-field">
        <label>لینکدین (LinkedIn)</label>
        <input
          type="text"
          name="social_linkedin"
          value={formData.social_linkedin || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="linkedin.com/company/..."
        />
      </div>

      <div className="prm-form-field">
        <label>اینستاگرام (Instagram)</label>
        <input
          type="text"
          name="social_instagram"
          value={formData.social_instagram || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="instagram.com/..."
        />
      </div>

      <div className="prm-form-field">
        <label>تلگرام (Telegram)</label>
        <input
          type="text"
          name="social_telegram"
          value={formData.social_telegram || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="t.me/..."
        />
      </div>

      <div className="prm-form-field">
        <label>واتس‌اپ تجاری (WhatsApp)</label>
        <input
          type="text"
          name="social_whatsapp"
          value={formData.social_whatsapp || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="wa.me/..."
        />
      </div>
    </div>
  );
}
