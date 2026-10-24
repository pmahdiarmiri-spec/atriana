"use client";

import { ReactNode } from "react";

interface PrmCompanyPaymentModalProps {
  isOpen: boolean;
  amountRials: number;
  paymentType: "registration" | "renewal";
  isProcessing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function PrmCompanyPaymentModal({
  isOpen,
  amountRials,
  paymentType,
  isProcessing,
  onConfirm,
  onClose,
}: PrmCompanyPaymentModalProps): ReactNode {
  if (!isOpen) return null;

  const isRenewal = paymentType === "renewal";

  return (
    <div className="prm-modal-backdrop">
      <div className="prm-modal-content">
        <div className="prm-modal-header">
          <h3>
            {isRenewal
              ? "پرداخت هزینه تمدید اعتبار ۱ ساله شرکت"
              : "پرداخت هزینه بررسی و ثبت شرکت (اعتبار ۱ ساله)"}
          </h3>
        </div>

        <p style={{ margin: 0, color: "var(--prm-text-light)", fontSize: "0.92rem", lineHeight: 1.6 }}>
          {isRenewal
            ? "با تمدید اعتبار، پرونده و نمایش عمومی شرکت شما به مدت ۱ سال کامل تقویمی دیگر تمدید خواهد شد (با ۳۰٪ تعرفه پایه ثبت اولیه)."
            : "جهت ارسال پرونده شرکت شما برای بررسی کارشناسان و ثبت اعتبار ۱ ساله، پرداخت مبلغ اولیه الزامی است. در صورت رد شدن پرونده توسط ادمین، کل مبلغ به کیف پول شما بازگردانده می‌شود."}
        </p>

        <div className="prm-payment-details">
          <div className="prm-payment-row">
            <span>عنوان خدمت:</span>
            <span>
              {isRenewal
                ? "تمدید سالانه نمایش و احراز هویت شرکت"
                : "بررسی مدارک و ثبت اولیه ۱ ساله شرکت"}
            </span>
          </div>
          <div className="prm-payment-row">
            <span>مبلغ قابل پرداخت:</span>
            <strong>{amountRials.toLocaleString("fa-IR")} ریال</strong>
          </div>
          <div className="prm-payment-row">
            <span>مدت اعتبار:</span>
            <span>۳۶۵ روز (یک سال کامل)</span>
          </div>
          <div className="prm-payment-row">
            <span>درگاه:</span>
            <span>درگاه آزمایشی پرداخت (توسعه)</span>
          </div>
        </div>

        <div className="prm-form-actions">
          <button
            type="button"
            className="prm-btn-secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            انصراف
          </button>
          <button
            type="button"
            className="prm-btn-primary"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "در حال پردازش..." : isRenewal ? "تایید و تمدید شرکت" : "تایید و پرداخت"}
          </button>
        </div>
      </div>
    </div>
  );
}
