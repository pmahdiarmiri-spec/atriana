"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { prmGetUserSubscriptions } from "@/lib/prm-settings/prm-settings-api";
import { PrmSubscription } from "@/types/prm-subscription";

interface PrmSettingsPlansProps {
    token: string;
}

export function PrmSettingsPlans({ token }: PrmSettingsPlansProps): React.ReactNode {
    const t = useTranslations("settings.plans");
    const locale = useLocale();
    const [activeSub, setActiveSub] = useState<PrmSubscription | null>(null);
    const [history, setHistory] = useState<PrmSubscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlans(): Promise<void> {
            try {
                const res = await prmGetUserSubscriptions(token);
                setActiveSub(res.active_subscription);
                setHistory(res.history_subscriptions);
            } catch {
                setActiveSub(null);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        }
        void fetchPlans();
    }, [token]);

    const formatDate = (dateStr: string | null): string => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US");
    };

    if (loading) {
        return <div className="prm-settings-card">{t("loading")}</div>;
    }

    return (
        <div className="prm-settings-container">
            <div className="prm-settings-card">
                <div className="prm-settings-card-header">
                    <h3 className="prm-settings-card-title">{t("activeTitle")}</h3>
                    <p className="prm-settings-card-subtitle">{t("activeSubtitle")}</p>
                </div>

                {activeSub ? (
                    <div className="prm-plan-item-card prm-plan-item-active-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>
                                    {locale === "fa" ? activeSub.plan.name_fa : activeSub.plan.name_en}
                                </h4>
                                <span style={{ fontSize: "0.85rem", color: "var(--prm-text-light)" }}>
                                    {locale === "fa" ? activeSub.plan.name_en : activeSub.plan.name_fa}
                                </span>
                            </div>
                            <span className="prm-plan-badge prm-plan-badge-active">{t("statusActive")}</span>
                        </div>

                        <div style={{ fontSize: "0.875rem", color: "var(--prm-text-dark)", lineHeight: 1.8 }}>
                            <div>{t("startDate")}: {formatDate(activeSub.starts_at)}</div>
                            <div>{t("endDate")}: {activeSub.ends_at ? formatDate(activeSub.ends_at) : t("unlimited")}</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: "1rem", textAlign: "center", color: "var(--prm-text-light)" }}>
                        {t("noActive")}
                    </div>
                )}
            </div>

            <div className="prm-settings-card">
                <div className="prm-settings-card-header">
                    <h3 className="prm-settings-card-title">{t("historyTitle")}</h3>
                    <p className="prm-settings-card-subtitle">{t("historySubtitle")}</p>
                </div>

                {history.length > 0 ? (
                    <div className="prm-table-wrapper">
                        <table className="prm-settings-table">
                            <thead>
                                <tr>
                                    <th>{t("colPlan")}</th>
                                    <th>{t("colStart")}</th>
                                    <th>{t("colEnd")}</th>
                                    <th>{t("colStatus")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h) => (
                                    <tr key={h.id}>
                                        <td>{locale === "fa" ? h.plan.name_fa : h.plan.name_en}</td>
                                        <td>{formatDate(h.starts_at)}</td>
                                        <td>{formatDate(h.ends_at)}</td>
                                        <td>
                                            <span className="prm-plan-badge prm-plan-badge-expired">
                                                {t("statusExpired")}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: "1rem", textAlign: "center", color: "var(--prm-text-light)" }}>
                        {t("noHistory")}
                    </div>
                )}
            </div>
        </div>
    );
}
