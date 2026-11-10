"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { PrmTradeFlowView } from "@/components/prm-dashboard/prm-tradeflow/prm-tradeflow-view/prm-tradeflow-view";
import { PrmUserProfileData } from "@/lib/prm-settings/prm-settings-api";
import { prmGetAuthSession } from "@/lib/prm-auth/prm-auth-storage";
import "@/styles/dashboard/prm-tradeflow-standalone.css";

export default function PrmTradeFlowRoute(): ReactNode {
    const router = useRouter();

    const [prmUser, setPrmUser] = useState<PrmUserProfileData | null>(null);
    const [prmToken, setPrmToken] = useState<string>("");
    const [prmIsLoading, setPrmIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const prmSession = prmGetAuthSession();

        if (!prmSession?.token || !prmSession.user) {
            router.replace("/auth");
            return;
        }

        setPrmToken(prmSession.token);
        setPrmUser(prmSession.user);
        setPrmIsLoading(false);
    }, [router]);

    const prmHandleBackToDashboard = (): void => {
        router.push("/dashboard");
    };

    if (prmIsLoading) {
        return null;
    }

    const prmValidLastName =
        prmUser?.last_name && prmUser.last_name !== prmUser.mobile
            ? prmUser.last_name
            : "";
    const prmDisplayName =
        [prmUser?.first_name, prmValidLastName].filter(Boolean).join(" ").trim() ||
        prmUser?.first_name ||
        prmUser?.mobile ||
        "...";

    return (
        <div className="prm-tf-standalone-wrapper">
            <header className="prm-tf-standalone-navbar">
                <button
                    type="button"
                    className="prm-tf-back-btn"
                    onClick={prmHandleBackToDashboard}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span>بازگشت به داشبورد</span>
                </button>

                <div className="prm-tf-standalone-actions">
                    <span className="prm-tf-user-badge">{prmDisplayName}</span>
                </div>
            </header>

            <main className="prm-tf-standalone-content">
                <PrmTradeFlowView token={prmToken} />
            </main>
        </div>
    );
}
