"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PrmUser } from "@/types/prm-auth";
import { PrmSettingsProfile } from "./prm-settings-profile/prm-settings-profile";
import { PrmSettingsEmail } from "./prm-settings-email/prm-settings-email";
import { PrmSettingsPlans } from "./prm-settings-plans/prm-settings-plans";
import "@/styles/dashboard/prm-settings.css";

interface PrmDashboardSettingsProps {
    user: PrmUser | null;
    token: string;
    onUserUpdated: (user: any) => void;
}

export function PrmDashboardSettings({
    user,
    token,
    onUserUpdated,
}: PrmDashboardSettingsProps): React.ReactNode {
    const t = useTranslations("settings");
    const [activeTab, setActiveTab] = useState<"profile" | "email" | "plans">("profile");

    if (!user) {
        return null;
    }

    return (
        <div className="prm-settings-container">
            <div className="prm-settings-tabs-nav">
                <button
                    type="button"
                    className={`prm-settings-tab-btn ${activeTab === "profile" ? "prm-settings-tab-btn-active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    {t("tabs.profile")}
                </button>
                <button
                    type="button"
                    className={`prm-settings-tab-btn ${activeTab === "email" ? "prm-settings-tab-btn-active" : ""}`}
                    onClick={() => setActiveTab("email")}
                >
                    {t("tabs.email")}
                </button>
                <button
                    type="button"
                    className={`prm-settings-tab-btn ${activeTab === "plans" ? "prm-settings-tab-btn-active" : ""}`}
                    onClick={() => setActiveTab("plans")}
                >
                    {t("tabs.plans")}
                </button>
            </div>

            {activeTab === "profile" && (
                <PrmSettingsProfile user={user} token={token} onUserUpdated={onUserUpdated} />
            )}
            {activeTab === "email" && (
                <PrmSettingsEmail user={user} token={token} onUserUpdated={onUserUpdated} />
            )}
            {activeTab === "plans" && <PrmSettingsPlans token={token} />}
        </div>
    );
}
