"use client";

import { useEffect, useState } from "react";
import {
    prmDownloadTradeFlowCsv,
    prmGetPowerBiReports,
    prmGetTradeFlowCharts,
    prmGetTradeFlowFilterOptions,
    prmGetTradeFlowPlanStatus,
    prmGetTradeFlowSummary,
} from "@/lib/prm-tradeflow/prm-tradeflow-api";
import {
    PrmPlanStatusData,
    PrmPowerBiReportsData,
    PrmTradeFlowChartsData,
    PrmTradeFlowFilterOptions,
    PrmTradeFlowFilterState,
    PrmTradeFlowSummaryData,
    PrmTradeFlowViewMode,
} from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmTradeFlowPlanBadge } from "../prm-tradeflow-plan-badge/prm-tradeflow-plan-badge";
import { PrmTradeFlowFilters } from "../prm-tradeflow-filters/prm-tradeflow-filters";
import { PrmTradeFlowMetrics } from "../prm-tradeflow-metrics/prm-tradeflow-metrics";
import { PrmTradeFlowCharts } from "../prm-tradeflow-charts/prm-tradeflow-charts";
import { PrmTradeFlowTable } from "../prm-tradeflow-detail/prm-tradeflow-table";
import { PrmTariffTree } from "../prm-tradeflow-detail/prm-tariff-tree";
import { PrmTradeFlowHubLanding } from "../prm-tradeflow-workspace/prm-tradeflow-hub-landing";
import { PrmTradeFlowPowerBiViewer } from "../prm-tradeflow-powerbi/prm-tradeflow-powerbi-viewer";
import "@/styles/dashboard/prm-tradeflow.css";
import "@/styles/dashboard/prm-tradeflow-metrics.css";
import "@/styles/dashboard/prm-tradeflow-charts.css";
import "@/styles/dashboard/prm-tradeflow-detail.css";

const PRM_DEFAULT_FILTERS: PrmTradeFlowFilterState = {
    trade_type: "all",
    year: "",
    month: "",
    continent_id: "",
    country_id: "",
    province_id: "",
    custom_id: "",
    tariff: "",
    region_id: "",
    united_id: "",
    section_id: "",
    season: "",
    metric: "dolar",
};

interface PrmTradeFlowViewProps {
    token: string;
}

