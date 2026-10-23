"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PrmUserProfileData } from "@/lib/prm-settings/prm-settings-api";

export type PrmDashboardMenu =
  | "dashboard"
  | "tariffs"
  | "settings"
  | "support"
  | "company";

interface PrmDashboardSidebarProps {
  user: PrmUserProfileData | null;
  activeMenu: PrmDashboardMenu;
  onMenuSelect: (menu: PrmDashboardMenu) => void;
  onItemClick: (title: string, description: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function PrmDashboardSidebar({
  user,
  activeMenu,
  onMenuSelect,
  onItemClick,
  onLogout,
  isLoggingOut,
}: PrmDashboardSidebarProps): ReactNode {
  const t = useTranslations("dashboard");

  const prmValidLastName =
    user?.last_name && user.last_name !== user.mobile ? user.last_name : "";
  const prmFullName = [user?.first_name, prmValidLastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const prmDisplayName =
    prmFullName || user?.first_name || user?.mobile || user?.email || "...";

  return (
    <aside className="prm-dashboard-sidebar">
      <div className="prm-sidebar-brand">
        <div className="prm-sidebar-brand-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <div className="prm-sidebar-brand-text">
          <h2>{t("brand.name")}</h2>
          <span>{t("brand.tagline")}</span>
        </div>
      </div>

      <div className="prm-sidebar-user-box">
        <div className="prm-sidebar-user-info">
          <svg className="prm-sidebar-user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <strong>{prmDisplayName}</strong>
        </div>
        <span className="prm-sidebar-plan-tag">{t("user.planActive")}</span>
      </div>

      <nav className="prm-sidebar-nav">
        <button
          type="button"
          className={`prm-nav-item ${activeMenu === "dashboard" ? "prm-nav-item-active" : ""}`}
          onClick={() => onMenuSelect("dashboard")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span>{t("menu.dashboard")}</span>
        </button>

        <button
          type="button"
          className={`prm-nav-item ${activeMenu === "tariffs" ? "prm-nav-item-active" : ""}`}
          onClick={() => onMenuSelect("tariffs")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span>جستجوی کد تعرفه</span>
        </button>

        <span className="prm-nav-group-label">{t("menu.sections.ai")}</span>

        <button
          type="button"
          className="prm-nav-item"
          onClick={() => onItemClick(t("menu.ai"), t("menu.aiDesc"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8.01" y2="16" />
            <line x1="16" y1="16" x2="16.01" y2="16" />
          </svg>
          <span>{t("menu.ai")}</span>
        </button>

        <span className="prm-nav-group-label">{t("menu.sections.management")}</span>

        <button
          type="button"
          className="prm-nav-item"
          onClick={() => onItemClick(t("menu.wallet"), t("menu.walletDesc"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
          <span>{t("menu.wallet")}</span>
        </button>

        <button
          type="button"
          className={`prm-nav-item ${activeMenu === "company" ? "prm-nav-item-active" : ""}`}
          onClick={() => onMenuSelect("company")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
          </svg>
          <span>{t("menu.company")}</span>
        </button>

        <button
          type="button"
          className="prm-nav-item"
          onClick={() => onItemClick(t("menu.myAds"), t("menu.myAdsDesc"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span>{t("menu.myAds")}</span>
        </button>

        <button
          type="button"
          className="prm-nav-item"
          onClick={() => onItemClick(t("menu.createAd"), t("menu.createAdDesc"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>{t("menu.createAd")}</span>
        </button>

        <button
          type="button"
          className="prm-nav-item"
          onClick={() => onItemClick(t("menu.meetings"), t("menu.meetingsDesc"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
          </svg>
          <span>{t("menu.meetings")}</span>
        </button>

        <span className="prm-nav-group-label">{t("menu.sections.reports")}</span>

        <button
          type="button"
          className="prm-nav-item"
          onClick={() => onItemClick(t("menu.export"), t("menu.exportDesc"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="m9 15 3-3 3 3" />
          </svg>
          <span>{t("menu.export")}</span>
        </button>

        <button
          type="button"
          className="prm-nav-item"
          onClick={() => onItemClick(t("menu.messages"), t("menu.messagesDesc"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{t("menu.messages")}</span>
        </button>

        <button
          type="button"
          className={`prm-nav-item ${activeMenu === "support" ? "prm-nav-item-active" : ""}`}
          onClick={() => onMenuSelect("support")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span>{t("menu.support")}</span>
        </button>

        <span className="prm-nav-group-label">{t("menu.settings")}</span>

        <button
          type="button"
          className={`prm-nav-item ${activeMenu === "settings" ? "prm-nav-item-active" : ""}`}
          onClick={() => onMenuSelect("settings")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{t("menu.settings")}</span>
        </button>

        <button
          type="button"
          className="prm-nav-item prm-nav-item-logout"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>{isLoggingOut ? "..." : t("menu.logout")}</span>
        </button>
      </nav>
    </aside>
  );
}
