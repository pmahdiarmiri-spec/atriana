import { ReactNode } from "react";
import { PrmTradeFlowViewMode } from "@/lib/prm-tradeflow/prm-tradeflow-types";

interface PrmTradeFlowWorkspaceSelectorProps {
    currentMode: PrmTradeFlowViewMode;
    onChangeMode: (mode: PrmTradeFlowViewMode) => void;
}

export function PrmTradeFlowWorkspaceSelector({
    currentMode,
    onChangeMode,
}: PrmTradeFlowWorkspaceSelectorProps): ReactNode {
    return (
        <section className="prm-tf-workspace-selector-container">
            <div className="prm-tf-workspace-selector-header">
                <div className="prm-tf-workspace-badge">
                    <span className="prm-tf-workspace-badge-dot" />
                    <span>محیط تحلیل یکپارچه تجارت بین‌الملل</span>
                </div>
                <h2 className="prm-tf-workspace-title">انتخاب داشبورد داده‌کاوی</h2>
                <p className="prm-tf-workspace-subtitle">
                    دسترسی هم‌زمان به موتور تحلیل اختصاصی آتریانا و گزارش‌های تحلیلی Power BI با پلن فعال سازمانی
                </p>
            </div>

            <div className="prm-tf-workspace-grid">
                <button
                    type="button"
                    className={`prm-tf-workspace-card ${currentMode === "custom" ? "prm-active" : ""}`}
                    onClick={() => onChangeMode("custom")}
                >
                    <div className="prm-tf-workspace-card-glare" />
                    <div className="prm-tf-workspace-card-icon-box prm-primary">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                    </div>
                    <div className="prm-tf-workspace-card-content">
                        <div className="prm-tf-workspace-card-top">
                            <span className="prm-tf-workspace-card-tag">موتور اختصاصی</span>
                            {currentMode === "custom" && (
                                <span className="prm-tf-workspace-card-status">در حال مشاهده</span>
                            )}
                        </div>
                        <h3 className="prm-tf-workspace-card-title">داشبورد تخصصی آتریانا</h3>
                        <p className="prm-tf-workspace-card-desc">
                            کاوش ماتریسی، درختواره هوشمند کد HS، نمودارهای سری زمانی و خروجی داده‌های گمرکی با عملکرد بلادرنگ
                        </p>
                    </div>
                    <div className="prm-tf-workspace-card-action">
                        <span>ورود به تحلیل تخصصی</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </div>
                </button>

                <button
                    type="button"
                    className={`prm-tf-workspace-card ${currentMode === "pbi_import" ? "prm-active" : ""}`}
                    onClick={() => onChangeMode("pbi_import")}
                >
                    <div className="prm-tf-workspace-card-glare" />
                    <div className="prm-tf-workspace-card-icon-box prm-secondary">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 3v12" />
                            <path d="m8 11 4 4 4-4" />
                            <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
                        </svg>
                    </div>
                    <div className="prm-tf-workspace-card-content">
                        <div className="prm-tf-workspace-card-top">
                            <span className="prm-tf-workspace-card-tag">Power BI</span>
                            {currentMode === "pbi_import" && (
                                <span className="prm-tf-workspace-card-status">در حال مشاهده</span>
                            )}
                        </div>
                        <h3 className="prm-tf-workspace-card-title">داشبورد واردات ملی</h3>
                        <p className="prm-tf-workspace-card-desc">
                            گزارش‌های تحلیلی هوش تجاری مایکروسافت از واردات کلان، مقاصد استانی و جریان‌های ارزی مبادی تجاری
                        </p>
                    </div>
                    <div className="prm-tf-workspace-card-action">
                        <span>مشاهده گزارش واردات</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </div>
                </button>

                <button
                    type="button"
                    className={`prm-tf-workspace-card ${currentMode === "pbi_export" ? "prm-active" : ""}`}
                    onClick={() => onChangeMode("pbi_export")}
                >
                    <div className="prm-tf-workspace-card-glare" />
                    <div className="prm-tf-workspace-card-icon-box prm-accent">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15V3" />
                            <path d="m16 7-4-4-4 4" />
                            <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
                        </svg>
                    </div>
                    <div className="prm-tf-workspace-card-content">
                        <div className="prm-tf-workspace-card-top">
                            <span className="prm-tf-workspace-card-tag">Power BI</span>
                            {currentMode === "pbi_export" && (
                                <span className="prm-tf-workspace-card-status">در حال مشاهده</span>
                            )}
                        </div>
                        <h3 className="prm-tf-workspace-card-title">داشبورد صادرات غیرنفتی</h3>
                        <p className="prm-tf-workspace-card-desc">
                            تحلیل بازارهای هدف، پایگاه‌های تولیدی کشور، گمرکات خروجی و الگوهای تجارت خارجی به تفکیک فصول
                        </p>
                    </div>
                    <div className="prm-tf-workspace-card-action">
                        <span>مشاهده گزارش صادرات</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </div>
                </button>
            </div>
        </section>
    );
}
