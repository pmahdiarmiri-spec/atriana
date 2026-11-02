import { PrmChartBarItem, PrmMetricType } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmDonutChart } from "./prm-donut-chart";

export function PrmRegionsChart({ data, metric }: {
    data: PrmChartBarItem[];
    metric: PrmMetricType;
}) {
    return <PrmDonutChart title="سهم مناطق" data={data} metric={metric} />;
}