export function PrmTradeFlowView({ token }: PrmTradeFlowViewProps) {
    const [viewMode, setViewMode] = useState<PrmTradeFlowViewMode>("hub");
    const [plan, setPlan] = useState<PrmPlanStatusData | null>(null);
    const [pbiReports, setPbiReports] = useState<PrmPowerBiReportsData | null>(null);

    const [options, setOptions] = useState<PrmTradeFlowFilterOptions>({
        years: [],
        months: [],
        continents: [],
        countries: [],
        provinces: [],
        customs: [],
        regions: [],
        unions: [],
        sections: [],
        seasons: [],
    });

    const [filters, setFilters] = useState<PrmTradeFlowFilterState>(() => {
        if (typeof window === "undefined") return PRM_DEFAULT_FILTERS;
        try {
            const saved = localStorage.getItem("prm_tradeflow_last_filters");
            return saved ? { ...PRM_DEFAULT_FILTERS, ...JSON.parse(saved) } : PRM_DEFAULT_FILTERS;
        } catch {
            return PRM_DEFAULT_FILTERS;
        }
    });

    const [summary, setSummary] = useState<PrmTradeFlowSummaryData | null>(null);
    const [charts, setCharts] = useState<PrmTradeFlowChartsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        prmGetTradeFlowPlanStatus(token)
            .then(planData => {
                setPlan(planData);
            })
            .catch(() => {
                setError("دریافت وضعیت پلن کاربر ناموفق بود.");
            });
    }, [token]);

    useEffect(() => {
        if (viewMode === "pbi_import" || viewMode === "pbi_export") {
            if (!pbiReports) {
                prmGetPowerBiReports(token)
                    .then(reportsData => {
                        setPbiReports(reportsData);
                    })
                    .catch(() => {
                        setError("دریافت آدرس گزارش‌های Power BI ناموفق بود.");
                    });
            }
        }

        if (viewMode === "custom") {
            if (options.years.length === 0) {
                prmGetTradeFlowFilterOptions(token)
                    .then(optionsData => {
                        setOptions(optionsData);
                    })
                    .catch(() => {
                        setError("دریافت فیلترهای پایه ناموفق بود.");
                    });
            }
        }
    }, [viewMode, token, pbiReports, options.years.length]);

    useEffect(() => {
        if (viewMode !== "custom") return;

        let active = true;

        const timer = window.setTimeout(() => {
            setIsLoading(true);
            setError("");

            Promise.all([
                prmGetTradeFlowSummary(filters, token),
                prmGetTradeFlowCharts(filters, token),
            ])
                .then(([summaryData, chartsData]) => {
                    if (!active) return;
                    setSummary(summaryData);
                    setCharts(chartsData);
                })
                .catch(() => {
                    if (active) setError("دریافت آمار ناموفق بود؛ دوباره تلاش کنید.");
                })
                .finally(() => {
                    if (active) setIsLoading(false);
                });
        }, filters.tariff ? 450 : 200);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [filters, token, viewMode]);

    const handleFilterChange = (updated: Partial<PrmTradeFlowFilterState>) => {
        setFilters(previous => {
            const next = { ...previous, ...updated };
            localStorage.setItem("prm_tradeflow_last_filters", JSON.stringify(next));
            return next;
        });
    };

    const handleExportCsv = async () => {
        setIsExporting(true);
        setError("");

        try {
            const blob = await prmDownloadTradeFlowCsv(filters, token);
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");

            anchor.href = url;
            anchor.download = `tradeflow-report-${new Date().toISOString().slice(0, 10)}.csv`;

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch {
            setError("دریافت فایل CSV ناموفق بود.");
        } finally {
            setIsExporting(false);
        }
    };

    if (viewMode === "hub") {
        return (
            <div className="prm-tf-container">
                {error && <div className="prm-tf-error" role="alert">{error}</div>}
                <PrmTradeFlowHubLanding
                    plan={plan}
                    onSelectMode={selected => setViewMode(selected)}
                />
            </div>
        );
    }

    return (
        <div className="prm-tf-container">
            {error && <div className="prm-tf-error" role="alert">{error}</div>}

            {viewMode === "pbi_import" && (
                <PrmTradeFlowPowerBiViewer
                    title="داشبورد تحلیلی واردات ملی"
                    subtitle="گزارش تصویری پیشرفته مایکروسافت از ساختار اقلام، گمرکات ورودی و کشورهای مبدا"
                    embedUrl={pbiReports?.import || "https://app.powerbi.com/view?r=GAPGPTMASKTOKENivr6dxbkgahX0X%3D%3D"}
                    plan={plan}
                    badgeTone="secondary"
                    onBackToHub={() => setViewMode("hub")}
                />
            )}

            {viewMode === "pbi_export" && (
                <PrmTradeFlowPowerBiViewer
                    title="داشبورد تحلیلی صادرات ملی"
                    subtitle="گزارش تصویری پیشرفته مایکروسافت از مقاصد صادراتی، پایگاه‌های تولیدی و ترکیب کالایی"
                    embedUrl={pbiReports?.export || "https://app.powerbi.com/view?r=GAPGPTMASKTOKENivr6dxbkgahX1X%3D%3D"}
                    plan={plan}
                    badgeTone="accent"
                    onBackToHub={() => setViewMode("hub")}
                />
            )}

            {viewMode === "custom" && (
                <>
                    <header className="prm-tf-header-card prm-liquid-glass">
                        <div className="prm-tf-header-info">
                            <button
                                type="button"
                                className="prm-btn-glass prm-tf-back-hub-btn"
                                onClick={() => setViewMode("hub")}
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                                <span>تغییر داشبورد</span>
                            </button>
                            <div className="prm-tf-header-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="prm-tf-header-title">داشبورد جریان تجارت ملی (TradeFlow)</h1>
                                <p className="prm-tf-header-sub">تحلیل کلان آمار رسمی صادرات و واردات گمرک ج.ا.ایران</p>
                            </div>
                        </div>

                        <div className="prm-tf-actions">
                            <PrmTradeFlowPlanBadge plan={plan} />
                            <button
                                type="button"
                                className="prm-btn-glass"
                                onClick={handleExportCsv}
                                disabled={isExporting}
                            >
                                <span>خروجی اکسل / CSV</span>
                            </button>
                            <button
                                type="button"
                                className="prm-btn-glass"
                                onClick={() => window.print()}
                            >
                                <span>خروجی PDF / پرینت</span>
                            </button>
                        </div>

                        <div className="prm-tf-header-metrics">
                            <PrmTradeFlowMetrics summary={summary} />
                        </div>
                    </header>

                    <PrmTradeFlowFilters
                        filters={filters}
                        options={options}
                        onChange={handleFilterChange}
                        onReset={() => setFilters(PRM_DEFAULT_FILTERS)}
                    />

                    <div className="prm-tf-results">
                        {isLoading && (
                            <div className="prm-tf-loading-overlay" role="status" aria-label="در حال بارگذاری آمار">
                                <div className="prm-tf-spinner" />
                            </div>
                        )}
                        <PrmTradeFlowCharts charts={charts} metric={filters.metric} />
                        <PrmTariffTree
                            key={`tree-${JSON.stringify(filters)}`}
                            filters={filters}
                            token={token}
                        />
                        <PrmTradeFlowTable
                            key={`table-${JSON.stringify(filters)}`}
                            filters={filters}
                            token={token}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
