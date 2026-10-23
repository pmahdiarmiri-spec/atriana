"use client";

import { useTranslations } from "next-intl";

interface PrmDashboardStatsProps {
  onStatClick: (title: string, description: string) => void;
}

export function PrmDashboardStats({
  onStatClick,
}: PrmDashboardStatsProps): React.ReactNode {
  const t = useTranslations("dashboard");

  return (
    <section className="prm-dashboard-stats-grid">
      <div
        className="prm-stat-card"
        onClick={() =>
          onStatClick(
            t("stats.wallet.title"),
            t("stats.wallet.desc"),
          )
        }
      >
        <div className="prm-stat-icon prm-stat-icon-amber">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="prm-stat-value">
          <strong>{t("stats.wallet.value")}</strong>
          <span>{t("stats.wallet.unit")}</span>
        </div>

        <span className="prm-stat-label">
          {t("stats.wallet.label")}
        </span>
      </div>

      <div
        className="prm-stat-card"
        onClick={() =>
          onStatClick(
            t("stats.activeAds.title"),
            t("stats.activeAds.desc"),
          )
        }
      >
        <div className="prm-stat-icon prm-stat-icon-green">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="prm-stat-value">
          <strong>{t("stats.activeAds.value")}</strong>
          <span>{t("stats.activeAds.unit")}</span>
        </div>

        <span className="prm-stat-label">
          {t("stats.activeAds.label")}
        </span>
      </div>

      <div
        className="prm-stat-card"
        onClick={() =>
          onStatClick(
            t("stats.verification.title"),
            t("stats.verification.desc"),
          )
        }
      >
        <div className="prm-stat-icon prm-stat-icon-blue">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <div className="prm-stat-value">
          <strong className="prm-text-success">
            {t("status.verified")}
          </strong>
        </div>

        <span className="prm-stat-label">
          {t("stats.verification.label")}
        </span>
      </div>
    </section>
  );
}
