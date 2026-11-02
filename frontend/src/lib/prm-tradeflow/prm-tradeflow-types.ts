export type PrmTradeType = "all" | "import" | "export";
export type PrmMetricType = "dolar" | "rial" | "weight";
export type PrmExactValue = string | number;
export type PrmTableTab =
    | "tariffs"
    | "countries"
    | "customs"
    | "provinces"
    | "annual"
    | "monthly";
export type PrmTableSort =
    | "label"
    | "tariff_code"
    | "description"
    | "country"
    | "total_usd"
    | "total_rial"
    | "total_weight"
    | "record_count";
export type PrmSortDirection = "asc" | "desc";

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
    total_usd: PrmExactValue;
    total_rial: PrmExactValue;
    total_weight: PrmExactValue;
    unique_tariffs: number;
    unique_countries: number;
    unique_provinces: number;
    unique_customs: number;
}

export interface PrmChartBarItem {
    label: string;
    value: PrmExactValue;
    description?: string;
}

export interface PrmAnnualItem {
    year: number;
    usd: PrmExactValue;
    rial: PrmExactValue;
    weight: PrmExactValue;
}

export interface PrmTradeFlowChartsData {
    annual: PrmAnnualItem[];
    continents: PrmChartBarItem[];
    top_countries: PrmChartBarItem[];
    top_tariffs: PrmChartBarItem[];
    top_customs: PrmChartBarItem[];
    top_provinces: PrmChartBarItem[];
    regions: PrmChartBarItem[];
    unions: PrmChartBarItem[];
    seasons: PrmChartBarItem[];
}

export interface PrmTradeFlowTableRow {
    label: string;
    tariff_code: string | null;
    description: string | null;
    country: string | null;
    total_usd: PrmExactValue;
    total_rial: PrmExactValue;
    total_weight: PrmExactValue;
    record_count: number;
}

export interface PrmTradeFlowTableData {
    rows: PrmTradeFlowTableRow[];
    page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface PrmTariffTreeNode {
    code: string;
    value: PrmExactValue;
    record_count: number;
}

export interface PrmTariffTreeData {
    prefix: string;
    depth: number;
    nodes: PrmTariffTreeNode[];
}

export interface PrmPlanStatusData {
    is_active: boolean;
    plan_name: string;
    expires_at: string | null;
    is_mock: boolean;
    can_export: boolean;
    can_filter: boolean;
}
