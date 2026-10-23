"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { PrmDashboardSidebar, PrmDashboardMenu } from "../prm-dashboard-sidebar/prm-dashboard-sidebar";
import { PrmDashboardHeader } from "../prm-dashboard-header/prm-dashboard-header";
import { PrmDashboardStats } from "../prm-dashboard-stats/prm-dashboard-stats";
import { PrmDashboardQuickAccess } from "../prm-dashboard-quick-access/prm-dashboard-quick-access";
import { PrmDashboardBottomNav } from "../prm-dashboard-bottom-nav/prm-dashboard-bottom-nav";
import { PrmDashboardComingSoonModal } from "../prm-dashboard-coming-soon-modal/prm-dashboard-coming-soon-modal";
import { PrmDashboardSettings } from "../prm-dashboard-settings/prm-dashboard-settings";
import { PrmDashboardSupport } from "../prm-dashboard-support/prm-dashboard-support";
import { PrmTariffSearchView } from "@/components/prm-dashboard/prm-tariff-search/prm-tariff-search-view/prm-tariff-search-view";
import { PrmUserProfileData } from "@/lib/prm-settings/prm-settings-api";
import {
    prmClearAuthSession,
    prmGetAuthSession,
} from "@/lib/prm-auth/prm-auth-storage";
import { prmLogout } from "@/lib/prm-auth/prm-auth-api";
import "@/styles/dashboard/prm-dashboard.css";

export function PrmDashboardPage(): ReactNode {
    const router = useRouter();

    const [prmUser, setPrmUser] = useState<PrmUserProfileData | null>(null);
    const [prmToken, setPrmToken] = useState<string>("");
    const [prmActiveMenu, setPrmActiveMenu] =
        useState<PrmDashboardMenu>("dashboard");
    const [prmIsLoading, setPrmIsLoading] = useState<boolean>(true);
    const [prmLoggingOut, setPrmLoggingOut] = useState<boolean>(false);

    const [prmModalState, setPrmModalState] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
    }>({
        isOpen: false,
        title: "",
        description: "",
    });

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

    const prmHandleOpenModal = (
        title: string,
        description: string,
    ): void => {
        setPrmModalState({
            isOpen: true,
            title,
            description,
        });
    };

    const prmHandleCloseModal = (): void => {
        setPrmModalState((previousState) => ({
            ...previousState,
            isOpen: false,
        }));
    };

    const prmHandleQuickAccessClick = (
        id: string,
        title: string,
        description: string,
    ): void => {
        if (id === "settings") {
            setPrmActiveMenu("settings");
            return;
        }

        if (id === "hs-code" || id === "tariffs" || id === "tariff-search") {
            setPrmActiveMenu("tariffs");
            return;
        }

        prmHandleOpenModal(title, description);
    };

    const prmHandleStatClick = (
        title: string,
        description: string,
    ): void => {
        prmHandleOpenModal(title, description);
    };

    const prmHandleUserUpdated = (
        updatedUser: PrmUserProfileData,
    ): void => {
        setPrmUser(updatedUser);

        const prmSession = prmGetAuthSession();

        if (prmSession) {
            sessionStorage.setItem(
                "prm-atriana-auth-session",
                JSON.stringify({
                    ...prmSession,
                    user: updatedUser,
                }),
            );
        }
    };

    const prmHandleLogout = async (): Promise<void> => {
        setPrmLoggingOut(true);

        try {
            if (prmToken) {
                await prmLogout(prmToken);
            }
        } catch {
        } finally {
            prmClearAuthSession();
            router.replace("/auth");
        }
    };

    if (prmIsLoading) {
        return null;
    }

    return (
        <div className="prm-dashboard-layout">
            <PrmDashboardSidebar
                user={prmUser}
                activeMenu={prmActiveMenu}
                onMenuSelect={setPrmActiveMenu}
                onItemClick={prmHandleOpenModal}
                onLogout={prmHandleLogout}
                isLoggingOut={prmLoggingOut}
            />

            <main className="prm-dashboard-main">
                <PrmDashboardHeader user={prmUser} />

                {prmActiveMenu === "dashboard" && (
                    <div className="prm-dashboard-main-view">
                        <PrmDashboardStats
                            onStatClick={prmHandleStatClick}
                        />

                        <PrmDashboardQuickAccess
                            onItemClick={prmHandleQuickAccessClick}
                        />
                    </div>
                )}

                {prmActiveMenu === "tariffs" && (
                    <PrmTariffSearchView token={prmToken} />
                )}

                {prmActiveMenu === "settings" && (
                    <PrmDashboardSettings
                        user={prmUser}
                        token={prmToken}
                        onUserUpdated={prmHandleUserUpdated}
                    />
                )}

                {prmActiveMenu === "support" && (
                    <PrmDashboardSupport token={prmToken} />
                )}
            </main>

            <PrmDashboardBottomNav
                activeMenu={prmActiveMenu as any}
                onMenuSelect={setPrmActiveMenu as any}
                onItemClick={prmHandleOpenModal}
            />

            <PrmDashboardComingSoonModal
                isOpen={prmModalState.isOpen}
                title={prmModalState.title}
                description={prmModalState.description}
                onClose={prmHandleCloseModal}
            />
        </div>
    );
}
