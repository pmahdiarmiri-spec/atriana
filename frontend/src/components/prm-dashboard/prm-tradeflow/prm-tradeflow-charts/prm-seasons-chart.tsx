import { PrmChartBarItem, PrmMetricType } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmVerticalChart } from "./prm-vertical-chart";

export function PrmSeasonsChart({ data, metric }: {
    data: PrmChartBarItem[];
    metric: PrmMetricType;
}) {
    return <PrmVerticalChart title="آمار فصول سال" data={data} metric={metric} />;
}
