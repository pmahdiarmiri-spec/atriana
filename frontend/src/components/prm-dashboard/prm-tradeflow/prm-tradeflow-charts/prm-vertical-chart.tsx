"use client";

import { PrmChartBarItem, PrmMetricType } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { prmFormatExact, prmMetricLabel } from "@/lib/prm-tradeflow/prm-tradeflow-number";
import { usePrmChartTooltip } from "./prm-chart-tooltip";

interface PrmVerticalChartProps {
    title: string;
    data: PrmChartBarItem[];
    metric: PrmMetricType;
}

export function PrmVerticalChart({ title, data, metric }: PrmVerticalChartProps) {
    const tooltip = usePrmChartTooltip();
    const maximum = Math.max(0, ...data.map(item => Number(item.value) || 0));

    return (
        <section className="prm-tf-chart-card prm-liquid-glass">
            <div className="prm-tf-chart-header">
                <h2 className="prm-tf-chart-title">{title}</h2>
            </div>
            {data.length === 0 ? (
                <p className="prm-tf-chart-empty">داده‌ای برای فیلتر انتخاب‌شده وجود ندارد.</p>
            ) : (
                <div className="prm-tf-plot-scroll" dir="rtl">
                    <div className="prm-tf-vertical-plot">
                        {data.map((item, index) => {
                            const amount = Number(item.value) || 0;
                            const height = maximum > 0
                                ? Math.max(amount > 0 ? 2 : 0, (amount / maximum) * 100)
                                : 0;
                            const lines = [
                                ...(item.description ? [{ label: "شرح", value: item.description }] : []),
                                { label: prmMetricLabel(metric), value: prmFormatExact(item.value) },
                            ];

                            return (
                                <button
                                    type="button"
                                    className="prm-tf-vertical-item"
                                    key={`${item.label}-${index}`}
                                    onMouseEnter={event => tooltip.show(event, item.label, lines)}
                                    onMouseMove={event => tooltip.show(event, item.label, lines)}
                                    onMouseLeave={tooltip.hide}
                                    onFocus={event => tooltip.focus(event, item.label, lines)}
                                    onBlur={tooltip.hide}
                                    aria-label={`${item.label}: ${prmFormatExact(item.value)}؛ ${prmMetricLabel(metric)}`}
                                >
                                    <span className="prm-tf-vertical-value" dir="ltr">
                                        {prmFormatExact(item.value)}
                                    </span>
                                    <span className="prm-tf-vertical-track">
                                        <span
                                            className="prm-tf-vertical-fill"
                                            style={{ height: `${height}%` }}
                                        />
                                    </span>
                                    <span className="prm-tf-vertical-label">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            {tooltip.element}
        </section>
    );
}
