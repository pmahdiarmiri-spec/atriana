import { PrmChartBarItem, PrmMetricType } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmDonutChart } from "./prm-donut-chart";

export function PrmContinentsChart({ data, metric }: {
    data: PrmChartBarItem[];
    metric: PrmMetricType;
}) {
    return <PrmDonutChart title="سهم قاره‌ها" data={data} metric={metric} />;
}
