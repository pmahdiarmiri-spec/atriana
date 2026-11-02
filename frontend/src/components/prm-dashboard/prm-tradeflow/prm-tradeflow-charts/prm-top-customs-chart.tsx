import { PrmChartBarItem, PrmMetricType } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmVerticalChart } from "./prm-vertical-chart";

export function PrmTopCustomsChart({ data, metric }: {
    data: PrmChartBarItem[];
    metric: PrmMetricType;
}) {
    return <PrmVerticalChart title="۱۰ گمرک برتر" data={data} metric={metric} />;
}
