import {
    PrmAdminAuthResponse,
    PrmAdminOtpChallengeResponse,
    PrmAdminUser,
    PrmAuditLog,
    PrmGateSlugMetadataResponse,
    PrmPaginatedResponse,
} from "@/types/prm-admin";
import { PrmTicket, PrmTicketMessage, PrmTicketStatus } from "@/types/prm-support";

const prmApiBaseUrl =
    process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://localhost:8000/api";

type PrmApiErrorResponse = {
    code?: string;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
};

export class PrmAdminApiError extends Error {
    public readonly prmCode: string;
    public readonly prmStatusCode: number;
    public readonly prmDetails?: PrmApiErrorResponse | null;

    public constructor(
        prmCode: string,
        prmStatusCode: number = 0,
        prmDetails?: PrmApiErrorResponse | null,
    ) {
        super(prmCode);
        this.name = "PrmAdminApiError";
        this.prmCode = prmCode;
        this.prmStatusCode = prmStatusCode;
        this.prmDetails = prmDetails;
    }
}

async function prmAdminRequest<T>(
    path: string,
    options: RequestInit = {},
    token?: string,
): Promise<T> {
    const headers = new Headers(options.headers);

    headers.set("Accept", "application/json");

    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    let response: Response;

    try {
        response = await fetch(`${prmApiBaseUrl}${path}`, {
            ...options,
            headers,
        });
    } catch {
        throw new PrmAdminApiError("prm_admin_network_error");
    }

    const data = (await response.json().catch(() => null)) as
        | PrmApiErrorResponse
        | null;

    if (!response.ok) {
        const errorCode =
            data?.code ??
            data?.error ??
            data?.message ??
            `prm_admin_http_${response.status}`;

        throw new PrmAdminApiError(
            errorCode,
            response.status,
            data,
        );
    }

    return data as T;
}

export function prmAdminGateLogin(
    gateSlug: string,
    identifier: string,
    password: string,
): Promise<PrmAdminOtpChallengeResponse> {
    return prmAdminRequest<PrmAdminOtpChallengeResponse>(
        `/v1/prm-gate/${encodeURIComponent(gateSlug)}/login`,
        {
            method: "POST",
            body: JSON.stringify({ identifier, password }),
        },
    );
}

export function prmAdminGateVerifyOtp(
    gateSlug: string,
    challengeToken: string,
    otpCode: string,
): Promise<PrmAdminAuthResponse> {
    return prmAdminRequest<PrmAdminAuthResponse>(
        `/v1/prm-gate/${encodeURIComponent(gateSlug)}/verify-otp`,
        {
            method: "POST",
            body: JSON.stringify({
                challenge_token: challengeToken,
                otp_code: otpCode,
            }),
        },
    );
}

export function prmGetAdminProfile(token: string): Promise<{
    status: "success";
    code: string;
    admin: PrmAdminUser;
}> {
    return prmAdminRequest(
        "/v1/admin/me",
        {
            method: "GET",
        },
        token,
    );
}

export function prmGetGateSlug(token: string): Promise<PrmGateSlugMetadataResponse & { gate_slug: string }> {
    return prmAdminRequest(
        "/v1/admin/gate/slug",
        {
            method: "GET",
        },
        token,
    );
}

export function prmRegenerateGateSlug(token: string): Promise<PrmGateSlugMetadataResponse & { new_gate_slug: string }> {
    return prmAdminRequest(
        "/v1/admin/gate/regenerate",
        {
            method: "POST",
        },
        token,
    );
}

export function prmCreateAdmin(
    token: string,
    payload: {
        first_name: string;
        last_name: string;
        email: string;
        mobile: string;
        password: string;
        permissions?: string[];
    },
): Promise<{
    status: "success";
    code: string;
    admin: PrmAdminUser;
}> {
    return prmAdminRequest(
        "/v1/admin/admins",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        token,
    );
}

export function prmGetFilteredUsers(
    token: string,
    params: Record<string, string | number | boolean | undefined>,
): Promise<PrmPaginatedResponse<PrmAdminUser>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();

    return prmAdminRequest(
        `/v1/admin/users${queryString ? `?${queryString}` : ""}`,
        {
            method: "GET",
        },
        token,
    );
}

export function prmGetPayments(
    token: string,
    params: Record<string, string | number | undefined>,
): Promise<PrmPaginatedResponse<unknown>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();

    return prmAdminRequest(
        `/v1/admin/payments${queryString ? `?${queryString}` : ""}`,
        {
            method: "GET",
        },
        token,
    );
}

export function prmGetAuditLogs(
    token: string,
    page: number = 1,
): Promise<PrmPaginatedResponse<PrmAuditLog>> {
    return prmAdminRequest(
        `/v1/admin/audit-logs?page=${page}`,
        {
            method: "GET",
        },
        token,
    );
}

export function prmAdminGetTickets(
    token: string,
    params?: {
        status?: string;
        priority?: string;
        search?: string;
    },
): Promise<{ status: "success"; tickets: PrmTicket[] }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    return prmAdminRequest(
        `/v1/admin/tickets${queryString ? `?${queryString}` : ""}`,
        {
            method: "GET",
        },
        token,
    );
}

export function prmAdminGetTicket(
    token: string,
    ticketId: number,
): Promise<{ status: "success"; ticket: PrmTicket }> {
    return prmAdminRequest(
        `/v1/admin/tickets/${ticketId}`,
        {
            method: "GET",
        },
        token,
    );
}

export function prmAdminReplyTicket(
    token: string,
    ticketId: number,
    message: string,
): Promise<{ status: "success"; code: string; message: PrmTicketMessage }> {
    return prmAdminRequest(
        `/v1/admin/tickets/${ticketId}/reply`,
        {
            method: "POST",
            body: JSON.stringify({ message }),
        },
        token,
    );
}

export function prmAdminUpdateTicketStatus(
    token: string,
    ticketId: number,
    status: PrmTicketStatus,
): Promise<{ status: "success"; code: string; ticket: PrmTicket }> {
    return prmAdminRequest(
        `/v1/admin/tickets/${ticketId}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({ status }),
        },
        token,
    );
}
