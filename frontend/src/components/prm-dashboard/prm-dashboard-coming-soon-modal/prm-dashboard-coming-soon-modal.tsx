"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface PrmDashboardComingSoonModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onClose: () => void;
}

export function PrmDashboardComingSoonModal({
    isOpen,
    title,
    description,
    onClose,
}: PrmDashboardComingSoonModalProps): ReactNode {
    const t = useTranslations("dashboard");

    if (!isOpen) {
        return null;
    }

    return (
        <div className="prm-modal-backdrop" onClick={onClose}>
            <div
                className="prm-modal-card"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="prm-modal-glow" />
                <div className="prm-modal-badge">{t("status.comingSoonBadge")}</div>
                <h3 className="prm-modal-title">{title}</h3>
                <p className="prm-modal-description">{description}</p>
                <div className="prm-modal-actions">
                    <button
                        type="button"
                        className="prm-btn-primary"
                        onClick={onClose}
                    >
                        {t("status.understand")}
                    </button>
                </div>
            </div>
        </div>
    );
}
