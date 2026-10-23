import { PrmAuthApiError } from "@/lib/prm-auth/prm-auth-api";
import { PrmTradeRole, PrmUser } from "@/types/prm-auth";
import { PrmSubscriptionOverviewResponse } from "@/types/prm-subscription";

const prmApiBaseUrl =
  process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://localhost:8000/api";

interface PrmApiErrorResponse {
  status?: "error";
  code?: string;
}

export type PrmUserProfileData = PrmUser;

async function prmSettingsRequest<T>(
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
  } catch {
    throw new PrmAuthApiError("prm_settings_request_failed");
  }

  const prmResponseData = (await prmResponse
    .json()
    .catch(() => null)) as T | PrmApiErrorResponse | null;

  if (!prmResponse.ok) {
    const prmErrorData = prmResponseData as PrmApiErrorResponse | null;

    throw new PrmAuthApiError(
      prmErrorData?.code ?? "prm_settings_request_failed",
    );
  }

  return prmResponseData as T;
}

export function prmUpdateProfile(
  token: string,
  payload: {
    firstName: string;
    lastName: string;
    tradeRole: PrmTradeRole;
    countryId: number;
    provinceId?: number | null;
    cityId?: number | null;
    customLocation?: string | null;
  },
): Promise<{ status: "success"; code: string; user: PrmUserProfileData }> {
  return prmSettingsRequest("/v1/settings/profile", token, {
    method: "PUT",
    body: JSON.stringify({
      first_name: payload.firstName,
      last_name: payload.lastName,
      trade_role: payload.tradeRole,
      country_id: payload.countryId,
      province_id: payload.provinceId ?? null,
      city_id: payload.cityId ?? null,
      custom_location: payload.customLocation ?? null,
    }),
  });
}

export function prmRequestEmailVerification(
  token: string,
  email: string,
): Promise<{ status: "success"; code: string; expires_in: number }> {
  return prmSettingsRequest("/v1/settings/email/verify/request", token, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function prmConfirmEmailVerification(
  token: string,
  email: string,
  code: string,
): Promise<{ status: "success"; code: string; user: PrmUserProfileData }> {
  return prmSettingsRequest("/v1/settings/email/verify/confirm", token, {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function prmGetUserSubscriptions(
  token: string,
): Promise<PrmSubscriptionOverviewResponse> {
  return prmSettingsRequest("/v1/settings/plans", token, {
    method: "GET",
  });
}
