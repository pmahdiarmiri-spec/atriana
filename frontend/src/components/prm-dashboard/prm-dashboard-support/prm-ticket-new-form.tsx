"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PrmTicketCategory, PrmTicketPriority } from "@/types/prm-support";

interface PrmTicketNewFormProps {
  categories: PrmTicketCategory[];
  isLoadingCategories: boolean;
  isSubmitting: boolean;
  onSubmit: (payload: {
    categoryId: number;
    subject: string;
    message: string;
    priority: PrmTicketPriority;
  }) => Promise<boolean>;
  onCancel: () => void;
}

export function PrmTicketNewForm({
  categories,
  isLoadingCategories,
  isSubmitting,
  onSubmit,
  onCancel,
}: PrmTicketNewFormProps): ReactNode {
  const t = useTranslations("dashboard.support");

  const [prmCategoryId, setPrmCategoryId] = useState<number | "">("");
  const [prmSubject, setPrmSubject] = useState("");
  const [prmMessage, setPrmMessage] = useState("");
  const [prmPriority, setPrmPriority] = useState<PrmTicketPriority>("normal");
  const [prmError, setPrmError] = useState("");

  useEffect(() => {
    if (categories.length > 0 && prmCategoryId === "") {
      setPrmCategoryId(categories[0].id);
    }
  }, [categories, prmCategoryId]);

  const prmHandleSubmit = async (): Promise<void> => {
    setPrmError("");

    if (!prmCategoryId) {
      setPrmError(t("form.errors.category"));
      return;
    }

    if (prmSubject.trim().length < 3) {
      setPrmError(t("form.errors.subject"));
      return;
    }

    if (prmMessage.trim().length < 10) {
      setPrmError(t("form.errors.message"));
      return;
    }

    const prmSuccess = await onSubmit({
      categoryId: prmCategoryId,
      subject: prmSubject.trim(),
      message: prmMessage.trim(),
      priority: prmPriority,
    });

    if (prmSuccess) {
      setPrmCategoryId("");
      setPrmSubject("");
      setPrmMessage("");
      setPrmPriority("normal");
    }
  };

  return (
    <div className="prm-support-new-form">
      <div className="prm-support-form-header">
        <button type="button" className="prm-support-back-btn" onClick={onCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h2>{t("form.title")}</h2>
      </div>

      {prmError && <div className="prm-support-error">{prmError}</div>}

      <div className="prm-support-form-body">
        <div className="prm-support-field">
          <label htmlFor="prm-ticket-category">{t("form.category")}</label>
          <select
            id="prm-ticket-category"
            value={prmCategoryId}
            onChange={(event) => setPrmCategoryId(Number(event.target.value))}
            disabled={isLoadingCategories}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_fa}
              </option>
            ))}
          </select>
        </div>

        <div className="prm-support-field">
          <label htmlFor="prm-ticket-priority">{t("form.priority")}</label>
          <select
            id="prm-ticket-priority"
            value={prmPriority}
            onChange={(event) =>
              setPrmPriority(event.target.value as PrmTicketPriority)
            }
          >
            <option value="low">{t("priority.low")}</option>
            <option value="normal">{t("priority.normal")}</option>
            <option value="high">{t("priority.high")}</option>
            <option value="urgent">{t("priority.urgent")}</option>
          </select>
        </div>

        <div className="prm-support-field">
          <label htmlFor="prm-ticket-subject">{t("form.subject")}</label>
          <input
            id="prm-ticket-subject"
            type="text"
            maxLength={150}
            value={prmSubject}
            onChange={(event) => setPrmSubject(event.target.value)}
            placeholder={t("form.subjectPlaceholder")}
          />
        </div>

        <div className="prm-support-field">
          <label htmlFor="prm-ticket-message">{t("form.message")}</label>
          <textarea
            id="prm-ticket-message"
            rows={7}
            maxLength={5000}
            value={prmMessage}
            onChange={(event) => setPrmMessage(event.target.value)}
            placeholder={t("form.messagePlaceholder")}
          />
        </div>

        <button
          type="button"
          className="prm-support-btn-primary prm-support-submit-btn"
          onClick={prmHandleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </button>
      </div>
    </div>
  );
}
