export type PrmTradeType = "all" | "import" | "export";
export type PrmMetricType = "dolar" | "rial" | "weight";

export interface PrmFilterSelectOption {
    id: number | string;
    name: string;
}

export interface PrmTradeFlowFilterOptions {
    years: number[];
    months: { id: number; name: string }[];
    continents: PrmFilterSelectOption[];
    countries: PrmFilterSelectOption[];
    provinces: PrmFilterSelectOption[];
    customs: PrmFilterSelectOption[];
    regions: PrmFilterSelectOption[];
    unions: PrmFilterSelectOption[];
    sections: PrmFilterSelectOption[];
    seasons: string[];
}

export interface PrmTradeFlowFilterState {
    trade_type: PrmTradeType;
    year: string;
    month: string;
    continent_id: string;
    country_id: string;
    province_id: string;
    custom_id: string;
    tariff: string;
    region_id: string;
    united_id: string;
    section_id: string;
    season: string;
    metric: PrmMetricType;
}

export interface PrmTradeFlowSummaryData {
    total_records: number;
    total_usd: number;
    total_rial: number;
    total_weight: number;
    unique_tariffs: number;
    unique_countries: number;
    unique_customs: number;
}

export interface PrmChartBarItem {
    label: string;
    value: number;
    description?: string;
}

export interface PrmTimelineItem {
    year: number;
    month: number;
    metric_value: number;
}

export interface PrmTradeFlowChartsData {
    timeline: PrmTimelineItem[];
    top_countries: PrmChartBarItem[];
    top_tariffs: PrmChartBarItem[];
    top_provinces: PrmChartBarItem[];
    top_customs: PrmChartBarItem[];
    by_trade_type: PrmChartBarItem[];
}

export interface PrmPlanStatusData {
    is_active: boolean;
    plan_name: string;
    expires_at: string | null;
    is_mock: boolean;
    can_export: boolean;
    can_filter: boolean;
}
