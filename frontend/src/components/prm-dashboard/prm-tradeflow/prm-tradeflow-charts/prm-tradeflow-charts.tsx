"use client";

import { PrmMetricType, PrmTradeFlowChartsData } from "@/lib/prm-tradeflow/prm-tradeflow-types";
import { PrmAnnualChart } from "./prm-annual-chart";
import { PrmContinentsChart } from "./prm-continents-chart";
import { PrmTopCountriesChart } from "./prm-top-countries-chart";
import { PrmTopTariffsChart } from "./prm-top-tariffs-chart";
import { PrmTopCustomsChart } from "./prm-top-customs-chart";
import { PrmTopProvincesChart } from "./prm-top-provinces-chart";
import { PrmRegionsChart } from "./prm-regions-chart";
import { PrmUnionsChart } from "./prm-unions-chart";
import { PrmSeasonsChart } from "./prm-seasons-chart";

interface PrmTradeFlowChartsProps {
    charts: PrmTradeFlowChartsData | null;
    metric: PrmMetricType;
}

export function PrmTradeFlowCharts({ charts, metric }: PrmTradeFlowChartsProps) {
    if (!charts) return null;

    return (
        <div className="prm-tf-charts-grid">
            <PrmAnnualChart data={charts.annual} />
            <PrmContinentsChart data={charts.continents} metric={metric} />
            <PrmRegionsChart data={charts.regions} metric={metric} />
            <PrmTopCountriesChart data={charts.top_countries} metric={metric} />
            <PrmTopTariffsChart data={charts.top_tariffs} metric={metric} />
            <PrmTopCustomsChart data={charts.top_customs} metric={metric} />
            <PrmTopProvincesChart data={charts.top_provinces} metric={metric} />
            <PrmUnionsChart data={charts.unions} metric={metric} />
            <PrmSeasonsChart data={charts.seasons} metric={metric} />
        </div>
    );
}
