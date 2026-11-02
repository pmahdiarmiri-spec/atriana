import { PrmChartBarItem, PrmMetricType } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmVerticalChart } from "./prm-vertical-chart";

export function PrmUnionsChart({ data, metric }: {
    data: PrmChartBarItem[];
    metric: PrmMetricType;
}) {
    return <PrmVerticalChart title="آمار اتحادیه‌ها" data={data} metric={metric} />;
}
