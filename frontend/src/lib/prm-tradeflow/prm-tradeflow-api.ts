import { api } from "@/lib/api";
import {
    PrmPlanStatusData,
    PrmTradeFlowChartsData,
    PrmTradeFlowFilterOptions,
    PrmTradeFlowFilterState,
    PrmTradeFlowSummaryData,
} from "./prm-tradeflow-types";

function prmCleanFilters(filters: PrmTradeFlowFilterState): Record<string, any> {
    const payload: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            payload[key] = value;
        }
    });

    return payload;
}

export async function prmGetTradeFlowPlanStatus(token: string): Promise<PrmPlanStatusData> {
    const response = await api.get("/v1/tradeflow/plan-status", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
}

export async function prmGetTradeFlowFilterOptions(token: string): Promise<PrmTradeFlowFilterOptions> {
    const response = await api.get("/v1/tradeflow/options", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
}

export async function prmGetTradeFlowSummary(
    filters: PrmTradeFlowFilterState,
    token: string,
): Promise<PrmTradeFlowSummaryData> {
    const response = await api.post(
        "/v1/tradeflow/summary",
        prmCleanFilters(filters),
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return response.data.data;
}

export async function prmGetTradeFlowCharts(
    filters: PrmTradeFlowFilterState,
    token: string,
): Promise<PrmTradeFlowChartsData> {
    const response = await api.post(
        "/v1/tradeflow/charts",
        prmCleanFilters(filters),
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return response.data.data;
}

export async function prmDownloadTradeFlowCsv(
    filters: PrmTradeFlowFilterState,
    token: string,
): Promise<Blob> {
    const response = await api.post(
        "/v1/tradeflow/export/csv",
        prmCleanFilters(filters),
        {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
        },
    );
    return response.data;
}
