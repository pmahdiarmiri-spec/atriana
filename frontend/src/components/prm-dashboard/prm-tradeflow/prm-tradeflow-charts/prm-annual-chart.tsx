"use client";

import { PrmAnnualItem } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { prmExactDifference, prmFormatExact } from "@/lib/prm-tradeflow/prm-tradeflow-number";
import { usePrmChartTooltip } from "./prm-chart-tooltip";

interface PrmAnnualChartProps {
    data: PrmAnnualItem[];
}

const PRM_SERIES = [
    { key: "usd", label: "ارزش دلاری", unit: "دلار", color: "prm-tf-annual-usd" },
    { key: "rial", label: "ارزش ریالی", unit: "ریال", color: "prm-tf-annual-rial" },
    { key: "weight", label: "وزن", unit: "کیلوگرم", color: "prm-tf-annual-weight" },
] as const;

export function PrmAnnualChart({ data }: PrmAnnualChartProps) {
    const tooltip = usePrmChartTooltip();
    const maximums = {
        usd: Math.max(0, ...data.map(item => Number(item.usd) || 0)),
        rial: Math.max(0, ...data.map(item => Number(item.rial) || 0)),
        weight: Math.max(0, ...data.map(item => Number(item.weight) || 0)),
    };

    return (
        <section className="prm-tf-chart-card prm-tf-chart-wide prm-liquid-glass">
            <div className="prm-tf-chart-header">
                <h2 className="prm-tf-chart-title">روند سالانه و تغییرات ریالی، دلاری و وزنی</h2>
            </div>
            <div className="prm-tf-annual-legend">
                {PRM_SERIES.map(series => (
                    <span className={`prm-tf-annual-key ${series.color}`} key={series.key}>
                        {series.label}
                    </span>
                ))}
            </div>
            <p className="prm-tf-chart-hint">
                ارتفاع هر رنگ نسبت به بیشینهٔ همان شاخص محاسبه می‌شود؛ اعداد و تغییرات سالانه در هاور کامل‌اند.
            </p>
            {data.length === 0 ? (
                <p className="prm-tf-chart-empty">داده‌ای برای فیلتر انتخاب‌شده وجود ندارد.</p>
            ) : (
                <div className="prm-tf-plot-scroll" dir="rtl">
                    <div className="prm-tf-annual-plot">
                        {data.map((item, index) => {
                            const previous = data[index - 1];

                            return (
                                <div className="prm-tf-annual-group" key={item.year}>
                                    <div className="prm-tf-annual-bars">
                                        {PRM_SERIES.map(series => {
                                            const amount = Number(item[series.key]) || 0;
                                            const maximum = maximums[series.key];
                                            const height = maximum > 0
                                                ? Math.max(amount > 0 ? 2 : 0, (amount / maximum) * 100)
                                                : 0;
                                            const lines = PRM_SERIES.flatMap(entry => [
                                                {
                                                    label: entry.label,
                                                    value: `${prmFormatExact(item[entry.key])} ${entry.unit}`,
                                                },
                                                {
                                                    label: `تغییر ${entry.label} نسبت به سال قبل`,
                                                    value: `${prmExactDifference(
                                                        item[entry.key],
                                                        previous?.[entry.key]
                                                    )} ${entry.unit}`,
                                                },
                                            ]);

                                            return (
                                                <button
                                                    type="button"
                                                    className={`prm-tf-annual-bar ${series.color}`}
                                                    key={series.key}
                                                    style={{ height: `${height}%` }}
                                                    onMouseEnter={event => tooltip.show(event, String(item.year), lines)}
                                                    onMouseMove={event => tooltip.show(event, String(item.year), lines)}
                                                    onMouseLeave={tooltip.hide}
                                                    onFocus={event => tooltip.focus(event, String(item.year), lines)}
                                                    onBlur={tooltip.hide}
                                                    aria-label={`${item.year}، ${series.label}: ${prmFormatExact(item[series.key])} ${series.unit}`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <strong className="prm-tf-annual-year">{item.year}</strong>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {tooltip.element}
        </section>
    );
}
