"use client";

import { ReactNode } from "react";
import { PrmTradeFlowSummaryData } from "@/lib/prm-tradeflow/prm-tradeflow-types";

interface PrmTradeFlowMetricsProps {
    summary: PrmTradeFlowSummaryData | null;
}

export function PrmTradeFlowMetrics({
    summary,
}: PrmTradeFlowMetricsProps): ReactNode {
    const formatNumber = (num?: number): string => {
        if (num === undefined || num === null) return "۰";
        return new Intl.NumberFormat("fa-IR").format(Math.round(num));
    };

    const formatCurrencyUsd = (num?: number): string => {
        if (!num) return "$ ۰";
        if (num >= 1_000_000_000) {
            return `$ ${(num / 1_000_000_000).toFixed(2)} B`;
        }
        if (num >= 1_000_000) {
            return `$ ${(num / 1_000_000).toFixed(2)} M`;
        }
        return `$ ${formatNumber(num)}`;
    };

    return (
        <div className="prm-tf-metrics-row">
            <div className="prm-tf-stat-card prm-liquid-glass">
                <div className="prm-tf-stat-icon prm-tf-stat-icon-usd">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <div className="prm-tf-stat-body">
                    <span className="prm-tf-stat-val">{formatCurrencyUsd(summary?.total_usd)}</span>
                    <span className="prm-tf-stat-lbl">ارزش کل دلاری</span>
                </div>
            </div>

            <div className="prm-tf-stat-card prm-liquid-glass">
                <div className="prm-tf-stat-icon prm-tf-stat-icon-rial">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M6 12h.01M18 12h.01" />
                    </svg>
                </div>
                <div className="prm-tf-stat-body">
                    <span className="prm-tf-stat-val">{formatNumber(summary?.total_rial)} ریال</span>
                    <span className="prm-tf-stat-lbl">ارزش کل ریالی</span>
                </div>
            </div>

            <div className="prm-tf-stat-card prm-liquid-glass">
                <div className="prm-tf-stat-icon prm-tf-stat-icon-weight">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m21 16-4-4V4H7v8l-4 4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
                    </svg>
                </div>
                <div className="prm-tf-stat-body">
                    <span className="prm-tf-stat-val">{formatNumber(summary?.total_weight)} کیلوگرم</span>
                    <span className="prm-tf-stat-lbl">وزن ناخالص / خالص</span>
                </div>
            </div>

            <div className="prm-tf-stat-card prm-liquid-glass">
                <div className="prm-tf-stat-icon prm-tf-stat-icon-records">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>
                <div className="prm-tf-stat-body">
                    <span className="prm-tf-stat-val">{formatNumber(summary?.total_records)}</span>
                    <span className="prm-tf-stat-lbl">تعداد کل رکوردهای تجاری</span>
                </div>
            </div>
        </div>
    );
}
