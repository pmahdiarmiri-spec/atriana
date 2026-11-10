import { ReactNode } from "react";
import { PrmPlanStatusData, PrmTradeFlowViewMode } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmTradeFlowPlanBadge } from "../prm-tradeflow-plan-badge/prm-tradeflow-plan-badge";

interface PrmTradeFlowHubLandingProps {
    plan: PrmPlanStatusData | null;
    onSelectMode: (mode: Exclude<PrmTradeFlowViewMode, "hub">) => void;
}

export function PrmTradeFlowHubLanding({
    plan,
    onSelectMode,
}: PrmTradeFlowHubLandingProps): ReactNode {
    return (
        <div className="prm-tf-hub-wrapper">
            <header className="prm-tf-hub-header prm-liquid-glass">
                <div className="prm-tf-hub-header-top">
                    <div className="prm-tf-workspace-badge">
                        <span className="prm-tf-workspace-badge-dot" />
                        <span>سامانه جامع تحلیل بازرگانی خارجی آتریانا</span>
                    </div>
                    <PrmTradeFlowPlanBadge plan={plan} />
                </div>
                <h1 className="prm-tf-hub-hero-title">درگاه مانیتورینگ و جریان تجارت ملی</h1>
                <p className="prm-tf-hub-hero-subtitle">
                    لطفاً موتور تحلیلی مورد نظر خود را جهت کاوش هوشمند داده‌ها، رصد زنجیره تأمین و شاخص‌های آماری انتخاب نمایید.
                </p>
            </header>

            <div className="prm-tf-hub-grid">
                <div
                    role="button"
                    tabIndex={0}
                    className="prm-tf-hub-card prm-liquid-glass"
                    onClick={() => onSelectMode("custom")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelectMode("custom");
                        }
                    }}
                >
                    <div className="prm-tf-workspace-card-glare" />
                    <div className="prm-tf-hub-card-head">
                        <div className="prm-tf-workspace-card-icon-box prm-primary">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="7" height="9" x="3" y="3" rx="1" />
                                <rect width="7" height="5" x="14" y="3" rx="1" />
                                <rect width="7" height="9" x="14" y="12" rx="1" />
                                <rect width="7" height="5" x="3" y="16" rx="1" />
                            </svg>
                        </div>
                        <span className="prm-tf-workspace-card-tag">موتور بومی آتریانا</span>
                    </div>

                    <h2 className="prm-tf-hub-card-title">داشبورد تخصصی تحلیلی</h2>
                    <p className="prm-tf-hub-card-desc">
                        فیلترهای ماتریسی چندلایه‌ای، بررسی سلسله‌مراتبی درخت کدهای ۸ رقمی HS، نمودارهای متقاطع فصلی و ماهانه، و استخراج جدول کامل به فرمت اکسل.
                    </p>

                    <div className="prm-tf-hub-card-features">
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>تحلیل ترکیبی وزن، دلار و ریال</span>
                        </div>
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>کاوش سطحی درخت تعرفه گمرک</span>
                        </div>
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>خروجی استاندارد بدون محدودیت رکورد</span>
                        </div>
                    </div>

                    <div className="prm-tf-hub-card-action">
                        <span>ورود به محیط داشبورد تخصصی</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </div>
                </div>

                <div
                    role="button"
                    tabIndex={0}
                    className="prm-tf-hub-card prm-liquid-glass"
                    onClick={() => onSelectMode("pbi_import")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelectMode("pbi_import");
                        }
                    }}
                >
                    <div className="prm-tf-workspace-card-glare" />
                    <div className="prm-tf-hub-card-head">
                        <div className="prm-tf-workspace-card-icon-box prm-secondary">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3v12" />
                                <path d="m8 11 4 4 4-4" />
                                <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
                            </svg>
                        </div>
                        <span className="prm-tf-workspace-card-tag">Microsoft Power BI</span>
                    </div>

                    <h2 className="prm-tf-hub-card-title">تحلیل جامع واردات کشور</h2>
                    <p className="prm-tf-hub-card-desc">
                        داشبورد ویژوال و فوق‌پیشرفته جریان کالاهای ورودی، بررسی الگوهای ترخیص، سهم گمرکات زمینی، دریایی و هوایی، و ارزش اقلام مبدا.
                    </p>

                    <div className="prm-tf-hub-card-features">
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>نقشه تعاملی مبادی ترخیص کالا</span>
                        </div>
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>تحلیل حجم کالاهای اساسی و واسطه‌ای</span>
                        </div>
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>نمودارهای پویای هوش تجاری مایکروسافت</span>
                        </div>
                    </div>

                    <div className="prm-tf-hub-card-action">
                        <span>ورود به گزارش واردات Power BI</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </div>
                </div>

                <div
                    role="button"
                    tabIndex={0}
                    className="prm-tf-hub-card prm-liquid-glass"
                    onClick={() => onSelectMode("pbi_export")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelectMode("pbi_export");
                        }
                    }}
                >
                    <div className="prm-tf-workspace-card-glare" />
                    <div className="prm-tf-hub-card-head">
                        <div className="prm-tf-workspace-card-icon-box prm-accent">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 15V3" />
                                <path d="m16 7-4-4-4 4" />
                                <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
                            </svg>
                        </div>
                        <span className="prm-tf-workspace-card-tag">Microsoft Power BI</span>
                    </div>

                    <h2 className="prm-tf-hub-card-title">تحلیل جامع صادرات کشور</h2>
                    <p className="prm-tf-hub-card-desc">
                        تحلیل مقصد کالاها، مبادی استانی بارگیری، توزیع ارزآوری گروه‌های صنعتی و معدنی، و شناسایی بازارهای رقابتی صادرات کشور.
                    </p>

                    <div className="prm-tf-hub-card-features">
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>رتبه‌بندی بازارهای عمده هدف صادراتی</span>
                        </div>
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>سهم‌بندی استان‌های تولیدی و صادرکننده</span>
                        </div>
                        <div className="prm-tf-hub-feature-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>تحلیل روندهای فصلی تقاضای بین‌المللی</span>
                        </div>
                    </div>

                    <div className="prm-tf-hub-card-action">
                        <span>ورود به گزارش صادرات Power BI</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
