"use client";

import { PrmChartBarItem, PrmMetricType } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { prmFormatExact, prmMetricLabel } from "@/lib/prm-tradeflow/prm-tradeflow-number";
import { usePrmChartTooltip } from "./prm-chart-tooltip";

interface PrmDonutChartProps {
    title: string;
    data: PrmChartBarItem[];
    metric: PrmMetricType;
}

const PRM_COLORS = [
    "#0f172a", "#f59e0b", "#ea580c", "#2563eb",
    "#059669", "#7c3aed", "#db2777", "#0891b2",
    "#a16207", "#475569", "#65a30d", "#be123c",
];

export function PrmDonutChart({ title, data, metric }: PrmDonutChartProps) {
    const tooltip = usePrmChartTooltip();
    const total = data.reduce((sum, item) => sum + Math.max(0, Number(item.value) || 0), 0);
    let offset = 0;

    return (
        <section className="prm-tf-chart-card prm-liquid-glass">
            <div className="prm-tf-chart-header">
                <h2 className="prm-tf-chart-title">{title}</h2>
            </div>
            {data.length === 0 ? (
                <p className="prm-tf-chart-empty">داده‌ای برای فیلتر انتخاب‌شده وجود ندارد.</p>
            ) : (
                <div className="prm-tf-donut-layout">
                    <svg
                        className="prm-tf-donut"
                        viewBox="0 0 180 180"
                        role="img"
                        aria-label={title}
                    >
                        <circle
                            cx="90"
                            cy="90"
                            r="62"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="26"
                        />
                        {data.map((item, index) => {
                            const size = total > 0
                                ? (Math.max(0, Number(item.value) || 0) / total) * 100
                                : 0;
                            const start = offset;
                            offset += size;
                            const lines = [
                                { label: prmMetricLabel(metric), value: prmFormatExact(item.value) },
                            ];

                            return (
                                <circle
                                    key={`${item.label}-${index}`}
                                    cx="90"
                                    cy="90"
                                    r="62"
                                    fill="none"
                                    stroke={PRM_COLORS[index % PRM_COLORS.length]}
                                    strokeWidth="26"
                                    pathLength="100"
                                    strokeDasharray={`${size} ${100 - size}`}
                                    strokeDashoffset={-start}
                                    transform="rotate(-90 90 90)"
                                    className="prm-tf-donut-segment"
                                    tabIndex={size > 0 ? 0 : -1}
                                    aria-label={`${item.label}: ${prmFormatExact(item.value)}`}
                                    onMouseEnter={event => tooltip.show(event, item.label, lines)}
                                    onMouseMove={event => tooltip.show(event, item.label, lines)}
                                    onMouseLeave={tooltip.hide}
                                    onFocus={event => tooltip.focus(event, item.label, lines)}
                                    onBlur={tooltip.hide}
                                />
                            );
                        })}
                        <text x="90" y="88" textAnchor="middle" className="prm-tf-donut-center">
                            {title}
                        </text>
                        <text x="90" y="108" textAnchor="middle" className="prm-tf-donut-caption">
                            {data.length} مورد
                        </text>
                    </svg>
                    <div className="prm-tf-donut-legend">
                        {data.map((item, index) => (
                            <div className="prm-tf-donut-legend-row" key={`${item.label}-${index}`}>
                                <span
                                    className="prm-tf-donut-swatch"
                                    style={{ backgroundColor: PRM_COLORS[index % PRM_COLORS.length] }}
                                />
                                <span className="prm-tf-donut-name">{item.label}</span>
                                <b dir="ltr">{prmFormatExact(item.value)}</b>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {tooltip.element}
        </section>
    );
}
