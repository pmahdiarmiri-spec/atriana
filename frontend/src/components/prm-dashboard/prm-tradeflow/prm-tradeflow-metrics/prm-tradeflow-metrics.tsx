"use client";

import { PrmTradeFlowSummaryData } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { prmFormatExact } from "@/lib/prm-tradeflow/prm-tradeflow-number";

interface PrmTradeFlowMetricsProps {
    summary: PrmTradeFlowSummaryData | null;
}

export function PrmTradeFlowMetrics({ summary }: PrmTradeFlowMetricsProps) {
    const items = [
        { label: "ارزش دلاری", value: summary?.total_usd, unit: "دلار" },
        { label: "ارزش ریالی", value: summary?.total_rial, unit: "ریال" },
        { label: "وزن (کیلوگرم)", value: summary?.total_weight, unit: "کیلوگرم" },
        { label: "تعداد رکورد", value: summary?.total_records },
        { label: "تعداد کشور", value: summary?.unique_countries },
        { label: "تعداد تعرفه", value: summary?.unique_tariffs },
        { label: "تعداد استان", value: summary?.unique_provinces },
        { label: "تعداد گمرک", value: summary?.unique_customs },
    ];

    return (
        <div className="prm-tf-metrics-row">
            {items.map((item, index) => (
                <div className="prm-tf-stat-card prm-liquid-glass" key={item.label}>
                    <span className="prm-tf-stat-index">{String(index + 1).padStart(2, "0")}</span>
                    <div className="prm-tf-stat-body">
                        <span className="prm-tf-stat-lbl">{item.label}</span>
                        <span className="prm-tf-stat-val" dir="ltr">
                            {prmFormatExact(item.value)}
                        </span>
                        {item.unit && <span className="prm-tf-stat-unit">{item.unit}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}
