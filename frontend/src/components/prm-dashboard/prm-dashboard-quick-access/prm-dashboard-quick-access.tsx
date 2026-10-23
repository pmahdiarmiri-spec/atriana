"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface PrmQuickAccessItem {
    id: string;
    title: string;
    description: string;
    icon: ReactNode;
}

interface PrmDashboardQuickAccessProps {
    onItemClick: (id: string, title: string, description: string) => void;
}

export function PrmDashboardQuickAccess({
    onItemClick,
}: PrmDashboardQuickAccessProps): ReactNode {
    const t = useTranslations("dashboard");

    const prmItems: PrmQuickAccessItem[] = [
        {
            id: "ai",
            title: t("menu.ai"),
            description: t("menu.aiDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8.01" y2="16" />
                    <line x1="16" y1="16" x2="16.01" y2="16" />
                </svg>
            ),
        },
        {
            id: "hs-code",
            title: t("menu.hsCode"),
            description: t("menu.hsCodeDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
            ),
        },
        {
            id: "wallet",
            title: t("menu.wallet"),
            description: t("menu.walletDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
            ),
        },
        {
            id: "company",
            title: t("menu.company"),
            description: t("menu.companyDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
                </svg>
            ),
        },
        {
            id: "my-ads",
            title: t("menu.myAds"),
            description: t("menu.myAdsDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                </svg>
            ),
        },
        {
            id: "create-ad",
            title: t("menu.createAd"),
            description: t("menu.createAdDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            ),
        },
        {
            id: "meetings",
            title: t("menu.meetings"),
            description: t("menu.meetingsDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
                    <rect x="2" y="6" width="14" height="12" rx="2" />
                </svg>
            ),
        },
        {
            id: "export",
            title: t("menu.export"),
            description: t("menu.exportDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="m9 15 3-3 3 3" />
                </svg>
            ),
        },
        {
            id: "import",
            title: t("menu.import"),
            description: t("menu.importDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 12v6" />
                    <path d="m9 15 3 3 3-3" />
                </svg>
            ),
        },
        {
            id: "custom-dashboard",
            title: t("menu.customDashboard"),
            description: t("menu.customDashboardDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            ),
        },
        {
            id: "messages",
            title: t("menu.messages"),
            description: t("menu.messagesDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },
        {
            id: "support",
            title: t("menu.support"),
            description: t("menu.supportDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
            ),
        },
        {
            id: "settings",
            title: t("menu.settings"),
            description: t("menu.settingsDesc"),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
        },
    ];

    return (
        <section className="prm-dashboard-quick-section">
            <div className="prm-quick-header">
                <span className="prm-quick-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    {t("quickAccess.title")}
                </span>
            </div>

            <div className="prm-quick-grid">
                {prmItems.map((item) => (
                    <div
                        key={item.id}
                        className="prm-quick-card"
                        onClick={() => onItemClick(item.id, item.title, item.description)}
                    >
                        <div className="prm-quick-icon">{item.icon}</div>
                        <h3 className="prm-quick-card-title">{item.title}</h3>
                        <p className="prm-quick-card-desc">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
