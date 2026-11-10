import {
    PrmPlanStatusData,
    PrmPowerBiReportsData,
    PrmSortDirection,
    PrmTableSort,
    PrmTableTab,
    PrmTariffTreeData,
    PrmTradeFlowChartsData,
    PrmTradeFlowFilterOptions,
    PrmTradeFlowFilterState,
    PrmTradeFlowSummaryData,
    PrmTradeFlowTableData,
} from "./prm-tradeflow-types";

function prmGetBaseUrl(): string {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return rawUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

async function prmFetchJson<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<T> {
    const baseUrl = prmGetBaseUrl();
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        throw new Error(`PRM API Error: ${response.status}`);
    }

    const json = await response.json();
    return json.data as T;
}

export async function prmGetTradeFlowPlanStatus(
    token: string
): Promise<PrmPlanStatusData> {
    return prmFetchJson<PrmPlanStatusData>("/api/v1/tradeflow/plan-status", token);
}

export async function prmGetPowerBiReports(
    token: string
): Promise<PrmPowerBiReportsData> {
    return prmFetchJson<PrmPowerBiReportsData>("/api/v1/tradeflow/powerbi-reports", token);
}

export async function prmGetTradeFlowFilterOptions(
    token: string
): Promise<PrmTradeFlowFilterOptions> {
    return prmFetchJson<PrmTradeFlowFilterOptions>("/api/v1/tradeflow/options", token);
}

export async function prmGetTradeFlowSummary(
    filters: PrmTradeFlowFilterState,
    token: string
): Promise<PrmTradeFlowSummaryData> {
    return prmFetchJson<PrmTradeFlowSummaryData>("/api/v1/tradeflow/summary", token, {
        method: "POST",
        body: JSON.stringify(filters),
    });
}

export async function prmGetTradeFlowCharts(
    filters: PrmTradeFlowFilterState,
    token: string
): Promise<PrmTradeFlowChartsData> {
    return prmFetchJson<PrmTradeFlowChartsData>("/api/v1/tradeflow/charts", token, {
        method: "POST",
        body: JSON.stringify(filters),
    });
}

export async function prmGetTradeFlowTable(
    filters: PrmTradeFlowFilterState,
    token: string,
    tab: PrmTableTab,
    page: number,
    sortBy: PrmTableSort | null,
    sortDir: PrmSortDirection
): Promise<PrmTradeFlowTableData> {
    return prmFetchJson<PrmTradeFlowTableData>("/api/v1/tradeflow/table", token, {
        method: "POST",
        body: JSON.stringify({
            ...filters,
            tab,
            page,
            ...(sortBy ? { sort_by: sortBy, sort_dir: sortDir } : {}),
        }),
    });
}

export async function prmGetTariffTree(
    filters: PrmTradeFlowFilterState,
    token: string,
    prefix: string
): Promise<PrmTariffTreeData> {
    return prmFetchJson<PrmTariffTreeData>("/api/v1/tradeflow/tariff-tree", token, {
        method: "POST",
        body: JSON.stringify({
            ...filters,
            ...(prefix ? { prefix } : {}),
        }),
    });
}

export async function prmDownloadTradeFlowCsv(
    filters: PrmTradeFlowFilterState,
    token: string
): Promise<Blob> {
    const baseUrl = prmGetBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/tradeflow/export/csv`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
    });

    if (!response.ok) {
        throw new Error(`PRM Export Error: ${response.status}`);
    }

    return response.blob();
}
