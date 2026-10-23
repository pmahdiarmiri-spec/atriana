import { PrmAuthApiError } from "@/lib/prm-auth/prm-auth-api";

const prmApiBaseUrl =
  process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://localhost:8000/api";

interface PrmApiErrorResponse {
  status?: "error";
  code?: string;
}

export interface PrmTariffItem {
  id: number;
  code_raw: string;
  code_formatted: string;
  description: string;
  chapter: string | null;
  section: string | null;
}

export interface PrmTariffSearchResponse {
  status: "success";
  code: string;
  meta: {
    query: string;
    duration_ms: number;
    result_count: number;
  };
  items: PrmTariffItem[];
}

export interface PrmTariffSearchParams {
  q?: string;
  chapter?: string;
  section?: string;
  limit?: number;
}

async function prmTariffRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  let prmResponse: Response;

  try {
    prmResponse = await fetch(`${prmApiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new PrmAuthApiError("prm_tariff_request_failed");
  }

  const prmResponseData = (await prmResponse
    .json()
    .catch(() => null)) as T | PrmApiErrorResponse | null;

  if (!prmResponse.ok) {
    const prmErrorData = prmResponseData as PrmApiErrorResponse | null;

    throw new PrmAuthApiError(
      prmErrorData?.code ?? "prm_tariff_request_failed",
    );
  }

  return prmResponseData as T;
}

export function prmSearchTariffs(
  token: string,
  params: PrmTariffSearchParams,
  signal?: AbortSignal,
): Promise<PrmTariffSearchResponse> {
  const prmSearchParams = new URLSearchParams();

  if (params.q) {
    prmSearchParams.set("q", params.q);
  }
  if (params.chapter) {
    prmSearchParams.set("chapter", params.chapter);
  }
  if (params.section) {
    prmSearchParams.set("section", params.section);
  }
  if (params.limit) {
    prmSearchParams.set("limit", params.limit.toString());
  }

  const prmQueryString = prmSearchParams.toString();
  const prmPath = `/v1/tariffs/search${prmQueryString ? `?${prmQueryString}` : ""}`;

  return prmTariffRequest<PrmTariffSearchResponse>(prmPath, token, {
    method: "GET",
    signal,
  });
}
