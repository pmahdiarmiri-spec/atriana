"use client";

import { ReactNode, useState, useEffect } from "react";
import { PrmCompanyFormData, PrmIndustry } from "@/types/prm-company";
import { PrmCompanyStepBasic } from "./steps/prm-company-step-basic";
import { PrmCompanyStepLegal } from "./steps/prm-company-step-legal";
import { PrmCompanyStepContact } from "./steps/prm-company-step-contact";
import { PrmCompanyStepCapacity } from "./steps/prm-company-step-capacity";

interface PrmCompanyFormProps {
  formData: PrmCompanyFormData;
  industries: PrmIndustry[];
  errors: Record<string, string[]>;
  readOnly: boolean;
  token: string;
  isSaving: boolean;
  onSaveDraft: () => Promise<void>;
  onSubmitInitiate: () => Promise<void>;
  onUploadFile: (
    type: "logo" | "cover" | "catalog" | "resume" | "gallery" | "certs",
    files: File | File[]
  ) => Promise<void>;
  onChange: (field: keyof PrmCompanyFormData, value: any) => void;
}

const STEPS = [
  { id: 1, title: "هویت و برند", desc: "اطلاعات عمومی و حوزه تخصصی" },
  { id: 2, title: "اطلاعات حقوقی", desc: "ساختار ثبتی و مجوزها" },
  { id: 3, title: "تماس و ارتباطات", desc: "آدرس کارخانه و شبکه‌ها" },
  { id: 4, title: "ظرفیت و اسناد", desc: "مقیاس، مدارک و کاتالوگ" },
];

const STEP_FIELDS: Record<number, string[]> = {
  1: ["name_fa", "name_en", "slogan", "industry_id", "activity_type", "description"],
  2: [
    "legal_structure",
    "ownership_type",
    "registration_number",
    "national_id",
    "economic_code",
    "established_year",
  ],
  3: [
    "phone",
    "mobile",
    "email",
    "website",
    "fax",
    "country",
    "province",
    "city",
    "postal_code",
    "address",
    "social_linkedin",
    "social_instagram",
    "social_telegram",
    "social_whatsapp",
  ],
  4: [
    "main_products",
    "employee_count",
    "annual_revenue",
    "production_capacity",
    "certifications",
    "major_clients",
    "logo",
    "cover",
    "catalog",
    "resume",
    "gallery",
  ],
};

export function PrmCompanyForm({
  formData,
  industries,
  errors,
  readOnly,
  token,
  isSaving,
  onSaveDraft,
  onSubmitInitiate,
  onUploadFile,
  onChange,
}: PrmCompanyFormProps): ReactNode {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = STEPS.length;

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;

    for (let step = 1; step <= totalSteps; step++) {
      const fields = STEP_FIELDS[step] || [];
      const hasErrorInStep = errorKeys.some((k) => fields.includes(k));
      if (hasErrorInStep) {
        setCurrentStep(step);
        setTimeout(() => {
          const firstErrField = errorKeys.find((k) => fields.includes(k));
          if (firstErrField) {
            const el =
              document.querySelector(`[name="${firstErrField}"]`) ||
              document.querySelector(".prm-form-field-error");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }, 150);
        break;
      }
    }
  }, [errors]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  const remainingSteps = totalSteps - currentStep;

  return (
    <div className="prm-wizard-wrapper">
      <div className="prm-wizard-header">
        <div className="prm-wizard-meta">
          <span className="prm-wizard-badge">
            مرحله {currentStep} از {totalSteps}
          </span>
          <span className="prm-wizard-remaining">
            {remainingSteps === 0
              ? "مرحله نهایی تکمیل پرونده"
              : `${remainingSteps} مرحله دیگر باقی‌مانده است`}
          </span>
        </div>

        <div className="prm-wizard-progress-track">
          <div
            className="prm-wizard-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="prm-wizard-step-indicators">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`prm-wizard-step-item ${
                  isCurrent ? "prm-step-active" : ""
                } ${isCompleted ? "prm-step-done" : ""}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="prm-step-circle">
                  {isCompleted ? "✓" : step.id}
                </div>
                <div className="prm-step-text">
                  <strong>{step.title}</strong>
                  <span>{step.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="prm-wizard-content" key={`step-${currentStep}`}>
        {currentStep === 1 && (
          <PrmCompanyStepBasic
            formData={formData}
            industries={industries}
            errors={errors}
            readOnly={readOnly}
            onChange={onChange}
          />
        )}

        {currentStep === 2 && (
          <PrmCompanyStepLegal
            formData={formData}
            errors={errors}
            readOnly={readOnly}
            onChange={onChange}
          />
        )}

        {currentStep === 3 && (
          <PrmCompanyStepContact
            formData={formData}
            errors={errors}
            readOnly={readOnly}
            onChange={onChange}
          />
        )}

        {currentStep === 4 && (
          <PrmCompanyStepCapacity
            formData={formData}
            errors={errors}
            readOnly={readOnly}
            token={token}
            onUploadFile={onUploadFile}
            onChange={onChange}
          />
        )}
      </div>

      <div className="prm-form-actions prm-wizard-actions">
        <div className="prm-actions-left">
          {currentStep > 1 && (
            <button
              type="button"
              className="prm-btn-secondary"
              onClick={handlePrev}
            >
              مرحله قبل
            </button>
          )}
        </div>

        <div className="prm-actions-right">
          {!readOnly && (
            <button
              type="button"
              className="prm-btn-secondary"
              onClick={onSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              className="prm-btn-primary"
              onClick={handleNext}
            >
              مرحله بعد
            </button>
          ) : (
            !readOnly && (
              <button
                type="button"
                className="prm-btn-primary"
                onClick={onSubmitInitiate}
                disabled={isSaving}
              >
                ثبت و پرداخت هزینه بررسی
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
