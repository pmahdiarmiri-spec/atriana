import { ReactNode, useState } from "react";
import { PrmPlanStatusData } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmTradeFlowPlanBadge } from "../prm-tradeflow-plan-badge/prm-tradeflow-plan-badge";

interface PrmTradeFlowPowerBiViewerProps {
    title: string;
    subtitle: string;
    embedUrl: string;
    plan: PrmPlanStatusData | null;
    badgeTone: "secondary" | "accent";
    onBackToHub: () => void;
}

export function PrmTradeFlowPowerBiViewer({
    title,
    subtitle,
    embedUrl,
    plan,
    badgeTone,
    onBackToHub,
}: PrmTradeFlowPowerBiViewerProps): ReactNode {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const prmToggleFullscreen = (): void => {
        setIsFullscreen(prev => !prev);
    };

    const prmHandleReload = (): void => {
        setIsLoading(true);
        const iframe = document.getElementById("prm-pbi-frame") as HTMLIFrameElement | null;
        if (iframe) {
            iframe.src = embedUrl;
        }
    };

    return (
        <div className={`prm-tf-pbi-container ${isFullscreen ? "prm-pbi-fullscreen-active" : ""}`}>
            <header className="prm-tf-header-card prm-liquid-glass">
                <div className="prm-tf-header-info">
                    <button
                        type="button"
                        className="prm-btn-glass prm-tf-back-hub-btn"
                        onClick={onBackToHub}
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                        <span>تغییر داشبورد</span>
                    </button>
                    <div className={`prm-tf-header-icon prm-tone-${badgeTone}`}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div>
                        <div className="prm-tf-pbi-topline">
                            <span className="prm-tf-pbi-badge">گزارش هوش تجاری مایکروسافت</span>
                            <span className="prm-tf-pbi-status-dot" />
                            <span className="prm-tf-pbi-status-text">برخط</span>
                        </div>
                        <h1 className="prm-tf-header-title">{title}</h1>
                        <p className="prm-tf-header-sub">{subtitle}</p>
                    </div>
                </div>

                <div className="prm-tf-actions">
                    <PrmTradeFlowPlanBadge plan={plan} />
                    <button
                        type="button"
                        className="prm-btn-glass"
                        onClick={prmHandleReload}
                    >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 21h5v-5" />
                        </svg>
                        <span>بروزرسانی داده‌ها</span>
                    </button>
                    <button
                        type="button"
                        className="prm-btn-glass"
                        onClick={prmToggleFullscreen}
                    >
                        {isFullscreen ? (
                            <>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                                    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                                    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                                    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                                </svg>
                                <span>خروج از تمام‌صفحه</span>
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h6v6" />
                                    <path d="M9 21H3v-6" />
                                    <path d="M21 3l-7 7" />
                                    <path d="M3 21l7-7" />
                                </svg>
                                <span>حالت تمام‌صفحه</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div className="prm-tf-pbi-frame-wrapper prm-liquid-glass">
                {isLoading && (
                    <div className="prm-tf-pbi-loading-curtain">
                        <div className="prm-tf-spinner" />
                        <span className="prm-tf-pbi-loading-text">در حال بارگذاری گزارش Power BI...</span>
                    </div>
                )}
                <iframe
                    id="prm-pbi-frame"
                    title={title}
                    src={embedUrl}
                    className="prm-tf-pbi-iframe"
                    frameBorder="0"
                    allowFullScreen={true}
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}
