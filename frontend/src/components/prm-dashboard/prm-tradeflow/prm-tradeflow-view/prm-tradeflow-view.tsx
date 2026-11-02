"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import {
    prmDownloadTradeFlowCsv,
    prmGetTradeFlowCharts,
    prmGetTradeFlowFilterOptions,
    prmGetTradeFlowPlanStatus,
    prmGetTradeFlowSummary,
} from "@/lib/prm-tradeflow/prm-tradeflow-api";
import {
    PrmPlanStatusData,
    PrmTradeFlowChartsData,
    PrmTradeFlowFilterOptions,
    PrmTradeFlowFilterState,
    PrmTradeFlowSummaryData,
} from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmTradeFlowPlanBadge } from "../prm-tradeflow-plan-badge/prm-tradeflow-plan-badge";
import { PrmTradeFlowFilters } from "../prm-tradeflow-filters/prm-tradeflow-filters";
import { PrmTradeFlowMetrics } from "../prm-tradeflow-metrics/prm-tradeflow-metrics";
import { PrmTradeFlowCharts } from "../prm-tradeflow-charts/prm-tradeflow-charts";
import "@/styles/dashboard/prm-tradeflow.css";

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

export function PrmTradeFlowView({ token }: PrmTradeFlowViewProps): ReactNode {
    const dashboardRef = useRef<HTMLDivElement>(null);

    const [plan, setPlan] = useState<PrmPlanStatusData | null>(null);
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
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("prm_tradeflow_last_filters");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {}
            }
        }
        return PRM_DEFAULT_FILTERS;
    });

    const [summary, setSummary] = useState<PrmTradeFlowSummaryData | null>(null);
    const [charts, setCharts] = useState<PrmTradeFlowChartsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem("prm_tradeflow_last_filters", JSON.stringify(filters));
    }, [filters]);

    useEffect(() => {
        async function loadInitials() {
            try {
                const [planData, optsData] = await Promise.all([
                    prmGetTradeFlowPlanStatus(token),
                    prmGetTradeFlowFilterOptions(token),
                ]);
                setPlan(planData);
                setOptions(optsData);
            } catch {}
        }
        loadInitials();
    }, [token]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData();
        }, 350);

        return () => clearTimeout(handler);
    }, [filters, token]);

    async function fetchData() {
        setIsLoading(true);
        try {
            const [sumData, chartsData] = await Promise.all([
                prmGetTradeFlowSummary(filters, token),
                prmGetTradeFlowCharts(filters, token),
            ]);
            setSummary(sumData);
            setCharts(chartsData);
        } catch {
        } finally {
            setIsLoading(false);
        }
    }

    const handleFilterChange = (updated: Partial<PrmTradeFlowFilterState>) => {
        setFilters((prev) => ({ ...prev, ...updated }));
    };

    const handleReset = () => {
        setFilters(PRM_DEFAULT_FILTERS);
    };

    const handleExportCsv = async () => {
        setIsExporting(true);
        try {
            const blob = await prmDownloadTradeFlowCsv(filters, token);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `tradeflow-report-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch {
        } finally {
            setIsExporting(false);
        }
    };

    const handlePrintPdf = () => {
        window.print();
    };

    return (
        <div className="prm-tf-container" ref={dashboardRef}>
            <div className="prm-tf-header-card prm-liquid-glass">
                <div className="prm-tf-header-info">
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
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>خروجی اکسل / CSV</span>
                    </button>

                    <button
                        type="button"
                        className="prm-btn-glass"
                        onClick={handlePrintPdf}
                    >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span>خروجی PDF / پرینت</span>
                    </button>
                </div>
            </div>

            <PrmTradeFlowFilters
                filters={filters}
                options={options}
                onChange={handleFilterChange}
                onReset={handleReset}
            />

            <div style={{ position: "relative" }}>
                {isLoading && (
                    <div className="prm-tf-loading-overlay">
                        <div className="prm-tf-spinner" />
                    </div>
                )}

                <PrmTradeFlowMetrics summary={summary} />

                <div style={{ marginTop: "1.5rem" }}>
                    <PrmTradeFlowCharts charts={charts} metric={filters.metric} />
                </div>
            </div>
        </div>
    );
}
