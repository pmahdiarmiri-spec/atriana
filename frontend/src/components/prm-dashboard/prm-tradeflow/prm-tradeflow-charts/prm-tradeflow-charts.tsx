"use client";

import { ReactNode } from "react";
import {
    PrmChartBarItem,
    PrmMetricType,
    PrmTradeFlowChartsData,
} from "@/lib/prm-tradeflow/prm-tradeflow-types";

interface PrmTradeFlowChartsProps {
    charts: PrmTradeFlowChartsData | null;
    metric: PrmMetricType;
}

export function PrmTradeFlowCharts({
    charts,
    metric,
}: PrmTradeFlowChartsProps): ReactNode {
    const getMetricUnit = (): string => {
        if (metric === "rial") return "ریال";
        if (metric === "weight") return "کیلوگرم";
        return "$";
    };

    const formatVal = (val: number): string => {
        if (val >= 1_000_000_000) {
            return `${(val / 1_000_000_000).toFixed(2)} B`;
        }
        if (val >= 1_000_000) {
            return `${(val / 1_000_000).toFixed(2)} M`;
        }
        return new Intl.NumberFormat("fa-IR").format(Math.round(val));
    };

    const renderBarList = (items: PrmChartBarItem[] = []) => {
        const maxValue = Math.max(...items.map((i) => i.value), 1);

        return (
            <div className="prm-tf-bars-list">
                {items.map((item, idx) => {
                    const percentage = Math.round((item.value / maxValue) * 100);
                    return (
                        <div key={idx} className="prm-tf-bar-item">
                            <div className="prm-tf-bar-meta">
                                <span className="prm-tf-bar-label" title={item.description || item.label}>
                                    {item.label}
                                </span>
                                <span className="prm-tf-bar-val">
                                    {formatVal(item.value)} {getMetricUnit()}
                                </span>
                            </div>
                            <div className="prm-tf-bar-track">
                                <div
                                    className="prm-tf-bar-fill"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const maxTimelineVal = Math.max(
        ...(charts?.timeline || []).map((t) => Number(t.metric_value)),
        1,
    );

    return (
        <div className="prm-tf-charts-grid">
            <div className="prm-tf-chart-card prm-liquid-glass" style={{ gridColumn: "1 / -1" }}>
                <div className="prm-tf-chart-header">
                    <span className="prm-tf-chart-title">
                        روند زمانی مبادلات ({getMetricUnit()})
                    </span>
                </div>
                <div className="prm-tf-timeline-wrapper">
                    {(charts?.timeline || []).map((t, idx) => {
                        const heightPct = Math.max(
                            Math.round((Number(t.metric_value) / maxTimelineVal) * 100),
                            4,
                        );
                        return (
                            <div key={idx} className="prm-tf-timeline-col">
                                <div
                                    className="prm-tf-timeline-bar"
                                    style={{ height: `${heightPct}%` }}
                                    title={`${t.year}/${t.month}: ${formatVal(Number(t.metric_value))}`}
                                />
                                <span className="prm-tf-timeline-lbl">
                                    {t.year}/{t.month}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="prm-tf-chart-card prm-liquid-glass">
                <div className="prm-tf-chart-header">
                    <span className="prm-tf-chart-title">۱۰ کشور برتر</span>
                </div>
                {renderBarList(charts?.top_countries)}
            </div>

            <div className="prm-tf-chart-card prm-liquid-glass">
                <div className="prm-tf-chart-header">
                    <span className="prm-tf-chart-title">۱۰ تعرفه و کالای تجاری برتر</span>
                </div>
                {renderBarList(charts?.top_tariffs)}
            </div>

            <div className="prm-tf-chart-card prm-liquid-glass">
                <div className="prm-tf-chart-header">
                    <span className="prm-tf-chart-title">۱۰ گمرک فعال</span>
                </div>
                {renderBarList(charts?.top_customs)}
            </div>

            <div className="prm-tf-chart-card prm-liquid-glass">
                <div className="prm-tf-chart-header">
                    <span className="prm-tf-chart-title">۱۰ استان پیشرو مبدا/مقصد</span>
                </div>
                {renderBarList(charts?.top_provinces)}
            </div>
        </div>
    );
}
