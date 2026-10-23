"use client";

import { ReactNode } from "react";

interface PrmCompanyPaymentModalProps {
  isOpen: boolean;
  amountRials: number;
  isProcessing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function PrmCompanyPaymentModal({
  isOpen,
  amountRials,
  isProcessing,
  onConfirm,
  onClose,
}: PrmCompanyPaymentModalProps): ReactNode {
  if (!isOpen) return null;

  return (
    <div className="prm-modal-backdrop">
      <div className="prm-modal-content">
        <div className="prm-modal-header">
          <h3>پرداخت هزینه بررسی و ثبت شرکت</h3>
        </div>

        <p style={{ margin: 0, color: "var(--prm-text-light)", fontSize: "0.92rem", lineHeight: 1.6 }}>
          جهت ارسال پرونده شرکت شما برای بررسی کارشناسان، پرداخت مبلغ اولیه الزامی است. در صورت رد شدن پرونده توسط ادمین، کل مبلغ به کیف پول شما بازگردانده می‌شود.
        </p>

        <div className="prm-payment-details">
          <div className="prm-payment-row">
            <span>عنوان خدمت:</span>
            <span>بررسی مدارک و احراز هویت شرکتی</span>
          </div>
          <div className="prm-payment-row">
            <span>مبلغ قابل پرداخت:</span>
            <strong>{amountRials.toLocaleString("fa-IR")} ریال</strong>
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
            {isProcessing ? "در حال پردازش..." : "تایید و پرداخت"}
          </button>
        </div>
      </div>
    </div>
  );
}
