import {
    PrmAuthenticatedResponse,
    PrmAuthChannel,
    PrmCity,
    PrmCountry,
    PrmProvince,
    PrmSendVerificationCodeResponse,
    PrmTradeRole,
    PrmUser,
    PrmVerificationPurpose,
    PrmVerifyCodeResponse,
} from "@/types/prm-auth";

const prmApiBaseUrl =
    process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://localhost:8000/api";

interface PrmApiErrorResponse {
    status?: "error";
    code?: string;
}

export class PrmAuthApiError extends Error {
    public readonly prmCode: string;

    public constructor(prmCode: string) {
        super(prmCode);
        this.name = "PrmAuthApiError";
        this.prmCode = prmCode;
    }
}

interface PrmIdentifyAuthResponse {
    status: "success";
    code?: string;
    next_step: "password" | "otp";
    identifier: string;
    channel?: PrmAuthChannel;
    is_existing_user: boolean;
    is_new_user?: boolean;
    purpose?: PrmVerificationPurpose;
    expires_in?: number;
}

async function prmApiRequest<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    let prmResponse: Response;

    try {
        prmResponse = await fetch(`${prmApiBaseUrl}${path}`, {
            ...options,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
    } catch {
        throw new PrmAuthApiError("prm_auth_request_failed");
    }

    const prmResponseData = (await prmResponse
        .json()
        .catch(() => null)) as T | PrmApiErrorResponse | null;

    if (!prmResponse.ok) {
        const prmErrorData = prmResponseData as PrmApiErrorResponse | null;

        throw new PrmAuthApiError(
            prmErrorData?.code ?? "prm_auth_request_failed",
        );
    }

    return prmResponseData as T;
}

export function prmGetCountries(): Promise<{ status: string; countries: PrmCountry[] }> {
    return prmApiRequest("/v1/locations/countries");
}

export function prmGetProvinces(countryId: number): Promise<{ status: string; provinces: PrmProvince[] }> {
    return prmApiRequest(`/v1/locations/countries/${countryId}/provinces`);
}

export function prmGetCities(provinceId: number): Promise<{ status: string; cities: PrmCity[] }> {
    return prmApiRequest(`/v1/locations/provinces/${provinceId}/cities`);
}

export function prmIdentifyAuth(
    identifier: string,
): Promise<PrmIdentifyAuthResponse> {
    return prmApiRequest<PrmIdentifyAuthResponse>("/v1/auth/identify", {
        method: "POST",
        body: JSON.stringify({
            identifier,
        }),
    });
}

export function prmSendVerificationCode(
    identifier: string,
    purpose: PrmVerificationPurpose,
): Promise<PrmSendVerificationCodeResponse> {
    return prmApiRequest<PrmSendVerificationCodeResponse>(
        "/v1/auth/verification-codes",
        {
            method: "POST",
            body: JSON.stringify({
                identifier,
                purpose,
            }),
        },
    );
}

export function prmVerifyCode(
    identifier: string,
    code: string,
    purpose: PrmVerificationPurpose,
): Promise<PrmVerifyCodeResponse> {
    return prmApiRequest<PrmVerifyCodeResponse>(
        "/v1/auth/verification-codes/verify",
        {
            method: "POST",
            body: JSON.stringify({
                identifier,
                code,
                purpose,
            }),
        },
    );
}

export function prmRegisterUser(payload: {
    identifier: string;
    channel: PrmAuthChannel;
    verificationToken: string;
    firstName: string;
    lastName: string;
    tradeRole: PrmTradeRole;
    countryId: number;
    provinceId?: number | null;
    cityId?: number | null;
    customLocation?: string | null;
    password: string;
    passwordConfirmation: string;
}): Promise<PrmAuthenticatedResponse> {
    return prmApiRequest<PrmAuthenticatedResponse>("/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
            identifier: payload.identifier,
            channel: payload.channel,
            verification_token: payload.verificationToken,
            first_name: payload.firstName,
            last_name: payload.lastName,
            trade_role: payload.tradeRole,
            country_id: payload.countryId,
            province_id: payload.provinceId ?? null,
            city_id: payload.cityId ?? null,
            custom_location: payload.customLocation ?? null,
            password: payload.password,
            password_confirmation: payload.passwordConfirmation,
        }),
    });
}

export function prmLoginWithPassword(
    identifier: string,
    password: string,
): Promise<PrmAuthenticatedResponse> {
    return prmApiRequest<PrmAuthenticatedResponse>("/v1/auth/login/password", {
        method: "POST",
        body: JSON.stringify({
            identifier,
            password,
        }),
    });
}

export function prmLoginWithOtp(
    identifier: string,
    verificationToken: string,
): Promise<PrmAuthenticatedResponse> {
    return prmApiRequest<PrmAuthenticatedResponse>("/v1/auth/login/otp", {
        method: "POST",
        body: JSON.stringify({
            identifier,
            verification_token: verificationToken,
        }),
    });
}

export function prmRequestPasswordResetCode(identifier: string): Promise<{
    status: "success";
    code?: string;
    identifier: string;
    channel: PrmAuthChannel;
    expires_in: number;
}> {
    return prmApiRequest("/v1/auth/password/reset/request", {
        method: "POST",
        body: JSON.stringify({
            identifier,
        }),
    });
}

export function prmResetPassword(
    identifier: string,
    verificationToken: string,
    password: string,
    passwordConfirmation: string,
): Promise<{
    status: "success";
    code?: string;
}> {
    return prmApiRequest("/v1/auth/password/reset", {
        method: "POST",
        body: JSON.stringify({
            identifier,
            verification_token: verificationToken,
            password,
            password_confirmation: passwordConfirmation,
        }),
    });
}

export function prmGetCurrentUser(token: string): Promise<{
    status: "success";
    code?: string;
    user: PrmUser;
}> {
    return prmApiRequest("/v1/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function prmLogout(token: string): Promise<{
    status: "success";
    code?: string;
}> {
    return prmApiRequest("/v1/auth/logout", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
