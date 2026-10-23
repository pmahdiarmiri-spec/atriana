"use client";

import { ReactNode, useState } from "react";
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
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

      <div className="prm-wizard-content">
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
